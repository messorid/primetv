export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import nodemailer from "nodemailer"

export async function POST(request) {
  try {
    const body = await request.json()

    // Lee primero EMAIL_* como en tu versión anterior, y si no existen usa SMTP_*
    const user = process.env.EMAIL_USER || process.env.SMTP_USER
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS
    const to   = process.env.QUOTE_TO || user
    const from = process.env.MAIL_FROM || user
    const replyTo = process.env.REPLY_TO || body.email || undefined

    if (!user || !pass) {
      console.error("quote error: missing SMTP credentials")
      return new Response(JSON.stringify({ ok: false, error: "SMTP credentials missing" }), { status: 500 })
    }

    // Igual que tu código que funcionaba: usa el servicio gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    })

    // Verifica conexión
    await transporter.verify()

    // Detecta forma del payload: Wizard viejo o Quick Quote nuevo
    const isWizard = Array.isArray(body.tvDetails)

    const subject = isWizard
      ? `PrimeTv Nashville - New Quote from ${safe(body.fullName)}`
      : `PrimeTv Quote - ${safe(body.name || body.fullName || "Unknown")}`

    const html = isWizard ? renderWizardEmail(body) : renderQuickEmail(body)

    await transporter.sendMail({
      from,
      to,
      replyTo,
      subject,
      html,
    })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error("quote error", err)
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500 })
  }
}

/* Helpers */

function renderWizardEmail(body) {
  const tvRows = (body.tvDetails || []).map((tv, idx) => `
    <tr style="background:${idx % 2 ? "#fafafa" : "#fff"};">
      <td style="padding:8px;">${idx + 1}</td>
      <td style="padding:8px;">${safe(tv.tvType)}</td>
      <td style="padding:8px;">${safe(tv.tvSize)}</td>
      <td style="padding:8px;">${safe(tv.wallType)}</td>
      <td style="padding:8px;">${safe(tv.hideCables)}</td>
      <td style="padding:8px;">${safe(tv.comments)}</td>
    </tr>
  `).join("")

  const total = typeof body.totalCost === "number" ? body.totalCost.toFixed(2) : safe(body.totalCost)

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;">
      <h2 style="color:#222;border-bottom:2px solid #e50914;padding-bottom:10px;">New TV Installation Request</h2>
      <table style="width:100%;margin-top:16px;">
        ${row("Full Name", body.fullName)}
        ${row("Email", body.email)}
        ${row("Phone", body.phone)}
        ${row("Preferred Date", body.preferredDate)}
      </table>

      <h4 style="margin-top:24px;color:#444;">TV Details</h4>
      <table style="width:100%;margin-top:8px;border-collapse:collapse;">
        <thead>
          <tr style="background:#f0f0f0;">
            <th style="padding:8px;">#</th>
            <th style="padding:8px;">Brand / Type</th>
            <th style="padding:8px;">Size</th>
            <th style="padding:8px;">Wall</th>
            <th style="padding:8px;">Hide Cables</th>
            <th style="padding:8px;">Comments</th>
          </tr>
        </thead>
        <tbody>${tvRows}</tbody>
      </table>

      <div style="margin-top:16px;background:#f9f9f9;padding:12px;border-radius:6px;">
        <strong>Total Estimated Cost:</strong> $${total || "-"}
      </div>

      <p style="margin-top:16px;font-size:12px;color:#888;">Email generated from PrimeTvNashville.com</p>
    </div>
  `
}

function renderQuickEmail(body) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;">
      <h2 style="color:#222;border-bottom:2px solid #e50914;padding-bottom:10px;">Quick Quote</h2>
      <table style="width:100%;margin-top:12px;border-collapse:collapse;">
        ${row("Service", body.service)}
        ${row("TV size", body.tvSize)}
        ${row("Mount type", body.mountType)}
        ${row("ZIP", body.zip)}
        ${row("Address", body.address)}
        ${row("Preferred date", body.preferredDate)}
        ${row("Preferred time", body.preferredTime)}
        ${row("Name", body.name)}
        ${row("Phone", body.phone)}
        ${row("Email", body.email)}
      </table>
      ${body.notes ? `<p style="margin-top:12px;"><b>Notes</b><br/>${safe(body.notes)}</p>` : ""}
    </div>
  `
}

function row(label, value) {
  return `
    <tr>
      <td style="padding:6px;border-bottom:1px solid #eee;width:160px;"><b>${safe(label)}</b></td>
      <td style="padding:6px;border-bottom:1px solid #eee;">${safe(value)}</td>
    </tr>
  `
}

function safe(v) {
  return String(v ?? "-")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
}
