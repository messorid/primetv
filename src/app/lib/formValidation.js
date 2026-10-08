// ─────────────────────────────────────────────────────────────────────────────
// FORM VALIDATION — the rules every public form on the site shares.
//
// Pure functions with no React in them, so the same rules run in the browser
// and in the unit tests. Every form used to have its own idea of a valid phone
// number; most accepted anything with a character in it, so a customer could
// submit "call me" or eleven digits and we would only find out when the
// callback failed.
// ─────────────────────────────────────────────────────────────────────────────

export const digitsOnly = value => String(value ?? "").replace(/\D/g, "")

// ── US phone numbers ────────────────────────────────────────────────────────
//
// North American numbers are ten digits: a three-digit area code, a
// three-digit exchange, four digits. People also paste them with the country
// code in front ("+1 615…", "1-615…"), which makes eleven. We accept that
// leading 1 and drop it, and never hold more than ten digits after it — the
// box simply stops accepting a twelfth keypress instead of letting someone
// type a number that cannot exist.

export function phoneDigits(value) {
  let d = digitsOnly(value)
  if (d.length > 10 && d.startsWith("1")) d = d.slice(1)
  return d.slice(0, 10)
}

// Formats as the user types: "6" → "(6", "615555" → "(615) 555",
// "6155550123" → "(615) 555-0123". Deleting works naturally because the input
// is re-derived from its digits every time.
export function formatUSPhone(value) {
  const d = phoneDigits(value)
  if (d.length === 0) return ""
  if (d.length < 4) return `(${d}`
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

// The longest string formatUSPhone can produce, for the input's maxLength.
export const US_PHONE_MAX_LENGTH = "(615) 555-0123".length

// Ten digits, and the area code and exchange cannot start with 0 or 1 — no
// real North American number does. That catches "1234567890" and most
// transposed area codes without rejecting anything genuine.
export function isValidUSPhone(value) {
  const d = phoneDigits(value)
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(d)
}

// For tel: and sms: links.
export const phoneToE164 = value => {
  const d = phoneDigits(value)
  return d.length === 10 ? `+1${d}` : ""
}

// ── ZIP codes ───────────────────────────────────────────────────────────────

export const cleanZip = value => digitsOnly(value).slice(0, 5)
export const isValidZip = value => /^\d{5}$/.test(String(value ?? "").trim())

// ── Email ───────────────────────────────────────────────────────────────────
//
// Deliberately not RFC-perfect. The goal is to catch typos at the moment they
// are cheap to fix — a missing @, a missing dot, a stray space — not to
// adjudicate exotic but technically legal addresses.

export function isValidEmail(value) {
  const v = String(value ?? "").trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

// The common misspellings of the domains most customers actually use. We
// suggest, never silently change: the customer decides.
const DOMAIN_FIXES = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmail.co": "gmail.com",
  "gamil.com": "gmail.com", "gnail.com": "gmail.com", "gmail.con": "gmail.com",
  "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.con": "yahoo.com",
  "hotmial.com": "hotmail.com", "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com",
  "icloud.con": "icloud.com", "iclod.com": "icloud.com",
}

export function suggestEmail(value) {
  const v = String(value ?? "").trim()
  const at = v.lastIndexOf("@")
  if (at < 1) return ""
  const domain = v.slice(at + 1).toLowerCase()
  const fix = DOMAIN_FIXES[domain]
  return fix ? `${v.slice(0, at)}@${fix}` : ""
}

// ── Names ───────────────────────────────────────────────────────────────────

export const isValidName = value => String(value ?? "").trim().replace(/[^A-Za-zÀ-ÿ]/g, "").length >= 2

// ── Dates ───────────────────────────────────────────────────────────────────

// Today in the visitor's own timezone, as YYYY-MM-DD. toISOString() would give
// the UTC date, which in Nashville after 6 or 7pm is already tomorrow and
// would stop someone choosing today.
export function localToday(now = new Date()) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// ── Messages ────────────────────────────────────────────────────────────────
//
// One wording per rule, so the same mistake reads the same on every form.

// Labels are passed already worded for the sentence ("a TV size"). Lower-
// casing them here turned "TV" into "tv" and "ZIP" into "zip".
export const MESSAGES = {
  required:  label => `Please enter your ${label}.`,
  choose:    label => `Please choose ${label}.`,
  name:      "Please enter your name (at least 2 letters).",
  phone:     "Enter a 10-digit US phone number, like (615) 555-0123.",
  email:     "Enter a valid email, like name@example.com.",
  zip:       "Enter a 5-digit ZIP code, like 37209.",
}

// Runs a set of rules and returns { field: message } for whatever failed. Each
// rule is [field, isValid, message]. An empty object means the form is valid.
export function validate(rules) {
  const errors = {}
  for (const [field, ok, message] of rules) {
    if (!ok && !errors[field]) errors[field] = message
  }
  return errors
}
