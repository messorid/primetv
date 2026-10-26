// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP — a heads-up on the owner's phone for every booking and quote, and
// on an installer's phone when a job is assigned to them, sent through the
// WhatsApp Cloud API (Meta).
//
// A message the business starts has to use a template Meta has approved; free
// text is only allowed within 24 hours of the recipient writing to us first.
// So each kind of message goes through one Utility template, created in
// WhatsApp Manager exactly like this:
//
//   name:     primetv_solicitud_cliente     language: English (en)
//   body:     PrimeTV Nashville: se registró una nueva solicitud de un cliente
//             en tu sistema de reservas.
//
//             Tipo de solicitud: {{1}}
//             Cliente: {{2}}
//             Detalles del servicio: {{3}}
//
//             Entra al panel de administración para confirmarla o asignarla.
//
//   name:     primetv_job_assigned          language: English (en)
//   body:     PrimeTV Nashville: a new installation job has been assigned to you.
//
//             Date: {{1}}
//             Customer: {{2}}
//             Address: {{3}}
//             Job: {{4}}
//
//             Your full work order, with directions and photos, was sent to
//             your email.
//
// The owner's text is Spanish but that template was filed under English, so
// "en" is what Meta matches on. The first template, primetv_alerta ("Nuevo
// aviso…"), was moved to Marketing by Meta for being too generic, and marketing
// messages can be accepted and then never delivered; to US numbers they are not
// sent at all, which would silence every installer. Keep the wording
// transactional.
//
// Configuration, all in Vercel:
//   WHATSAPP_TOKEN            a permanent System User access token
//   WHATSAPP_PHONE_NUMBER_ID  the sending number's id (WhatsApp > API Setup)
//   WHATSAPP_NOTIFY_TO        who gets the owner alerts: country code and
//                             number, no "+" and no trunk 0 (Venezuela: 58412…,
//                             not 580412…). Several can be separated by commas.
//   WHATSAPP_TEMPLATE         owner template name, default primetv_solicitud_cliente
//   WHATSAPP_TEMPLATE_LANG    owner template language code, default en
//   WHATSAPP_INSTALLER_TEMPLATE       installer template, default primetv_job_assigned
//   WHATSAPP_INSTALLER_TEMPLATE_LANG  its language code, default en
//   WHATSAPP_API_VERSION      Graph API version, default v23.0
//
// Installers are reached at the phone saved on their profile. Nothing is sent
// without the token and the number id, and a failure is logged and swallowed:
// a WhatsApp problem must never cost us a booking, a quote or an assignment.
// ─────────────────────────────────────────────────────────────────────────────

const setting = (name, fallback = "") => (process.env[name] || "").trim() || fallback

const token         = () => setting("WHATSAPP_TOKEN")
const phoneNumberId = () => setting("WHATSAPP_PHONE_NUMBER_ID")
const apiVersion    = () => setting("WHATSAPP_API_VERSION", "v23.0")

// Digits only: the API wants "584122061611", and people paste "+58 412-206…".
export const recipients = () =>
  (process.env.WHATSAPP_NOTIFY_TO || "")
    .split(",")
    .map(n => n.replace(/\D/g, ""))
    .filter(Boolean)

// The names of the settings a send still needs, never their values.
function missingSettings({ owner = true } = {}) {
  return [
    ["WHATSAPP_TOKEN", token()],
    ["WHATSAPP_PHONE_NUMBER_ID", phoneNumberId()],
    ...(owner ? [["WHATSAPP_NOTIFY_TO", recipients().length]] : []),
  ].filter(([, v]) => !v).map(([name]) => name)
}

export const canSendWhatsApp = () => missingSettings().length === 0

// Installer phones are saved as typed in the admin panel, e.g. "(615) 555-0100".
// Ten digits are taken as a US number, since the crew works in Nashville; any
// other number has to carry its country code ("+58 412…"). Null when there is
// no number WhatsApp could route.
export function installerNumber(raw) {
  const typed = String(raw ?? "").trim()
  const digits = typed.replace(/\D/g, "")
  const international =
    typed.startsWith("+")    ? digits
    : digits.startsWith("00") ? digits.slice(2)
    : null
  if (international !== null) return international.length >= 8 ? international : null
  if (digits.length === 10) return `1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return digits
  return null
}

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

// One template message to one number. Every outcome is logged, success
// included: a skipped send used to leave no trace at all, so a missing alert
// could not be told apart from a lost one. Never throws.
async function sendTemplate(to, { name, lang, params, label }) {
  try {
    const res = await fetch(`https://graph.facebook.com/${apiVersion()}/${phoneNumberId()}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name,
          language: { code: lang },
          components: [{
            type: "body",
            parameters: params.map(v => ({ type: "text", text: templateParam(v) })),
          }],
        },
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error(`WhatsApp ${label} to ${to} failed: ${res.status} ${detail}`)
      return false
    }
    // Accepted is not delivered: Meta can still drop it later, and only
    // WhatsApp Manager > Insights shows that. The id ties the two together.
    const sent = await res.json().catch(() => ({}))
    console.log(`WhatsApp ${label} accepted for ${to}: ${sent?.messages?.[0]?.id || "no message id"}`)
    return true
  } catch (err) {
    console.error(`WhatsApp ${label} to ${to} failed`, err)
    return false
  }
}

// `alert` is { kind, customer, details } — see whatsappAlerts.js. Resolves to
// true only when every owner number got it; never throws.
export async function notifyWhatsApp(alert) {
  const label = `alert "${alert?.kind}"`
  const missing = missingSettings()
  if (missing.length) {
    console.warn(`WhatsApp ${label} not sent: ${missing.join(", ")} not set`)
    return false
  }

  const template = {
    name: setting("WHATSAPP_TEMPLATE", "primetv_solicitud_cliente"),
    lang: setting("WHATSAPP_TEMPLATE_LANG", "en"),
    params: [alert?.kind, alert?.customer, alert?.details],
    label,
  }
  const results = await Promise.all(recipients().map(to => sendTemplate(to, template)))
  return results.every(Boolean)
}

// A job assigned to one installer. `params` are the template's four variables
// — see installerJobAlert in whatsappAlerts.js. Never throws.
export async function notifyInstaller({ installerName, phone, params }) {
  const label = `job alert for ${installerName || "installer"}`
  const missing = missingSettings({ owner: false })
  if (missing.length) {
    console.warn(`WhatsApp ${label} not sent: ${missing.join(", ")} not set`)
    return false
  }

  const to = installerNumber(phone)
  if (!to) {
    console.warn(`WhatsApp ${label} not sent: ${phone
      ? `"${phone}" is not a number WhatsApp can reach; save it with its country code`
      : "no phone on file"}`)
    return false
  }

  return sendTemplate(to, {
    name: setting("WHATSAPP_INSTALLER_TEMPLATE", "primetv_job_assigned"),
    lang: setting("WHATSAPP_INSTALLER_TEMPLATE_LANG", "en"),
    params,
    label,
  })
}
