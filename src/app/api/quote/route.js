export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import nodemailer from "nodemailer"
import { captureQuoteLead } from "../../lib/quoteLeads.js"

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Bad request" }), { status: 400 })
  }

  // Detecta forma del payload: Wizard viejo o Quick Quote nuevo
  const isWizard = Array.isArray(body.tvDetails)

  // El lead se guarda ANTES del correo. Si el SMTP falla, el lead sigue
  // apareciendo en el panel; antes se perdia por completo.
  const saved = await captureQuoteLead(
    isWizard ? wizardLead(body) : quickLead(body)
  )

  let notified = false
  try {
    // Lee primero EMAIL_* como en tu version anterior, y si no existen usa SMTP_*
    const user = process.env.EMAIL_USER || process.env.SMTP_USER
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS
    const to   = process.env.QUOTE_TO || user
    const from = process.env.MAIL_FROM || user
    const replyTo = process.env.REPLY_TO || body.email || undefined

    if (!user || !pass) throw new Error("SMTP credentials missing")

    // Igual que tu codigo que funcionaba: usa el servicio gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    })

    await transporter.verify()

    const subject = isWizard
      ? `PrimeTv Nashville - New Quote from ${safe(body.fullName)}`
      : `PrimeTv Quote - ${safe(body.name || body.fullName || "Unknown")}`

    await transporter.sendMail({
      from,
      to,
      replyTo,
      subject,
      html: isWizard ? renderWizardEmail(body) : renderQuickEmail(body),
    })
    notified = true
  } catch (err) {
    console.error("quote email failed", err)
  }

  // Solo es un error para el cliente si no quedo registrado en ningun lado.
  if (!saved && !notified) {
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true, saved, notified }), { status: 200 })
}

/* Leads */

const KNOWN_SOURCES = ["quick_quote", "installation_quote", "contact_form"]

function quickLead(body) {
  return {
    source:        KNOWN_SOURCES.includes(body.leadSource) ? body.leadSource : "quick_quote",
    service:       body.service,
    name:          body.name || body.fullName,
    phone:         body.phone,
    email:         body.email,
    zip:           body.zip,
    address:       body.address,
    tvSize:        body.tvSize,
    mountType:     body.mountType,
    preferredDate: body.preferredDate,
    preferredTime: body.preferredTime,
    notes:         body.notes,
  }
}

function wizardLead(body) {
  const tvs = Array.isArray(body.tvDetails) ? body.tvDetails : []
  const notes = tvs
    .map((tv, i) => `TV ${i + 1}: ${[tv.tvType, tv.tvSize, tv.wallType, tv.hideCables ? `cables: ${tv.hideCables}` : "", tv.comments].filter(Boolean).join(" · ")}`)
    .join("\n")

  return {
    source:        "quick_quote",
    service:       tvs.length ? `${tvs.length} TV${tvs.length > 1 ? "s" : ""}` : "TV Mounting",
    name:          body.fullName,
    phone:         body.phone,
    email:         body.email,
    tvSize:        tvs.map(t => t.tvSize).filter(Boolean).join(", "),
    preferredDate: body.preferredDate,
    notes,
    details:       { tvDetails: tvs, totalCost: body.totalCost ?? null },
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
