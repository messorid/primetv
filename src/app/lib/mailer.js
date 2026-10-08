// ─────────────────────────────────────────────────────────────────────────────
// MAILER — one place that decides which SMTP server sends our email.
//
// This used to be `service: "gmail"` written out by hand in seven route files.
// Moving providers meant editing all seven, and missing one meant half the mail
// leaving from one server and half from another — which is both confusing to
// debug and bad for deliverability, because the two halves authenticate
// differently.
//
// Now the provider is chosen by environment variable:
//
//   SMTP_HOST set   → that host is used (Hostinger, or any other SMTP server)
//   SMTP_HOST unset → falls back to Gmail, exactly as before
//
// Nothing changes until the host variable is set, so the switch is a Vercel
// settings change and a redeploy rather than a code deploy.
//
// For Hostinger:
//   SMTP_HOST=smtp.hostinger.com
//   SMTP_PORT=465
//   SMTP_SECURE=true
//   EMAIL_USER=info@primetvnashville.com    (the full address, not a username)
//   EMAIL_PASS=<the mailbox password>
//
// Port 587 also works there; set SMTP_PORT=587 and SMTP_SECURE=false, which
// starts plaintext and upgrades with STARTTLS. 465 is the simpler of the two.
// ─────────────────────────────────────────────────────────────────────────────

import nodemailer from "nodemailer"

// SMTP_* is preferred and EMAIL_* is the long-standing name in this project.
// Both are read so the existing Vercel configuration keeps working untouched.
export const mailUser = () => process.env.EMAIL_USER || process.env.SMTP_USER || ""
export const mailPass = () => process.env.EMAIL_PASS || process.env.SMTP_PASS || ""

// True when there is enough configuration to send anything at all. Callers use
// this instead of trying to send and catching the failure.
export const canSendMail = () => Boolean(mailUser() && mailPass())

// Accepts either a bare address or the "Display Name <address>" form — the
// MAIL_FROM in production uses the second — and returns just the address.
const bareAddress = value => {
  const s = String(value || "").trim()
  const angled = s.match(/<([^>]+)>/)
  return (angled ? angled[1] : s).trim()
}
const domainOf = address => bareAddress(address).split("@")[1]?.trim().toLowerCase() || ""

// An override is only trusted when it lives on the same domain as the mailbox
// we actually log in as. This is not tidiness. MAIL_FROM and QUOTE_TO were set
// a year ago, when everything ran through Gmail, and still pointed at Gmail
// addresses when the site moved to the Hostinger mailbox. Hostinger refuses to
// send as an address it does not own —
//   553 5.7.1 <messoweb@gmail.com>: Sender address rejected:
//   not owned by user info@primetvnashville.com
// — so one stale variable silently stopped every form notification on the
// site. A foreign-domain override is now ignored, with a warning in the logs,
// instead of being obeyed into an outage.
function sameDomainOverride(name) {
  const value = (process.env[name] || "").trim()
  if (!value) return ""
  const own = domainOf(mailUser())
  if (own && domainOf(value) !== own) {
    console.warn(`${name}=${value} ignored: not on ${own}, the domain we send from`)
    return ""
  }
  // The bare address: mailFrom adds its own display name, and a recipient
  // field wants an address, not a formatted header.
  return bareAddress(value)
}

// The address mail is sent as. With a custom domain this must be the mailbox
// that SMTP authenticated as — a foreign From is either refused outright, as
// above, or delivered and then filed as spoofing by the receiving server.
export function mailFrom(displayName = "PrimeTvNashville") {
  const address = sameDomainOverride("MAIL_FROM") || mailUser()
  return displayName ? `"${displayName}" <${address}>` : address
}

export function smtpConfig() {
  const auth = { user: mailUser(), pass: mailPass() }
  const host = process.env.SMTP_HOST

  if (!host) {
    // Unchanged default. `service: "gmail"` expands to smtp.gmail.com:465 and
    // requires an App Password rather than the account password.
    return { service: "gmail", auth }
  }

  // A custom server. secure=true means TLS from the first byte (465);
  // secure=false means plaintext upgraded via STARTTLS (587).
  const port = Number(process.env.SMTP_PORT) || 465
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE !== "false"
    : port === 465

  return { host, port, secure, auth }
}

// Returns null rather than a broken transport when nothing is configured, so a
// caller cannot accidentally attempt a send that was never going to work.
export function getTransport() {
  if (!canSendMail()) return null
  return nodemailer.createTransport(smtpConfig())
}

// Where every internal notification goes: new bookings, quick quotes,
// installation quotes, the copy of each customer confirmation, and the alerts
// when something fails. That is the business inbox, info@primetvnashville.com,
// which is the mailbox we send from.
//
// QUOTE_TO can still redirect them, but only to another address on the same
// domain — the old value pointed at a personal Gmail and would otherwise keep
// pulling quotes out of the business inbox.
export const notifyTo = () => sameDomainOverride("QUOTE_TO") || mailUser()
