export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import nodemailer from "nodemailer"
import { neon } from "@neondatabase/serverless"

export async function POST(request) {
  try {
    const body = await request.json()
    const { date, timePreference, tvs, address, info, selectedPromo, couponCode, appliedCouponLabel, couponComment, couponHidden, moreTvs, moreTvsComment } = body

    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASS

    if (!user || !pass) {
      return new Response(JSON.stringify({ ok: false, error: "SMTP credentials missing" }), { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    })

    await transporter.verify()

    const fullName = `${safe(info.firstName)} ${safe(info.lastName)}`
    const fullAddress = [
      safe(address.street),
      address.apt ? safe(address.apt) : null,
      `${safe(address.city)}, ${safe(address.state)} ${safe(address.zip)}`,
    ].filter(Boolean).join(", ")

    const tvList = (tvs || [])
    const hasPromo = !!selectedPromo
    const promoPrice = hasPromo
      ? (selectedPromo.includes("55") ? "$199" : "$260")
      : ""

    const tvRows = tvList.map((tv, idx) => `
      <tr style="background:${idx % 2 ? "#fafafa" : "#fff"};">
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${idx + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safe(tv.size)}${tv.exactSize ? ` (${safe(tv.exactSize)}")` : ""}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safe(tv.wallType)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safe(tv.comments) || "-"}</td>
      </tr>
    `).join("")

    // ── Price / promo block for client email ──────────────────────────────────
    const promoPriceBlock = hasPromo ? `
      <div style="background:#fff5f5;border:2px solid #e50914;border-radius:10px;padding:16px 20px;margin-top:20px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="margin:0;font-size:12px;font-weight:700;color:#e50914;text-transform:uppercase;letter-spacing:.05em;">Package Price</p>
          <p style="margin:4px 0 0;font-size:13px;color:#555;">${safe(selectedPromo)}</p>
        </div>
        <span style="font-size:28px;font-weight:900;color:#e50914;">${promoPrice}</span>
      </div>
    ` : ""

    // Client sees offer text only; code name hidden if couponHidden
    const couponBlock = (couponCode && appliedCouponLabel) ? `
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px 18px;margin-top:12px;">
        ${!couponHidden ? `<p style="margin:0;font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:.05em;">Coupon Applied — ${safe(couponCode)}</p>` : ""}
        <p style="margin:${couponHidden ? "0" : "6px"} 0 0;font-size:14px;color:#166534;font-weight:600;">${safe(appliedCouponLabel)}</p>
        ${couponComment ? `<p style="margin:8px 0 0;font-size:13px;color:#166534;font-style:italic;">"${safe(couponComment)}"</p>` : ""}
      </div>
    ` : ""

    const moreTvsBlock = moreTvs ? `
      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:14px 18px;margin-top:12px;">
        <p style="margin:0;font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.05em;">3+ TVs — Custom Quote</p>
        <p style="margin:6px 0 0;font-size:13px;color:#78350f;">Pricing varies for 3 or more TVs. We will contact you to confirm the total before the appointment.</p>
        ${moreTvsComment ? `<p style="margin:8px 0 0;font-size:13px;color:#78350f;font-style:italic;">"${safe(moreTvsComment)}"</p>` : ""}
      </div>
    ` : ""

    // ── Email to business ──────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"PrimeTvNashville Bookings" <${user}>`,
      to: "tvprimenashville@gmail.com",
      replyTo: info.email,
      subject: `New Booking — ${fullName} | ${date}`,
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
            ${hasPromo ? brow("Promo Selected", `${selectedPromo} — <strong>${promoPrice}</strong>`) : ""}
            ${couponCode ? brow("Coupon Code", `${safe(couponCode)} — ${safe(appliedCouponLabel)}`) : ""}
            ${couponComment ? brow("Coupon Comment", safe(couponComment)) : ""}
            ${moreTvs ? brow("3+ TVs", "Yes — custom quote needed") : ""}
            ${moreTvsComment ? brow("TV Details", safe(moreTvsComment)) : ""}
            ${brow("How they found us", info.referral)}
            ${brow("Payment Method", info.payment)}
          </table>

          ${hasPromo ? `
            <p style="margin:20px 0 8px;font-size:13px;color:#888;font-style:italic;">
              Package promo — TV details not required.
            </p>
          ` : `
            <h4 style="margin:28px 0 8px;color:#444;font-size:15px;">TV Details (${tvList.length} TV${tvList.length !== 1 ? "s" : ""})</h4>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <thead>
                <tr style="background:#f0f0f0;">
                  <th style="padding:8px 12px;text-align:left;">#</th>
                  <th style="padding:8px 12px;text-align:left;">Size</th>
                  <th style="padding:8px 12px;text-align:left;">Wall Type</th>
                  <th style="padding:8px 12px;text-align:left;">Comments</th>
                </tr>
              </thead>
              <tbody>${tvRows}</tbody>
            </table>
          `}

          <p style="margin-top:28px;font-size:12px;color:#aaa;">
            Submitted from PrimeTvNashville.com
          </p>
        </div>
      `,
    })

    // ── Confirmation email to client ───────────────────────────────────────────
    await transporter.sendMail({
      from: `"PrimeTvNashville" <${user}>`,
      to: info.email,
      bcc: "messoweb@gmail.com",
      subject: "Booking Confirmed — PrimeTvNashville",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <h2 style="color:#e50914;border-bottom:3px solid #e50914;padding-bottom:12px;">
            📺 Your Booking is Confirmed!
          </h2>

          <p style="color:#444;margin-top:16px;font-size:15px;">
            Hi ${safe(info.firstName)},
          </p>
          <p style="color:#444;font-size:15px;">
            Thank you for choosing <strong>PrimeTvNashville</strong>! We've received your booking request and will contact you shortly to confirm your appointment.
          </p>

          <div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:20px;margin-top:24px;">
            <h4 style="margin:0 0 14px;color:#222;font-size:15px;">Booking Summary</h4>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              ${crow("Date", date)}
              ${crow("Time Window", timePreference)}
              ${crow("Address", fullAddress)}
              ${hasPromo
                ? crow("Package", selectedPromo)
                : crow("TVs", `${tvList.length} TV${tvList.length !== 1 ? "s" : ""}`)
              }
            </table>
          </div>

          ${promoPriceBlock}
          ${couponBlock}
          ${moreTvsBlock}

          <p style="margin-top:24px;color:#444;font-size:14px;">
            Questions? Call us at <strong>(615) 669-0251</strong> or reply to this email.
          </p>

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
            PrimeTvNashville — Expert TV Mounting in Nashville, TN
          </div>
        </div>
      `,
    })

    // ── Save to Neon Postgres ──────────────────────────────────────────────────
    try {
      const sql = neon(process.env.DATABASE_URL)
      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          first_name     TEXT, last_name TEXT, email TEXT, phone TEXT,
          referral       TEXT, payment TEXT, date TEXT, time_pref TEXT,
          address        JSONB, promo TEXT, coupon_code TEXT,
          coupon_label   TEXT, coupon_comment TEXT, tvs JSONB,
          more_tvs       BOOLEAN DEFAULT FALSE, more_tvs_comment TEXT,
          status         TEXT DEFAULT 'pending', notes TEXT,
          created_at     TIMESTAMPTZ DEFAULT NOW()
        )
      `
      await sql`
        INSERT INTO bookings
          (first_name, last_name, email, phone, referral, payment, date, time_pref,
           address, promo, coupon_code, coupon_label, coupon_comment, tvs,
           more_tvs, more_tvs_comment)
        VALUES
          (${info.firstName}, ${info.lastName}, ${info.email}, ${info.phone},
           ${info.referral}, ${info.payment}, ${date}, ${timePreference},
           ${JSON.stringify(address)}, ${selectedPromo || ""},
           ${couponCode || ""}, ${appliedCouponLabel || ""},
           ${couponComment || ""}, ${JSON.stringify(tvList)},
           ${!!moreTvs}, ${moreTvsComment || ""})
      `
    } catch (dbErr) {
      console.error("DB save error", dbErr)
      // Don't fail — emails already sent
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
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

function crow(label, value) {
  return `
    <tr>
      <td style="padding:6px 0;width:140px;font-weight:600;color:#666;font-size:13px;">${label}</td>
      <td style="padding:6px 0;font-size:13px;">${value}</td>
    </tr>
  `
}

function safe(v) {
  return String(v ?? "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}
