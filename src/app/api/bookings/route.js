export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import nodemailer from "nodemailer"
import { ensurePhotoTable, photoToAttachment } from "./photos/shared"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"

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
    return Response.json({ ok: true, bookings: rows.map(toBooking) })
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

// Every free-text field the customer or office can fill in. These were being
// dropped from the work order, so an installer arrived without the wall notes,
// the bundle description or the custom-quote instructions.
function buildServiceDetail(b) {
  const parts = []

  if (b.promo) parts.push(`<strong>Package:</strong> ${safe(b.promo)}`)

  if (b.custom_quote && b.custom_tv_size) {
    parts.push(`<strong>Custom job:</strong> ${safe(b.custom_tv_size)}${b.custom_tv_qty ? ` × ${safe(b.custom_tv_qty)}` : ""}`)
  }

  const tvs = Array.isArray(b.tvs) ? b.tvs : []
  if (tvs.length) {
    parts.push(tvs.map((tv, i) =>
      `TV #${i + 1}: ${safe(tv.size)}${tv.exactSize ? ` (${safe(tv.exactSize)}")` : ""} · ${safe(tv.wallType)}` +
      (tv.comments ? `<br><span style="color:#b45309;">↳ ${safe(tv.comments)}</span>` : "")
    ).join("<br>"))
  }

  if (b.more_tvs) parts.push(`<strong>3 or more TVs</strong> — custom quote`)

  const cableQty = parseInt(b.cable_concealment) || 0
  if (cableQty > 0) parts.push(`<strong>🔌 Cable concealment ×${cableQty}</strong>`)

  return parts.length ? parts.join("<br>") : "—"
}

// Free-text the customer typed, shown as its own highlighted block so it can't
// be skimmed past.
function buildCustomerNotes(b) {
  const notes = [
    ["Job description", b.combo_details],
    ["TV details (3+ TVs)", b.more_tvs_comment],
    ["Quote note", b.coupon_comment],
  ].filter(([, v]) => v && String(v).trim())

  if (!notes.length) return ""

  return `
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:20px;margin-top:16px;">
      <h4 style="margin:0 0 12px;font-size:15px;color:#92400e;">📋 Customer Description</h4>
      ${notes.map(([label, value]) => `
        <p style="margin:0 0 10px;font-size:13px;color:#78350f;">
          <strong>${label}:</strong><br>${safe(value).replace(/\n/g, "<br>")}
        </p>
      `).join("")}
    </div>
  `
}

// ── Installer assignment email ─────────────────────────────────────────────────
async function sendInstallerEmail(b, installerName, installerEmail) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  if (!user || !pass) return

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } })

  const serviceDetail = buildServiceDetail(b)
  const customerNotes = buildCustomerNotes(b)

  const fullAddress = [b.address?.street, b.address?.apt, b.address?.city, b.address?.state, b.address?.zip]
    .filter(Boolean).join(", ")

  // Job photos uploaded from the admin panel, attached and shown inline.
  let photoAttachments = []
  let photoHtml = ""
  try {
    const sql = db()
    await ensurePhotoTable(sql)
    const rows = await sql`
      SELECT id, filename, mime, data_url FROM booking_photos
      WHERE booking_id = ${b.id} ORDER BY created_at ASC
    `
    photoAttachments = rows.map((r, i) => photoToAttachment(r, i)).filter(Boolean)
    if (photoAttachments.length) {
      photoHtml = `
        <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;padding:20px;margin-top:16px;">
          <h4 style="margin:0 0 12px;font-size:15px;color:#1d4ed8;">
            📸 Job Photos (${photoAttachments.length})
          </h4>
          ${photoAttachments.map(a => `
            <img src="cid:${a.cid}" alt="Job photo"
                 style="width:100%;max-width:520px;border-radius:8px;border:1px solid #cbd5e1;margin-bottom:10px;display:block;">
          `).join("")}
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;">
            Photos are also attached to this email.
          </p>
        </div>
      `
    }
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

  const mapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null

  await transporter.sendMail({
    from:    `"PrimeTvNashville" <${user}>`,
    to:      installerEmail,
    subject: `New Job Assigned — ${b.date || "TBD"} | ${safe(b.first_name)} ${safe(b.last_name)}`,
    attachments,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
        <h2 style="color:#e50914;border-bottom:3px solid #e50914;padding-bottom:12px;margin-bottom:0;">
          📺 New Job Assignment
        </h2>

        <p style="color:#444;margin-top:16px;font-size:15px;">
          Hi <strong>${safe(installerName)}</strong>, you have been assigned a new installation job.
        </p>

        <div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:20px;margin-top:20px;">
          <h4 style="margin:0 0 14px;font-size:15px;color:#222;">Job Details</h4>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            ${irow("📅 Date",     b.date || "TBD")}
            ${irow("🕐 Time",     b.time_pref || "Flexible")}
            ${irow("📍 Address",  mapsUrl
                ? `${safe(fullAddress)}<br><a href="${mapsUrl}" style="color:#e50914;font-weight:600;">Open in Google Maps →</a>`
                : "—")}
            ${irow("🔧 Service",  serviceDetail)}
            ${b.payment ? irow("💵 Payment", safe(b.payment)) : ""}
          </table>
        </div>

        ${customerNotes}

        ${b.notes ? `
          <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:20px;margin-top:16px;">
            <h4 style="margin:0 0 10px;font-size:15px;color:#5b21b6;">🗒️ Office Notes</h4>
            <p style="margin:0;font-size:13px;color:#4c1d95;">${safe(b.notes).replace(/\n/g, "<br>")}</p>
          </div>
        ` : ""}

        ${photoHtml}

        <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:20px;margin-top:16px;">
          <h4 style="margin:0 0 14px;font-size:15px;color:#222;">Customer</h4>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            ${irow("👤 Name",  `${safe(b.first_name)} ${safe(b.last_name)}`)}
            ${b.phone ? irow("📞 Phone", `<a href="tel:${safe(b.phone).replace(/[^0-9+]/g, "")}" style="color:#e50914;font-weight:600;">${safe(b.phone)}</a>`) : ""}
          </table>
        </div>

        <p style="margin-top:24px;color:#888;font-size:12px;">
          Questions? Contact the office at <strong>(615) 669-0251</strong> or reply to this email.
        </p>
      </div>
    `,
  })
}

// ── Cancellation email to installer ──────────────────────────────────────────
async function sendCancellationEmail(b) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  if (!user || !pass || !b.installer_email) return

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } })

  const fullAddress = [b.address?.street, b.address?.apt, b.address?.city, b.address?.state, b.address?.zip]
    .filter(Boolean).join(", ")

  await transporter.sendMail({
    from:    `"PrimeTvNashville" <${user}>`,
    to:      b.installer_email,
    subject: `❌ Job Cancelled — ${b.date || "TBD"} | ${safe(b.first_name)} ${safe(b.last_name)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
        <h2 style="color:#dc2626;border-bottom:3px solid #dc2626;padding-bottom:12px;margin-bottom:0;">
          ❌ Job Cancelled
        </h2>

        <p style="color:#444;margin-top:16px;font-size:15px;">
          Hi <strong>${safe(b.installer_name)}</strong>,<br><br>
          The following job that was assigned to you has been <strong style="color:#dc2626;">cancelled</strong>.
          You do not need to attend this appointment.
        </p>

        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:20px;margin-top:20px;">
          <h4 style="margin:0 0 14px;font-size:15px;color:#222;">Cancelled Job Details</h4>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            ${irow("📅 Date",    b.date || "TBD")}
            ${irow("🕐 Time",    b.time_pref || "Flexible")}
            ${irow("📍 Address", fullAddress || "—")}
            ${irow("👤 Customer", `${safe(b.first_name)} ${safe(b.last_name)}`)}
          </table>
        </div>

        <p style="margin-top:24px;color:#888;font-size:12px;">
          Questions? Contact the office at <strong>(615) 669-0251</strong> or reply to this email.
        </p>
      </div>
    `,
  })
}

function irow(label, value) {
  return `
    <tr>
      <td style="padding:6px 0;width:130px;font-weight:600;color:#555;font-size:13px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:13px;color:#333;">${value}</td>
    </tr>
  `
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
