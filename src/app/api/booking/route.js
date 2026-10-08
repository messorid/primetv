export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { applySchemaFixes } from "../../lib/schemaFixes.js"
import { getTransport, canSendMail, mailFrom, notifyTo } from "../../lib/mailer.js"
import { buildClientEmail, buildICS, safe, formatAddress } from "../../lib/clientEmail.js"
import {
  buildBusinessBookingEmail, buildDbFailureAlert, buildClientEmailFailureAlert,
} from "../../lib/bookingEmails.js"

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

    const canEmail = canSendMail()
    if (!canEmail) console.error("SMTP credentials missing — booking will be saved but no email sent")

    const transporter = getTransport()

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

    // Still needed for the database row and the customer confirmation.
    const tvList     = (tvs || [])
    const isHomeInst = bookingMode === "homeinstall"
    const cableQty   = parseInt(cableConcealment) || 0
    const customPriceNum = customQuote && customPrice != null && customPrice !== "" ? parseFloat(customPrice) : null

    // ── Calendar invites ──────────────────────────────────────────────────────
    const icsUID = `${date || "nodate"}-${(info.email || "").replace(/[^a-z0-9]/gi, "")}@primetv`
    const icsBase = { uid: icsUID, date, timePref: timePreference, location: fullAddress,
      organizer: user, description: `Customer: ${fullName}\nPhone: ${info.phone}\nAddress: ${fullAddress}` }

    const icsForBusiness = date ? buildICS({
      ...icsBase,
      summary: `TV Installation — ${fullName}`,
      attendees: [{ name: "PrimeTvNashville", email: notifyTo() }],
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
    const businessMail = buildBusinessBookingEmail(body)
    const businessEmailSent = await trySend("business", {
      from: mailFrom("PrimeTvNashville Bookings"),
      to: notifyTo(),
      replyTo: info.email,
      subject: businessMail.subject,
      attachments: icsForBusiness ? [{ filename: "appointment.ics", content: icsForBusiness, contentType: "text/calendar; method=REQUEST; charset=utf-8" }] : [],
      html: businessMail.html,
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
      from: mailFrom("PrimeTvNashville"),
      to: info.email,
      bcc: notifyTo(),
      subject: clientEmail.subject,
      attachments: clientEmail.attachments,
      html: clientEmail.html,
    })

    // A booking that never reached the database used to disappear silently while
    // the customer still got a confirmation. Now it always alerts the business.
    if (!dbSaved) {
      const alert = buildDbFailureAlert(body, dbErrMsg)
      await trySend("db-failure alert", {
        from: mailFrom("PrimeTvNashville Bookings"),
        to: notifyTo(),
        subject: alert.subject,
        html: alert.html,
      })
    }

    // The booking is safely stored but the customer never heard back, so the
    // office has to know to reach out by phone.
    if (dbSaved && !clientEmailSent) {
      const alert = buildClientEmailFailureAlert(body)
      await trySend("client-email-failure alert", {
        from: mailFrom("PrimeTvNashville Bookings"),
        to: notifyTo(),
        subject: alert.subject,
        html: alert.html,
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

