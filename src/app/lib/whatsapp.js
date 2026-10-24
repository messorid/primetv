// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP — a heads-up on the owner's phone for every booking, quote and crew
// assignment, sent through the WhatsApp Cloud API (Meta).
//
// A message the business starts has to use a template Meta has approved; free
// text is only allowed within 24 hours of the recipient writing to us first.
// So every alert goes through one Utility template with three body variables,
// created in WhatsApp Manager exactly like this:
//
//   name:     primetv_alerta        language: Spanish (es)
//   body:     Nuevo aviso de PrimeTV Nashville.
//
//             Tipo: {{1}}
//             Cliente: {{2}}
//             Detalles: {{3}}
//
//             Revísalo en el panel de administración.
//
// Configuration, all in Vercel:
//   WHATSAPP_TOKEN            a permanent System User access token
//   WHATSAPP_PHONE_NUMBER_ID  the sending number's id (WhatsApp > API Setup)
//   WHATSAPP_NOTIFY_TO        who gets the alerts: country code and number,
//                             no "+" and no trunk 0 (Venezuela: 58412…, not
//                             580412…). Several can be separated by commas.
//   WHATSAPP_TEMPLATE         template name, default primetv_alerta
//   WHATSAPP_TEMPLATE_LANG    template language code, default es
//   WHATSAPP_API_VERSION      Graph API version, default v23.0
//
// Nothing is sent until the first three are set, and a failure is logged and
// swallowed: a WhatsApp problem must never cost us a booking or a quote.
// ─────────────────────────────────────────────────────────────────────────────

const token         = () => (process.env.WHATSAPP_TOKEN || "").trim()
const phoneNumberId = () => (process.env.WHATSAPP_PHONE_NUMBER_ID || "").trim()
const templateName  = () => (process.env.WHATSAPP_TEMPLATE || "").trim() || "primetv_alerta"
const templateLang  = () => (process.env.WHATSAPP_TEMPLATE_LANG || "").trim() || "es"
const apiVersion    = () => (process.env.WHATSAPP_API_VERSION || "").trim() || "v23.0"

// Digits only: the API wants "584122061611", and people paste "+58 412-206…".
export const recipients = () =>
  (process.env.WHATSAPP_NOTIFY_TO || "")
    .split(",")
    .map(n => n.replace(/\D/g, ""))
    .filter(Boolean)

export const canSendWhatsApp = () => Boolean(token() && phoneNumberId() && recipients().length)

// Meta rejects a template variable that is empty, or that holds a newline, a
// tab or more than four spaces in a row (error 132018). The whole body is
// capped at 1024 characters, so each variable is kept well short of that.
export function templateParam(value, max = 300) {
  const s = String(value ?? "")
    .trim()
    .replace(/\s*[\r\n\t]+\s*/g, " · ")
    .replace(/ {2,}/g, " ")
  if (!s) return "—"
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s
}

// `alert` is { kind, customer, details } — see whatsappAlerts.js. Resolves to
// true only when every recipient got it; never throws.
export async function notifyWhatsApp(alert) {
  if (!canSendWhatsApp()) return false

  const url = `https://graph.facebook.com/${apiVersion()}/${phoneNumberId()}/messages`
  const parameters = [alert?.kind, alert?.customer, alert?.details]
    .map(v => ({ type: "text", text: templateParam(v) }))

  const results = await Promise.all(recipients().map(async to => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName(),
            language: { code: templateLang() },
            components: [{ type: "body", parameters }],
          },
        }),
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) {
        const detail = await res.text().catch(() => "")
        console.error(`WhatsApp alert to ${to} failed: ${res.status} ${detail}`)
        return false
      }
      return true
    } catch (err) {
      console.error(`WhatsApp alert to ${to} failed`, err)
      return false
    }
  }))

  return results.every(Boolean)
}
