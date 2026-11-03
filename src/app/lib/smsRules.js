// ─────────────────────────────────────────────────────────────────────────────
// SMS RULES — the checks every outgoing text goes through, as plain functions
// so they can be tested and so the screen and the server agree:
//
//   toE164            a US phone as +1XXXXXXXXXX, or null
//   arrivalWindow     "2:00 PM" → "2-2:30 PM" (the booked time plus 30 min)
//   buildReminder     the default day-before reminder
//   finalizeBody      keeps the required "PrimeTV:" start and STOP ending
//   sendingHours      whether it is between 8 AM and 9 PM in Nashville
//
// No imports beyond the settings, so the browser can use it too.
// ─────────────────────────────────────────────────────────────────────────────

import {
  SMS_PREFIX, SMS_SUFFIX, SMS_TZ, SMS_HOUR_FROM, SMS_HOUR_TO, ARRIVAL_WINDOW_MIN,
} from "./smsConfig.js"

export const MAX_SMS_CHARS = 480 // three segments; reminders are about two

// A US number as E.164, or null. Area codes and exchanges can't start with 0
// or 1 (NANP), which also rejects obvious typos.
export function toE164(phone) {
  let d = String(phone || "").replace(/\D/g, "")
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1)
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(d) ? `+1${d}` : null
}

export const displayPhone = e164 => {
  const d = String(e164 || "").replace(/^\+1/, "")
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : String(e164 || "")
}

// Minutes since midnight → "2", "2:30", with AM/PM given separately.
const clock = mins => {
  const h24 = Math.floor(mins / 60) % 24, m = mins % 60
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return { text: m ? `${h12}:${String(m).padStart(2, "0")}` : String(h12), pm: h24 >= 12 }
}
const range = (fromMin, toMin) => {
  const a = clock(fromMin), b = clock(toMin)
  // "2-2:30 PM" when both halves share AM/PM, "11:45 AM-12:15 PM" when not.
  // A plain hyphen, not an en dash: one non-GSM character turns the whole
  // text into Unicode, which splits at 70 characters and costs ~50% more.
  return a.pm === b.pm
    ? `${a.text}-${b.text} ${b.pm ? "PM" : "AM"}`
    : `${a.text} ${a.pm ? "PM" : "AM"}-${b.text} ${b.pm ? "PM" : "AM"}`
}
const toMinutes = (h, m, ap) => (Number(h) % 12 + (/p/i.test(ap) ? 12 : 0)) * 60 + Number(m || 0)

// The arrival window to text, from the booking's time. A single time ("2:00
// PM", what the booking form stores) becomes that time plus 30 minutes. An
// older booking with a range ("Morning (8am – 12pm)") keeps its range. A
// booking with no real time ("Flexible") returns null: someone has to set the
// time before a reminder can promise one.
export function arrivalWindow(timePref) {
  const s = String(timePref || "")
  const two = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–—-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(s)
  if (two) return range(toMinutes(two[1], two[2], two[3]), toMinutes(two[4], two[5], two[6]))
  const one = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(s)
  if (one) {
    const start = toMinutes(one[1], one[2], one[3])
    return range(start, start + ARRIVAL_WINDOW_MIN)
  }
  return null
}

// "2026-11-05" → "Nov 5".
export function shortDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return ""
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
}

// What the job is called in the text.
export function serviceLabel(b) {
  if (b?.bookingMode === "homeinstall" || b?.booking_mode === "homeinstall") return "installation"
  return "TV mounting"
}

// `tomorrow` is false when the reminder is for another day, so the text says
// "on Nov 7" instead of promising "tomorrow".
export function buildReminder({ firstName, date, timePref, service = "TV mounting", tomorrow = true }) {
  const name = String(firstName || "").trim().split(/\s+/)[0]
  const window = arrivalWindow(timePref)
  const when = [tomorrow ? `tomorrow, ${shortDate(date)}` : `on ${shortDate(date)}`, window && `between ${window}`].filter(Boolean).join(", ")
  return `${SMS_PREFIX} Hi${name ? ` ${name}` : ""}, reminder that we'll be at your home ${when} for your ${service}. ` +
    `Reply here with any questions. ${SMS_SUFFIX}`
}

// The text as it will be sent: trimmed, one line-ending style, and always
// starting with "PrimeTV:" and ending with "Reply STOP to opt out." — added
// back if an edit removed them, so no message can go out without them.
export function finalizeBody(text) {
  let body = String(text || "").replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").trim()
  if (!body.startsWith(SMS_PREFIX)) body = `${SMS_PREFIX} ${body}`
  if (!body.endsWith(SMS_SUFFIX)) body = `${body}${/[.!?]$/.test(body) ? "" : "."} ${SMS_SUFFIX}`
  return body
}

// Whether a text may go out now: 8:00 AM to 9:00 PM in Nashville.
export function sendingHours(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: SMS_TZ, hour: "numeric", minute: "2-digit", hour12: false }).formatToParts(now)
  const hour = Number(parts.find(p => p.type === "hour").value) % 24
  const minute = Number(parts.find(p => p.type === "minute").value)
  const local = now.toLocaleTimeString("en-US", { timeZone: SMS_TZ, hour: "numeric", minute: "2-digit" })
  const ok = hour >= SMS_HOUR_FROM && hour < SMS_HOUR_TO
  return {
    ok,
    local,
    reason: ok ? null : `It's ${local} in Nashville. Texts can only be sent between 8:00 AM and 9:00 PM.`,
    minutes: hour * 60 + minute,
  }
}

// Today and tomorrow in Nashville, as "YYYY-MM-DD".
export function nashvilleDate(now = new Date(), addDays = 0) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: SMS_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now)
  if (!addDays) return today
  const d = new Date(`${today}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + addDays)
  return d.toISOString().slice(0, 10)
}

// GSM-7 texts split at 160 characters (153 per part when joined); anything
// with emoji or curly quotes switches to UCS-2 at 70 (67).
export function segments(text) {
  const s = String(text || "")
  const gsm = /^[\n\r @£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ!"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà^{}\\[~\]|€]*$/.test(s)
  const single = gsm ? 160 : 70, multi = gsm ? 153 : 67
  return { chars: s.length, encoding: gsm ? "GSM-7" : "Unicode", parts: s.length <= single ? 1 : Math.ceil(s.length / multi) }
}

// Start of the booked time in minutes, for putting a day in order.
export function startMinutes(timePref) {
  const one = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(String(timePref || ""))
  return one ? toMinutes(one[1], one[2], one[3]) : 24 * 60
}
