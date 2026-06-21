export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import nodemailer from "nodemailer"

export async function POST(request) {
  try {
    const body = await request.json()
    const { date, timePreference, tvs, address, info, selectedPromo, promoCode } = body

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

    const tvRows = (tvs || []).map((tv, idx) => `
      <tr style="background:${idx % 2 ? "#fafafa" : "#fff"};">
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${idx + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safe(tv.size)}${tv.exactSize ? ` (${safe(tv.exactSize)}")` : ""}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safe(tv.wallType)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${safe(tv.comments) || "-"}</td>
      </tr>
    `).join("")

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
            ${selectedPromo ? brow("Promo Selected", selectedPromo) : ""}
          ${promoCode ? brow("Promo Code", promoCode) : ""}
          ${brow("How they found us", info.referral)}
            ${brow("Payment Method", info.payment)}
          </table>

          <h4 style="margin:28px 0 8px;color:#444;font-size:15px;">TV Details (${tvs.length} TV${tvs.length > 1 ? "s" : ""})</h4>
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
              ${crow("TVs", `${tvs.length} TV${tvs.length > 1 ? "s" : ""}`)}
            </table>
          </div>

          <p style="margin-top:24px;color:#444;font-size:14px;">
            Questions? Call us at <strong>(615) 669-0251</strong> or reply to this email.
          </p>

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
            PrimeTvNashville — Expert TV Mounting in Nashville, TN
          </div>
        </div>
      `,
    })

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
