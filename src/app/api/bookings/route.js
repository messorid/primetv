export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { ensurePhotoTable, photoToAttachment } from "./photos/shared"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { applySchemaFixes } from "../../lib/schemaFixes.js"
import { getTransport, mailFrom } from "../../lib/mailer.js"
import { buildInstallerJobEmail, buildCancellationEmail, fullAddressOf } from "../../lib/installerEmails.js"
import { buildClientEmail } from "../../lib/clientEmail.js"
import { ensureCrewTable, normaliseShares, splitAmount, getCrewFor, crewOrLegacy } from "../../lib/crew.js"

function db() { return neon(process.env.DATABASE_URL) }

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name       TEXT, last_name TEXT, email TEXT, phone TEXT,
      referral         TEXT, payment TEXT, date TEXT, time_pref TEXT,
      address          JSONB, promo TEXT, coupon_code TEXT,
      coupon_label     TEXT, coupon_comment TEXT, tvs JSONB,
      more_tvs         BOOLEAN DEFAULT FALSE, more_tvs_comment TEXT,
      status           TEXT DEFAULT 'pending', notes TEXT,
      installer_id     UUID, installer_name TEXT, installer_email TEXT,
      assigned_at      TIMESTAMPTZ,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `
  // Add installer columns to existing tables
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS installer_id UUID`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS installer_name TEXT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS installer_email TEXT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS more_tvs BOOLEAN DEFAULT FALSE`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS more_tvs_comment TEXT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_mode TEXT DEFAULT 'standard'`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cable_concealment INT DEFAULT 0`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS combo_details TEXT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount_charged NUMERIC(10,2)`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount_paid_workers NUMERIC(10,2)`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS materials_cost NUMERIC(10,2)`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS company_profit NUMERIC(10,2)`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS profit_type TEXT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS profit_value NUMERIC(10,2)`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_quote BOOLEAN DEFAULT FALSE`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_mode TEXT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_tv_size TEXT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_tv_qty INT`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_price NUMERIC(10,2)`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS home_install_service TEXT`

  // ADD COLUMN IF NOT EXISTS cannot correct a column declared with the wrong
  // type. Those corrections live here.
  await applySchemaFixes(sql)
  await ensureCrewTable(sql)
}

// profitType: "percent" (profitValue is a % of charged-materials) or "fixed" ($ amount)
function computeFinancials({ charged, materials, profitType, profitValue }) {
  const subtotal      = charged - materials
  const companyProfit = profitType === "fixed" ? profitValue : subtotal * (profitValue / 100)
  const amountPaidWorkers = subtotal - companyProfit
  return { companyProfit, amountPaidWorkers }
}

// This route exposes every customer's name, address, phone and the company's
// financials, so all four methods require an admin session. The public booking
// form posts to /api/booking (singular), which stays open.
export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const sql = db()
    await ensureTable(sql)
    const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`
    const crewByBooking = await getCrewFor(sql, rows.map(r => r.id))
    return Response.json({
      ok: true,
      bookings: rows.map(r => ({
        ...toBooking(r),
        crew: crewOrLegacy(crewByBooking.get(r.id), r),
      })),
    })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const body = await request.json()
    const {
      firstName, lastName, email, phone, date, timePref,
      address, promo, tvs, moreTvs, moreTvsComment,
      payment, referral, notes, status,
    } = body
    const sql = db()
    await ensureTable(sql)
    const [row] = await sql`
      INSERT INTO bookings (
        first_name, last_name, email, phone, date, time_pref,
        address, promo, tvs, more_tvs, more_tvs_comment,
        payment, referral, notes, status
      ) VALUES (
        ${firstName || ""}, ${lastName || ""}, ${email || ""}, ${phone || ""},
        ${date || ""}, ${timePref || "Flexible"},
        ${JSON.stringify(address || {})}::jsonb,
        ${promo || null},
        ${JSON.stringify(tvs || [])}::jsonb,
        ${moreTvs || false}, ${moreTvsComment || null},
        ${payment || ""}, ${referral || null}, ${notes || null},
        ${status || "pending"}
      )
      RETURNING *
    `
    return Response.json({ ok: true, booking: toBooking(row) })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const body = await request.json()
    const { id, status, notes, installerId, installerName, installerEmail } = body
    const sql = db()

    // ── Assign installer ───────────────────────────────────────────────────────
    if (installerId !== undefined) {
      await sql`
        UPDATE bookings
        SET installer_id=${installerId}, installer_name=${installerName},
            installer_email=${installerEmail}, assigned_at=NOW()
        WHERE id=${id}
      `

      // Fetch booking to include in installer email
      const [b] = await sql`SELECT * FROM bookings WHERE id=${id}`
      if (b && installerEmail) {
        await sendInstallerEmail(b, installerName, installerEmail)
      }

      return Response.json({ ok: true })
    }

    // ── Assign a crew (one or more installers) ───────────────────────────────
    if (Array.isArray(body.crew)) {
      await ensureCrewTable(sql)

      const ids = body.crew.filter(Boolean)
      await sql`DELETE FROM booking_crew WHERE booking_id = ${id}`

      if (ids.length === 0) {
        await sql`
          UPDATE bookings
          SET installer_id=NULL, installer_name=NULL, installer_email=NULL, assigned_at=NULL
          WHERE id=${id}
        `
        return Response.json({ ok: true, crew: [] })
      }

      const people = await sql`
        SELECT id, name, email, crew_share FROM installers WHERE id = ANY(${ids}::uuid[])
      `
      if (people.length === 0) {
        return Response.json({ ok: false, error: "No matching installers" }, { status: 400 })
      }

      // Keep the order the caller sent, so the first stays the lead.
      const ordered = ids
        .map(i => people.find(p => p.id === i))
        .filter(Boolean)

      const shares = normaliseShares(ordered.map(p => ({
        installerId: p.id, installerName: p.name, installerEmail: p.email,
        crewShare: p.crew_share == null ? 50 : Number(p.crew_share),
      })))

      for (const m of shares) {
        await sql`
          INSERT INTO booking_crew (booking_id, installer_id, installer_name, installer_email, share_pct)
          VALUES (${id}, ${m.installerId}, ${m.installerName}, ${m.installerEmail}, ${m.sharePct})
        `
      }

      // The lead is mirrored onto the booking so everything written against a
      // single installer keeps working.
      const lead = shares[0]
      await sql`
        UPDATE bookings
        SET installer_id=${lead.installerId}, installer_name=${lead.installerName},
            installer_email=${lead.installerEmail}, assigned_at=NOW()
        WHERE id=${id}
      `

      const [b] = await sql`SELECT * FROM bookings WHERE id=${id}`
      if (b) {
        for (const m of shares) {
          if (m.installerEmail) {
            try {
              await sendInstallerEmail(b, m.installerName, m.installerEmail, shares)
            } catch (mailErr) {
              console.error("crew email failed for", m.installerEmail, mailErr)
            }
          }
        }
      }

      return Response.json({ ok: true, crew: shares })
    }

    // ── Resend installer email ────────────────────────────────────────────────
    if (body.resendInstaller) {
      const [b] = await sql`SELECT * FROM bookings WHERE id=${id}`
      if (b?.installer_email) {
        await sendInstallerEmail(b, b.installer_name, b.installer_email)
      }
      return Response.json({ ok: true })
    }

    // ── Update materials cost ─────────────────────────────────────────────────
    if (body.updateMaterials) {
      const materials = parseFloat(body.materialsCost) || 0
      const [b] = await sql`SELECT amount_charged, profit_type, profit_value FROM bookings WHERE id=${id}`
      if (b) {
        const charged     = parseFloat(b.amount_charged) || 0
        const profitType  = b.profit_type || "fixed"
        const profitValue = parseFloat(b.profit_value) || 0
        const { companyProfit, amountPaidWorkers } = computeFinancials({ charged, materials, profitType, profitValue })
        await sql`
          UPDATE bookings
          SET materials_cost=${materials}, amount_paid_workers=${amountPaidWorkers}, company_profit=${companyProfit}
          WHERE id=${id}
        `
        return Response.json({ ok: true, profit: companyProfit, amountPaidWorkers })
      }
      return Response.json({ ok: false }, { status: 404 })
    }

    // ── Update profit target (percent or fixed $) ────────────────────────────
    if (body.updateProfit) {
      const profitType  = body.profitType === "fixed" ? "fixed" : "percent"
      const profitValue = parseFloat(body.profitValue) || 0
      const [b] = await sql`SELECT amount_charged, materials_cost FROM bookings WHERE id=${id}`
      if (b) {
        const charged   = parseFloat(b.amount_charged) || 0
        const materials = parseFloat(b.materials_cost) || 0
        const { companyProfit, amountPaidWorkers } = computeFinancials({ charged, materials, profitType, profitValue })
        await sql`
          UPDATE bookings
          SET profit_type=${profitType}, profit_value=${profitValue},
              amount_paid_workers=${amountPaidWorkers}, company_profit=${companyProfit}
          WHERE id=${id}
        `
        return Response.json({ ok: true, profit: companyProfit, amountPaidWorkers })
      }
      return Response.json({ ok: false }, { status: 404 })
    }

    // ── Correct the customer's name, email or phone ──────────────────────────
    // A mistyped address is the usual reason a confirmation never arrives, so
    // this pairs with the resend below.
    if (body.updateCustomer) {
      const first = (body.firstName ?? "").trim()
      const last  = (body.lastName  ?? "").trim()
      const email = (body.email     ?? "").trim()
      const phone = (body.phone     ?? "").trim()

      if (!first && !last) {
        return Response.json({ ok: false, error: "Name is required" }, { status: 400 })
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json({ ok: false, error: "That email address is not valid" }, { status: 400 })
      }

      const [row] = await sql`
        UPDATE bookings
        SET first_name=${first}, last_name=${last}, email=${email}, phone=${phone}
        WHERE id=${id}
        RETURNING *
      `
      if (!row) return Response.json({ ok: false, error: "Booking not found" }, { status: 404 })
      return Response.json({ ok: true, booking: toBooking(row) })
    }

    // ── Resend the confirmation to the customer ──────────────────────────────
    if (body.resendClientEmail) {
      const [row] = await sql`SELECT * FROM bookings WHERE id=${id}`
      if (!row) return Response.json({ ok: false, error: "Booking not found" }, { status: 404 })

      const booking = toBooking(row)
      if (!booking.email) {
        return Response.json({ ok: false, error: "This booking has no email address" }, { status: 400 })
      }

      const user = process.env.EMAIL_USER
      const pass = process.env.EMAIL_PASS
      if (!user || !pass) {
        return Response.json({ ok: false, error: "Email is not configured on the server" }, { status: 500 })
      }

      try {
        const mail = buildClientEmail(booking, { organizer: user })
        const transporter = getTransport()
        await transporter.sendMail({
          from: mailFrom("PrimeTvNashville"),
          to: booking.email,
          subject: mail.subject,
          attachments: mail.attachments,
          html: mail.html,
        })
        return Response.json({ ok: true, sentTo: booking.email })
      } catch (mailErr) {
        console.error("resend client email failed", mailErr)
        return Response.json(
          { ok: false, error: mailErr?.message || "Could not send the email" },
          { status: 502 }
        )
      }
    }

    // ── Update date / time ────────────────────────────────────────────────────
    if (body.updateSchedule) {
      await sql`UPDATE bookings SET date=${body.date || ""}, time_pref=${body.timePref || ""} WHERE id=${id}`
      return Response.json({ ok: true })
    }

    // ── Complete with financial data ───────────────────────────────────────────
    if (status === "completed" && body.amountCharged !== undefined) {
      const charged     = parseFloat(body.amountCharged) || 0
      const materials    = parseFloat(body.materialsCost) || 0
      const profitType  = body.profitType === "fixed" ? "fixed" : "percent"
      const profitValue = parseFloat(body.profitValue) || 0
      const { companyProfit, amountPaidWorkers } = computeFinancials({ charged, materials, profitType, profitValue })

      await ensureCrewTable(sql)

      // Divide the worker pay across the crew. An explicit split from the
      // complete form wins; otherwise fall back to the shares already on the
      // job, which came from each installer's weight when they were assigned.
      const existing = await sql`
        SELECT installer_id, installer_name, installer_email, share_pct
        FROM booking_crew WHERE booking_id = ${id}
      `

      let shares = null
      if (Array.isArray(body.crewShares) && body.crewShares.length) {
        const total = body.crewShares.reduce((t, c) => t + (Number(c.sharePct) || 0), 0)
        if (Math.abs(total - 100) > 0.5) {
          return Response.json(
            { ok: false, error: `The crew split must add up to 100% (it adds up to ${total.toFixed(1)}%)` },
            { status: 400 }
          )
        }
        const byId = new Map(existing.map(e => [e.installer_id, e]))
        shares = body.crewShares.map(c => {
          const known = byId.get(c.installerId)
          return {
            installerId:    c.installerId,
            installerName:  c.installerName  || known?.installer_name  || "",
            installerEmail: c.installerEmail || known?.installer_email || null,
            sharePct:       Number(c.sharePct) || 0,
          }
        })
      } else if (existing.length) {
        shares = existing.map(e => ({
          installerId:    e.installer_id,
          installerName:  e.installer_name,
          installerEmail: e.installer_email,
          sharePct:       e.share_pct == null ? 0 : Number(e.share_pct),
        }))
      }

      if (shares && shares.length) {
        const paid = splitAmount(amountPaidWorkers, shares)
        await sql`DELETE FROM booking_crew WHERE booking_id = ${id}`
        for (const m of paid) {
          await sql`
            INSERT INTO booking_crew (booking_id, installer_id, installer_name, installer_email, share_pct, amount)
            VALUES (${id}, ${m.installerId}, ${m.installerName}, ${m.installerEmail}, ${m.sharePct}, ${m.amount})
          `
        }
      }

      await sql`
        UPDATE bookings
        SET status='completed', amount_charged=${charged},
            amount_paid_workers=${amountPaidWorkers}, materials_cost=${materials},
            profit_type=${profitType}, profit_value=${profitValue},
            company_profit=${companyProfit}, completed_at=NOW()
            ${notes !== undefined ? sql`, notes=${notes}` : sql``}
        WHERE id=${id}
      `
      return Response.json({ ok: true, profit: companyProfit, amountPaidWorkers })
    }

    // ── Update status / notes ──────────────────────────────────────────────────
    if (status !== undefined && notes !== undefined) {
      await sql`UPDATE bookings SET status=${status}, notes=${notes} WHERE id=${id}`
    } else if (status !== undefined) {
      await sql`UPDATE bookings SET status=${status} WHERE id=${id}`
    } else if (notes !== undefined) {
      await sql`UPDATE bookings SET notes=${notes} WHERE id=${id}`
    }

    // Send cancellation email to installer if applicable
    if (status === "cancelled") {
      const [b] = await sql`SELECT * FROM bookings WHERE id=${id}`
      if (b?.installer_email) {
        await sendCancellationEmail(b).catch(err => console.error("Cancel email error:", err))
      }
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false }, { status: 500 })
  }
}

export async function DELETE(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const sql = db()
    await sql`DELETE FROM bookings WHERE id=${id}`
    // Photos are in a separate table with no FK, so clean them up here rather
    // than leaving orphaned base64 behind. Never let this fail the delete.
    try {
      await sql`DELETE FROM booking_photos WHERE booking_id=${id}`
    } catch (photoErr) {
      console.error("Could not delete photos for booking", id, photoErr)
    }
    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false }, { status: 500 })
  }
}

// ── ICS calendar invite builder ───────────────────────────────────────────────
function buildICS({ uid, date, timePref, summary, description, location, organizer, attendees }) {
  if (!date) return null
  let startH = 10, startM = 0
  const m = (timePref || "").match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (m) {
    startH = parseInt(m[1]); startM = parseInt(m[2])
    if (m[3].toUpperCase() === "PM" && startH !== 12) startH += 12
    if (m[3].toUpperCase() === "AM" && startH === 12) startH = 0
  } else if (/morning/i.test(timePref))   { startH = 9  }
  else if (/afternoon/i.test(timePref))   { startH = 13 }
  else if (/evening/i.test(timePref))     { startH = 17 }
  const p2 = n => String(n).padStart(2, "0")
  const [y, mo, d] = date.split("-")
  const dtStart = `${y}${mo}${d}T${p2(startH)}${p2(startM)}00`
  const dtEnd   = `${y}${mo}${d}T${p2(Math.min(startH + 2, 23))}${p2(startM)}00`
  const stamp   = new Date().toISOString().replace(/[-:.]/g,"").slice(0,15) + "Z"
  return [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//PrimeTvNashville//EN",
    "METHOD:REQUEST","CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid || Date.now()}@primetv`, `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/Chicago:${dtStart}`,
    `DTEND;TZID=America/Chicago:${dtEnd}`,
    `SUMMARY:${summary}`,
    description ? `DESCRIPTION:${description.replace(/[\r\n]+/g,"\\n")}` : "",
    location    ? `LOCATION:${location}` : "",
    `ORGANIZER;CN=PrimeTvNashville:mailto:${organizer}`,
    ...(attendees||[]).filter(a=>a?.email).map(a=>
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${a.name}:mailto:${a.email}`
    ),
    "STATUS:CONFIRMED","END:VEVENT","END:VCALENDAR",
  ].filter(Boolean).join("\r\n")
}

// ── Installer assignment email ─────────────────────────────────────────────────
async function sendInstallerEmail(b, installerName, installerEmail, crew = null) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  if (!user || !pass) return

  const transporter = getTransport()
  const fullAddress = fullAddressOf(b)

  // Job photos uploaded from the admin panel, attached and shown inline.
  let photoAttachments = []
  try {
    const sql = db()
    await ensurePhotoTable(sql)
    const rows = await sql`
      SELECT id, filename, mime, data_url FROM booking_photos
      WHERE booking_id = ${b.id} ORDER BY created_at ASC
    `
    photoAttachments = rows.map((r, i) => photoToAttachment(r, i)).filter(Boolean)
  } catch (photoErr) {
    console.error("Could not load job photos for installer email", photoErr)
  }

  const ics = buildICS({
    uid:         `${b.id}@primetv`,
    date:        b.date,
    timePref:    b.time_pref,
    summary:     `Job Assignment — ${safe(b.first_name)} ${safe(b.last_name)}`,
    description: `Customer: ${safe(b.first_name)} ${safe(b.last_name)}\nPhone: ${safe(b.phone)}\nAddress: ${fullAddress}`,
    location:    fullAddress,
    organizer:   user,
    attendees:   [{ name: installerName, email: installerEmail }],
  })

  const attachments = [
    ...(ics ? [{ filename: "job.ics", content: ics, contentType: "text/calendar; method=REQUEST; charset=utf-8" }] : []),
    ...photoAttachments,
  ]

  const mail = buildInstallerJobEmail({ b, installerName, crew, photoAttachments })
  await transporter.sendMail({
    from:    mailFrom("PrimeTvNashville"),
    to:      installerEmail,
    subject: mail.subject,
    attachments,
    html:    mail.html,
  })
}

// ── Cancellation email to installer ──────────────────────────────────────────
async function sendCancellationEmail(b) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  if (!user || !pass || !b.installer_email) return

  const transporter = getTransport()
  const mail = buildCancellationEmail(b)
  await transporter.sendMail({
    from:    mailFrom("PrimeTvNashville"),
    to:      b.installer_email,
    subject: mail.subject,
    html:    mail.html,
  })
}


function safe(v) {
  return String(v ?? "-").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
}

function toBooking(row) {
  return {
    _id:                row.id,
    firstName:          row.first_name,
    lastName:           row.last_name,
    email:              row.email,
    phone:              row.phone,
    referral:           row.referral,
    payment:            row.payment,
    date:               row.date,
    timePreference:     row.time_pref,
    address:            row.address,
    selectedPromo:      row.promo,
    bookingMode:        row.booking_mode,
    cableConcealment:   row.cable_concealment,
    comboDetails:       row.combo_details,
    homeInstallService: row.home_install_service,
    couponCode:         row.coupon_code,
    appliedCouponLabel: row.coupon_label,
    couponComment:      row.coupon_comment,
    customQuote:        row.custom_quote,
    customMode:         row.custom_mode,
    customTvSize:       row.custom_tv_size,
    customTvQty:        row.custom_tv_qty,
    customPrice:        row.custom_price,
    moreTvs:            row.more_tvs,
    moreTvsComment:     row.more_tvs_comment,
    tvs:                row.tvs || [],
    status:             row.status,
    notes:              row.notes,
    installerId:        row.installer_id,
    installerName:      row.installer_name,
    installerEmail:     row.installer_email,
    assignedAt:         row.assigned_at,
    amountCharged:      row.amount_charged,
    amountPaidWorkers:  row.amount_paid_workers,
    materialsCost:      row.materials_cost,
    companyProfit:      row.company_profit,
    profitType:         row.profit_type,
    profitValue:        row.profit_value,
    completedAt:        row.completed_at,
    createdAt:          row.created_at,
  }
}
