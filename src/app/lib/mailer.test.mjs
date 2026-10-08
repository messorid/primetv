// Which SMTP server the site sends through, and how it is chosen.
//
// The point of these is that switching from Gmail to Hostinger is a change of
// environment variables, not of code — so the variable handling is the thing
// worth pinning down. Everything reads process.env at call time, so each test
// just sets the environment it wants.

import { test, beforeEach } from "node:test"
import assert from "node:assert/strict"
import { smtpConfig, mailFrom, notifyTo, canSendMail, getTransport } from "./mailer.js"

const MAIL_VARS = [
  "EMAIL_USER", "EMAIL_PASS", "SMTP_USER", "SMTP_PASS",
  "SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "MAIL_FROM", "QUOTE_TO",
]

beforeEach(() => {
  for (const v of MAIL_VARS) delete process.env[v]
  process.env.EMAIL_USER = "info@primetvnashville.com"
  process.env.EMAIL_PASS = "secret"
})

test("with no SMTP_HOST it still goes through Gmail, exactly as before", () => {
  const c = smtpConfig()
  assert.equal(c.service, "gmail")
  assert.equal(c.host, undefined, "a Gmail config must not also carry a host")
  assert.deepEqual(c.auth, { user: "info@primetvnashville.com", pass: "secret" })
})

test("setting SMTP_HOST switches to that server", () => {
  process.env.SMTP_HOST = "smtp.hostinger.com"
  const c = smtpConfig()
  assert.equal(c.host, "smtp.hostinger.com")
  assert.equal(c.service, undefined, "a custom host must not also claim a service")
})

test("Hostinger on 465 is treated as implicit TLS", () => {
  process.env.SMTP_HOST = "smtp.hostinger.com"
  process.env.SMTP_PORT = "465"
  const c = smtpConfig()
  assert.equal(c.port, 465)
  assert.equal(c.secure, true, "465 is TLS from the first byte")
})

test("Hostinger on 587 is treated as STARTTLS", () => {
  process.env.SMTP_HOST = "smtp.hostinger.com"
  process.env.SMTP_PORT = "587"
  const c = smtpConfig()
  assert.equal(c.port, 587)
  assert.equal(c.secure, false, "587 starts plaintext and upgrades")
})

test("a custom host with no port defaults to secure 465", () => {
  process.env.SMTP_HOST = "mail.example.com"
  const c = smtpConfig()
  assert.equal(c.port, 465)
  assert.equal(c.secure, true)
})

test("SMTP_SECURE overrides whatever the port implies", () => {
  process.env.SMTP_HOST = "smtp.hostinger.com"
  process.env.SMTP_PORT = "465"
  process.env.SMTP_SECURE = "false"
  assert.equal(smtpConfig().secure, false)

  process.env.SMTP_PORT = "587"
  process.env.SMTP_SECURE = "true"
  assert.equal(smtpConfig().secure, true)
})

test("a non-numeric port does not produce NaN", () => {
  process.env.SMTP_HOST = "smtp.hostinger.com"
  process.env.SMTP_PORT = "not-a-port"
  const c = smtpConfig()
  assert.equal(c.port, 465, "falls back rather than handing NaN to nodemailer")
})

test("SMTP_USER and SMTP_PASS work when EMAIL_* are absent", () => {
  delete process.env.EMAIL_USER
  delete process.env.EMAIL_PASS
  process.env.SMTP_USER = "info@primetvnashville.com"
  process.env.SMTP_PASS = "secret"
  assert.equal(canSendMail(), true)
  assert.deepEqual(smtpConfig().auth, { user: "info@primetvnashville.com", pass: "secret" })
})

test("mail is sent as the authenticated mailbox by default", () => {
  // Sending as an address the SMTP session did not authenticate as is what
  // gets a domain's mail filed as spoofed, so the default has to match.
  assert.equal(mailFrom(), '"PrimeTvNashville" <info@primetvnashville.com>')
  assert.equal(mailFrom("PrimeTV Nashville"), '"PrimeTV Nashville" <info@primetvnashville.com>')
})

test("MAIL_FROM can override the visible sender", () => {
  process.env.MAIL_FROM = "bookings@primetvnashville.com"
  assert.equal(mailFrom(), '"PrimeTvNashville" <bookings@primetvnashville.com>')
})

test("a MAIL_FROM on another domain is ignored — the production outage", () => {
  // The exact state production was in: logged in to Hostinger as info@,
  // a year-old MAIL_FROM still saying messoweb@gmail.com. Obeying it made
  // Hostinger refuse every message with "553 Sender address rejected".
  process.env.SMTP_HOST = "smtp.hostinger.com"
  process.env.MAIL_FROM = "messoweb@gmail.com"
  assert.equal(mailFrom(), '"PrimeTvNashville" <info@primetvnashville.com>')
})

test("a QUOTE_TO on another domain is ignored, so quotes stay in the business inbox", () => {
  process.env.QUOTE_TO = "tvprimenashville@gmail.com"
  assert.equal(notifyTo(), "info@primetvnashville.com")
})

test("a display-name MAIL_FROM is read by its address, not its brackets", () => {
  // The foreign one production actually had, in this exact format.
  process.env.MAIL_FROM = "PrimeTv Nashville <messoweb@gmail.com>"
  assert.equal(mailFrom(""), "info@primetvnashville.com")

  // And a legitimate same-domain one in the same format must be honoured,
  // without being double-wrapped in a second display name.
  process.env.MAIL_FROM = "PrimeTV <bookings@primetvnashville.com>"
  assert.equal(mailFrom("PrimeTvNashville"), '"PrimeTvNashville" <bookings@primetvnashville.com>')
})

test("the domain comparison ignores case and stray spaces", () => {
  process.env.MAIL_FROM = "  Bookings@PrimeTvNashville.com "
  assert.equal(mailFrom(""), "Bookings@PrimeTvNashville.com")
})

test("internal notifications default to the sending mailbox", () => {
  assert.equal(notifyTo(), "info@primetvnashville.com")
  process.env.QUOTE_TO = "daniel@primetvnashville.com"
  assert.equal(notifyTo(), "daniel@primetvnashville.com")
})

test("no credentials means no transport, rather than a broken one", () => {
  delete process.env.EMAIL_USER
  delete process.env.EMAIL_PASS
  assert.equal(canSendMail(), false)
  assert.equal(getTransport(), null, "callers check for null instead of catching a send failure")
})

test("a password without a user is still not sendable", () => {
  delete process.env.EMAIL_USER
  assert.equal(canSendMail(), false)
  assert.equal(getTransport(), null)
})

test("a real transport is produced once both are present", () => {
  process.env.SMTP_HOST = "smtp.hostinger.com"
  const t = getTransport()
  assert.ok(t, "expected a transport")
  assert.equal(typeof t.sendMail, "function")
})

test("every message gets a plain-text part generated from its HTML", async () => {
  process.env.SMTP_HOST = "smtp.hostinger.com"
  const t = getTransport()
  // Capture what reaches nodemailer instead of opening a connection.
  const seen = []
  t.transporter.send = (mail, cb) => { seen.push(mail.data); cb(null, { messageId: "x" }) }
  await t.sendMail({ from: "a@b.com", to: "c@d.com", subject: "s", html: "<p>Hello <b>Ada</b></p>" })
  assert.equal(seen[0].text, "Hello Ada")
})

test("an explicit text part is left alone", async () => {
  process.env.SMTP_HOST = "smtp.hostinger.com"
  const t = getTransport()
  const seen = []
  t.transporter.send = (mail, cb) => { seen.push(mail.data); cb(null, { messageId: "x" }) }
  await t.sendMail({ from: "a@b.com", to: "c@d.com", subject: "s", html: "<p>HTML</p>", text: "Hand written" })
  assert.equal(seen[0].text, "Hand written")
})
