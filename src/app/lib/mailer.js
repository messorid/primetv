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

// The address mail is sent as. With a custom domain this must be the mailbox
// that SMTP authenticated as, or the receiving server sees a mismatch between
// the envelope sender and the From header and treats it as spoofing.
export function mailFrom(displayName = "PrimeTvNashville") {
  const address = process.env.MAIL_FROM || mailUser()
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

// Where mail about a job goes internally. Separate from the sending account so
// notifications can be routed somewhere else later without touching SMTP.
export const notifyTo = () => process.env.QUOTE_TO || mailUser()
