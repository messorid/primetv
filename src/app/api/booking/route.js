export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import nodemailer from "nodemailer"
import { neon } from "@neondatabase/serverless"
import { applySchemaFixes } from "../../lib/schemaFixes.js"
import {
  buildClientEmail, buildICS, safe, formatAddress,
  PROMO_PRICES, HOME_INSTALL_LABELS,
} from "../../lib/clientEmail.js"

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      date, timePreference, tvs, address, info,
      bookingMode, selectedPromo, cableConcealment, comboDetails,
      homeInstallService, homeInstallDetails,
      couponCode, appliedCouponLabel, couponComment, couponHidden,
      customQuote, customMode, customTvSize, customTvQty, customPrice,
      moreTvs, moreTvsComment,
    } = body

    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASS

    const canEmail = Boolean(user && pass)
    if (!canEmail) console.error("SMTP credentials missing — booking will be saved but no email sent")

    const transporter = canEmail
      ? nodemailer.createTransport({ service: "gmail", auth: { user, pass } })
      : null

    // An email problem must never cost us the booking record, so every send is
    // isolated and reports success rather than throwing out of the handler.
    async function trySend(label, opts) {
      if (!transporter) return false
      try {
        await transporter.sendMail(opts)
        return true
      } catch (mailErr) {
        console.error(`${label} email failed`, mailErr)
        return false
      }
    }

    const fullName = `${safe(info.firstName)} ${safe(info.lastName)}`
    const fullAddress = formatAddress(address)

    const tvList      = (tvs || [])
    const isStandard  = !bookingMode || bookingMode === "standard"
    const isPromo     = bookingMode === "promo"
    const isCombo     = bookingMode === "bundle"
    const isHomeInst  = bookingMode === "homeinstall"
    const hasPromo    = isPromo && !!selectedPromo
    const promoPrice  = hasPromo ? (PROMO_PRICES[selectedPromo] || "See quote") : ""
    const homeInstLbl = isHomeInst
      ? (HOME_INSTALL_LABELS[homeInstallService] || homeInstallService || "Installation")
      : ""

    const cableQty   = parseInt(cableConcealment) || 0
    const cableTotal = cableQty * 60
    const cableLine  = cableQty > 0 ? ` + Cable Concealment ×${cableQty} (+$${cableTotal})` : ""

    const isFrameTv = tv => tv?.model === "frame"
    const anyFrameTv = tvList.some(isFrameTv)

    const tvRows = tvList.map((tv, idx) => `
      <tr style="background:${idx % 2 ? "#fafafa" : "#fff"};">
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${idx + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">
          ${isFrameTv(tv)
            ? `<strong style="color:#e50914;">Frame TV</strong>`
            : "Standard"}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">
          ${tv.size ? `${safe(tv.size)}"` : "-"}${tv.exactSize ? ` (${safe(tv.exactSize)}")` : ""}
          ${tv.measurements ? `<br><span style="font-size:12px;color:#b45309;">${safe(tv.measurements)}</span>` : ""}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safe(tv.wallType)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safe(tv.comments) || "-"}</td>
      </tr>
    `).join("")

    // Home installation request — always quote-based, never a published rate.
    const homeInstallBlock = isHomeInst ? `
      <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;padding:16px 20px;margin-top:20px;">
        <p style="margin:0;font-size:12px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.05em;">
          🔧 Home Installation — Quote Based
        </p>
        <p style="margin:8px 0 0;font-size:15px;font-weight:700;color:#1e3a8a;">${safe(homeInstLbl)}</p>
        ${homeInstallDetails ? `<p style="margin:8px 0 0;font-size:13px;color:#1e40af;">${safe(homeInstallDetails).replace(/\n/g, "<br>")}</p>` : ""}
        <p style="margin:10px 0 0;font-size:12px;color:#3b82f6;">
          We will review this request and contact you with pricing before the appointment.
        </p>
      </div>
    ` : ""

    const frameTvBlock = anyFrameTv ? `
      <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:14px 18px;margin-top:12px;">
        <p style="margin:0;font-size:12px;font-weight:700;color:#e50914;text-transform:uppercase;letter-spacing:.05em;">
          🖼️ Frame TV — Quote Based
        </p>
        <p style="margin:6px 0 0;font-size:13px;color:#7f1d1d;">
          Frame TV installations are quoted individually based on the measurements, the mount and the
          wall. One of our sales representatives will confirm your exact price before the appointment.
        </p>
      </div>
    ` : ""

    // ── Price / promo block for client email ──────────────────────────────────
    const promoPriceBlock = hasPromo ? `
      <div style="background:#fff5f5;border:2px solid #e50914;border-radius:10px;padding:16px 20px;margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <p style="margin:0;font-size:12px;font-weight:700;color:#e50914;text-transform:uppercase;letter-spacing:.05em;">Package Price</p>
            <p style="margin:4px 0 0;font-size:13px;color:#555;">${safe(selectedPromo)}</p>
          </div>
          <span style="font-size:28px;font-weight:900;color:#e50914;">${promoPrice}</span>
        </div>
        ${cableQty > 0 ? `<p style="margin:10px 0 0;font-size:13px;color:#e50914;font-weight:600;">🔌 + Cable Concealment ×${cableQty}: +$${cableTotal}</p>` : ""}
      </div>
    ` : ""

    // Client sees offer text only; code name hidden if couponHidden
    const couponBlock = (couponCode && appliedCouponLabel && !customQuote) ? `
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px 18px;margin-top:12px;">
        ${!couponHidden ? `<p style="margin:0;font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:.05em;">Coupon Applied — ${safe(couponCode)}</p>` : ""}
        <p style="margin:${couponHidden ? "0" : "6px"} 0 0;font-size:14px;color:#166534;font-weight:600;">${safe(appliedCouponLabel)}</p>
        ${couponComment ? `<p style="margin:8px 0 0;font-size:13px;color:#166534;font-style:italic;">"${safe(couponComment)}"</p>` : ""}
      </div>
    ` : ""

    // Custom quote — manual price/size override entered by the business.
    // The coupon code itself never appears here, only the resulting price/details.
    const customPriceNum = customQuote && customPrice != null && customPrice !== "" ? parseFloat(customPrice) : null
    const customQuoteBlock = customQuote ? `
      <div style="background:#fff5f5;border:2px solid #e50914;border-radius:10px;padding:16px 20px;margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <p style="margin:0;font-size:12px;font-weight:700;color:#e50914;text-transform:uppercase;letter-spacing:.05em;">Installation Price</p>
            ${customMode === "sized" && customTvSize ? `<p style="margin:4px 0 0;font-size:13px;color:#555;">${safe(customTvSize)}${customTvQty ? ` × ${customTvQty}` : ""}</p>` : ""}
          </div>
          ${customPriceNum != null ? `<span style="font-size:28px;font-weight:900;color:#e50914;">$${customPriceNum.toFixed(2)}</span>` : ""}
        </div>
        ${couponComment ? `<p style="margin:10px 0 0;font-size:13px;color:#78350f;font-style:italic;">"${safe(couponComment)}"</p>` : ""}
      </div>
    ` : ""

    const moreTvsBlock = moreTvs ? `
      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:14px 18px;margin-top:12px;">
        <p style="margin:0;font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.05em;">3+ TVs — Custom Quote</p>
        <p style="margin:6px 0 0;font-size:13px;color:#78350f;">Pricing varies for 3 or more TVs. We will contact you to confirm the total before the appointment.</p>
        ${moreTvsComment ? `<p style="margin:8px 0 0;font-size:13px;color:#78350f;font-style:italic;">"${safe(moreTvsComment)}"</p>` : ""}
      </div>
    ` : ""

    // ── Calendar invites ──────────────────────────────────────────────────────
    const icsUID = `${date || "nodate"}-${(info.email || "").replace(/[^a-z0-9]/gi, "")}@primetv`
    const icsBase = { uid: icsUID, date, timePref: timePreference, location: fullAddress,
      organizer: user, description: `Customer: ${fullName}\nPhone: ${info.phone}\nAddress: ${fullAddress}` }

    const icsForBusiness = date ? buildICS({
      ...icsBase,
      summary: `TV Installation — ${fullName}`,
      attendees: [{ name: "PrimeTvNashville", email: "tvprimenashville@gmail.com" }],
    }) : null

    const icsForClient = date ? buildICS({
      ...icsBase,
      summary: "TV Installation — PrimeTvNashville",
      description: `Your TV installation appointment.\nAddress: ${fullAddress}`,
      attendees: [{ name: fullName, email: info.email }],
    }) : null

    // ── Save to Neon Postgres ──────────────────────────────────────────────────
    // This runs BEFORE any email. A booking whose confirmation bounces — a
    // mistyped customer address is enough — used to throw out of the handler
    // before reaching this point, returning a 500 and losing the record even
    // though the business copy had already gone out.
    //
    // Fast path is the INSERT alone. The schema migration only runs if the
    // insert fails, so a normal booking is one round trip instead of twelve.
    // A home installation carries its own free-text description; it lands in
    // combo_details so every quote-based job description reads from one column,
    // with booking_mode telling the two apart.
    const jobDescription = isHomeInst ? (homeInstallDetails || "") : (comboDetails || "")

    const insertBooking = (sql) => sql`
      INSERT INTO bookings
        (first_name, last_name, email, phone, referral, payment, date, time_pref,
         address, promo, coupon_code, coupon_label, coupon_comment, tvs,
         more_tvs, more_tvs_comment, booking_mode, cable_concealment, combo_details,
         home_install_service,
         custom_quote, custom_mode, custom_tv_size, custom_tv_qty, custom_price)
      VALUES
        (${info.firstName}, ${info.lastName}, ${info.email}, ${info.phone},
         ${info.referral}, ${info.payment}, ${date}, ${timePreference},
         ${JSON.stringify(address)}, ${selectedPromo || ""},
         ${couponCode || ""}, ${appliedCouponLabel || ""},
         ${couponComment || ""}, ${JSON.stringify(tvList)},
         ${!!moreTvs}, ${moreTvsComment || ""},
         ${bookingMode || "standard"}, ${cableQty}, ${jobDescription},
         ${isHomeInst ? (homeInstallService || "") : ""},
         ${!!customQuote}, ${customMode || null}, ${customTvSize || null},
         ${customQuote && customMode === "sized" ? (parseInt(customTvQty) || null) : null},
         ${customPriceNum})
    `

    async function ensureSchema(sql) {
      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          first_name        TEXT, last_name TEXT, email TEXT, phone TEXT,
          referral          TEXT, payment TEXT, date TEXT, time_pref TEXT,
          address           JSONB, promo TEXT, coupon_code TEXT,
          coupon_label      TEXT, coupon_comment TEXT, tvs JSONB,
          more_tvs          BOOLEAN DEFAULT FALSE, more_tvs_comment TEXT,
          booking_mode      TEXT DEFAULT 'standard',
          cable_concealment INT DEFAULT 0,
          combo_details     TEXT,
          status            TEXT DEFAULT 'pending', notes TEXT,
          created_at        TIMESTAMPTZ DEFAULT NOW()
        )
      `
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS more_tvs BOOLEAN DEFAULT FALSE`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS more_tvs_comment TEXT`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_mode TEXT DEFAULT 'standard'`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cable_concealment INT DEFAULT 0`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS combo_details TEXT`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_quote BOOLEAN DEFAULT FALSE`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_mode TEXT`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_tv_size TEXT`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_tv_qty INT`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_price NUMERIC(10,2)`
      await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS home_install_service TEXT`
      await applySchemaFixes(sql)
    }

    let dbSaved = false
    let dbErrMsg = ""

    for (let attempt = 1; attempt <= 3 && !dbSaved; attempt++) {
      try {
        const sql = neon(process.env.DATABASE_URL)
        try {
          await insertBooking(sql)
        } catch (insertErr) {
          // Missing table or column — migrate, then retry the insert once.
          await ensureSchema(sql)
          await insertBooking(sql)
        }
        dbSaved = true
      } catch (dbErr) {
        dbErrMsg = dbErr?.message || String(dbErr)
        console.error(`DB save error (attempt ${attempt}/3)`, dbErr)
        if (attempt < 3) await new Promise(r => setTimeout(r, 400 * attempt))
      }
    }


    // ── Email to business ──────────────────────────────────────────────────────
    const businessEmailSent = await trySend("business", {
      from: `"PrimeTvNashville Bookings" <${user}>`,
      to: "tvprimenashville@gmail.com",
      replyTo: info.email,
      subject: `New Booking — ${fullName} | ${date}`,
      attachments: icsForBusiness ? [{ filename: "appointment.ics", content: icsForBusiness, contentType: "text/calendar; method=REQUEST; charset=utf-8" }] : [],
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <h2 style="color:#222;border-bottom:3px solid #e50914;padding-bottom:12px;margin-bottom:0;">
            📺 New Booking Request
          </h2>

          <table style="width:100%;margin-top:20px;border-collapse:collapse;">
            ${brow("Customer", fullName)}
            ${brow("Email", info.email)}
            ${brow("Phone", info.phone)}
            ${brow("Date Requested", date)}
            ${brow("Time Preference", timePreference)}
            ${brow("Service Address", fullAddress)}
            ${brow("Booking Mode", isHomeInst ? "Home Installation" : isCombo ? "Bundle (custom)" : isPromo ? "Promo Package" : "Standard")}
            ${hasPromo ? brow("Promo Selected", `${safe(selectedPromo)} — <strong>${promoPrice}</strong>`) : ""}
            ${isHomeInst ? brow("Service Requested", `<strong>${safe(homeInstLbl)}</strong> — quote based`) : ""}
            ${isHomeInst && homeInstallDetails ? brow("Job Description", safe(homeInstallDetails)) : ""}
            ${anyFrameTv ? brow("Frame TV", "Yes — quote based") : ""}
            ${isCombo && comboDetails ? brow("Job Description", safe(comboDetails)) : ""}
            ${isStandard && cableQty > 0 ? brow("Cable Concealment", `×${cableQty} — $${cableTotal}`) : ""}
            ${isPromo && cableQty > 0 ? brow("Cable Concealment", `×${cableQty} — $${cableTotal}`) : ""}
            ${couponCode ? brow("Coupon Code", `${safe(couponCode)} — ${safe(appliedCouponLabel)}`) : ""}
            ${customQuote ? brow("Custom Quote Mode", customMode === "sized" ? "TV Size & Qty" : "Comment Only") : ""}
            ${customQuote && customMode === "sized" && customTvSize ? brow("Custom TV Size", `${safe(customTvSize)}${customTvQty ? ` × ${customTvQty}` : ""}`) : ""}
            ${customQuote && customPriceNum != null ? brow("Custom Price", `<strong>$${customPriceNum.toFixed(2)}</strong>`) : ""}
            ${couponComment ? brow("Coupon Comment", safe(couponComment)) : ""}
            ${moreTvs ? brow("3+ TVs", "Yes — custom quote needed") : ""}
            ${moreTvsComment ? brow("TV Details", safe(moreTvsComment)) : ""}
            ${brow("How they found us", info.referral)}
            ${brow("Payment Method", info.payment)}
          </table>

          ${isHomeInst ? homeInstallBlock : isCombo ? `
            <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:14px 18px;margin-top:16px;">
              <p style="margin:0;font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.05em;">Bundle — Custom Job</p>
              <p style="margin:8px 0 0;font-size:14px;color:#78350f;">${safe(comboDetails || "-")}</p>
            </div>
          ` : hasPromo ? `
            <p style="margin:20px 0 8px;font-size:13px;color:#888;font-style:italic;">
              Package promo — TV details not required.
            </p>
          ` : `
            <h4 style="margin:28px 0 8px;color:#444;font-size:15px;">TV Details (${tvList.length} TV${tvList.length !== 1 ? "s" : ""})</h4>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <thead>
                <tr style="background:#f0f0f0;">
                  <th style="padding:8px 12px;text-align:left;">#</th>
                  <th style="padding:8px 12px;text-align:left;">Model</th>
                  <th style="padding:8px 12px;text-align:left;">Size / Measurements</th>
                  <th style="padding:8px 12px;text-align:left;">Wall Type</th>
                  <th style="padding:8px 12px;text-align:left;">Comments</th>
                </tr>
              </thead>
              <tbody>${tvRows}</tbody>
            </table>
            ${frameTvBlock}
          `}
          ${cableQty > 0 && !isCombo ? `
            <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;padding:12px 16px;margin-top:12px;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#1d4ed8;">🔌 Cable Concealment ×${cableQty} — +$${cableTotal}</p>
            </div>
          ` : ""}

          <p style="margin-top:28px;font-size:12px;color:#aaa;">
            Submitted from PrimeTvNashville.com
          </p>
        </div>
      `,
    })

    // ── Confirmation email to client ───────────────────────────────────────────
    // Built from the same module the admin panel uses to resend it, so a resend
    // is byte-for-byte the message the customer originally got.
    const clientEmail = buildClientEmail({
      firstName: info.firstName, lastName: info.lastName, email: info.email,
      date, timePreference, address,
      bookingMode, selectedPromo, cableConcealment: cableQty,
      comboDetails: jobDescription, homeInstallService,
      couponCode, appliedCouponLabel, couponComment, couponHidden,
      customQuote, customMode, customTvSize, customTvQty, customPrice,
      moreTvs, moreTvsComment, tvs: tvList,
    }, { organizer: user })

    const clientEmailSent = await trySend("client confirmation", {
      from: `"PrimeTvNashville" <${user}>`,
      to: info.email,
      bcc: "messoweb@gmail.com",
      subject: clientEmail.subject,
      attachments: clientEmail.attachments,
      html: clientEmail.html,
    })

    // A booking that never reached the database used to disappear silently while
    // the customer still got a confirmation. Now it always alerts the business.
    if (!dbSaved) {
      await trySend("db-failure alert", {
          from: `"PrimeTvNashville Bookings" <${user}>`,
          to: "tvprimenashville@gmail.com",
          subject: `⚠️ BOOKING NOT SAVED TO DATABASE — ${fullName} | ${date}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;border:2px solid #e50914;border-radius:12px;">
              <h2 style="color:#e50914;margin:0 0 8px;">⚠️ Booking did NOT save to the database</h2>
              <p style="color:#444;font-size:14px;margin:0 0 16px;">
                The customer received their confirmation email, but the record could not be written
                to the bookings table after 3 attempts. <strong>Add it manually in the admin panel
                or this job will not appear anywhere.</strong>
              </p>
              <table style="width:100%;border-collapse:collapse;">
                ${brow("Customer", fullName)}
                ${brow("Email", info.email)}
                ${brow("Phone", info.phone)}
                ${brow("Date", date)}
                ${brow("Time", timePreference)}
                ${brow("Address", fullAddress)}
                ${brow("How they found us", info.referral)}
                ${brow("Payment", info.payment)}
                ${brow("DB error", safe(dbErrMsg))}
              </table>
              <h4 style="margin:24px 0 8px;color:#444;font-size:14px;">Raw payload</h4>
              <pre style="background:#f6f6f6;padding:14px;border-radius:8px;font-size:11px;white-space:pre-wrap;word-break:break-word;">${safe(JSON.stringify(body, null, 2))}</pre>
            </div>
          `,
      })
    }

    // The booking is safely stored but the customer never heard back, so the
    // office has to know to reach out by phone.
    if (dbSaved && !clientEmailSent) {
      await trySend("client-email-failure alert", {
        from: `"PrimeTvNashville Bookings" <${user}>`,
        to: "tvprimenashville@gmail.com",
        subject: `⚠️ CUSTOMER DID NOT GET THEIR CONFIRMATION — ${fullName} | ${date}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;border:2px solid #f59e0b;border-radius:12px;">
            <h2 style="color:#b45309;margin:0 0 8px;">⚠️ Confirmation email did not reach the customer</h2>
            <p style="color:#444;font-size:14px;margin:0 0 16px;">
              The booking <strong>is saved</strong> and appears in the admin panel, but the
              confirmation to the customer could not be delivered. The address below is most
              likely mistyped. <strong>Call them to confirm the appointment.</strong>
            </p>
            <table style="width:100%;border-collapse:collapse;">
              ${brow("Customer", fullName)}
              ${brow("Email given", info.email)}
              ${brow("Phone", info.phone)}
              ${brow("Date", date)}
              ${brow("Time", timePreference)}
              ${brow("Address", fullAddress)}
            </table>
          </div>
        `,
      })
    }

    return new Response(JSON.stringify({
      ok: true,
      saved: dbSaved,
      businessNotified: businessEmailSent,
      clientNotified: clientEmailSent,
    }), { status: 200 })
  } catch (err) {
    console.error("booking error", err)
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500 })
  }
}

function brow(label, value) {
  return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;width:180px;font-weight:600;color:#555;font-size:13px;">${label}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:13px;">${value}</td>
    </tr>
  `
}
