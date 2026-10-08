export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { randomUUID } from "node:crypto"
import { captureQuoteLead } from "../../lib/quoteLeads.js"
import { getTransport, mailFrom, notifyTo, canSendMail } from "../../lib/mailer.js"
import { quickQuoteEmail, wizardQuoteEmail } from "../../lib/leadEmails.js"
import { forwardLeadToCrm } from "../../lib/crmForward.js"
import { runAfterResponse } from "../../lib/afterResponse.js"

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Bad request" }), { status: 400 })
  }

  // Detecta forma del payload: Wizard viejo o Quick Quote nuevo
  const isWizard = Array.isArray(body.tvDetails)
  const lead = isWizard ? wizardLead(body) : quickLead(body)

  // El lead se guarda ANTES del correo. Si el SMTP falla, el lead sigue
  // apareciendo en el panel; antes se perdia por completo.
  const saved = await captureQuoteLead(lead)

  // Los Quick Quote tambien van al CRM (Sistema de Leads), pero despues de
  // responder: un CRM lento o caido nunca hace esperar al cliente ni le
  // devuelve un error. El id permite al CRM reconocer un reintento.
  if (lead.source === "quick_quote") {
    const externalId = randomUUID()
    runAfterResponse(() => forwardLeadToCrm(lead, externalId))
  }

  let notified = false
  try {
    // Lee primero EMAIL_* como en tu version anterior, y si no existen usa SMTP_*
    const user = process.env.EMAIL_USER || process.env.SMTP_USER
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS
    const to   = notifyTo()
    const from = mailFrom("PrimeTvNashville")
    // Reply goes to the customer who asked for the quote. This used to prefer a
    // REPLY_TO variable pointing at a Gmail inbox, so hitting Reply on a lead
    // wrote back to ourselves instead of to the person waiting for a price.
    const replyTo = body.email || undefined

    if (!user || !pass) throw new Error("SMTP credentials missing")

    // Igual que tu codigo que funcionaba: usa el servicio gmail
    const transporter = getTransport()

    await transporter.verify()

    // Subjects are plain text, so no HTML escaping (which turned "&" into
    // "&amp;"); line breaks are removed so a name cannot add mail headers.
    const who = plainLine(isWizard ? body.fullName : (body.name || body.fullName || "Unknown"))
    const subject = isWizard
      ? `PrimeTv Nashville - New Quote from ${who}`
      : `PrimeTv Quote - ${who}`

    await transporter.sendMail({
      from,
      to,
      replyTo,
      subject,
      html: isWizard ? wizardQuoteEmail(body) : quickQuoteEmail(body),
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

const plainLine = v => String(v ?? "").replace(/[\r\n]+/g, " ").trim()
