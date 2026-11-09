// ─────────────────────────────────────────────────────────────────────────────
// SMS RULES — the checks every outgoing text goes through, as plain functions
// so they can be tested and so the screen and the server agree:
//
//   toE164            a US phone as +1XXXXXXXXXX, or null
//   arrivalWindow     "2:00 PM" → "2-2:30 PM" (the booked time plus 30 min)
//   buildReminder     the default day-before reminder
//   buildReviewRequest  the default request for a Google review
//   finalizeBody      keeps the required "PrimeTV:" start and STOP ending
//   sendingHours      whether it is between 8 AM and 9 PM in Nashville
//   inboundKeyword    STOP / START / HELP in a text a customer sent
//
// No imports beyond the settings, so the browser can use it too.
// ─────────────────────────────────────────────────────────────────────────────

import {
  SMS_PREFIX, SMS_SUFFIX, SMS_TZ, SMS_HOUR_FROM, SMS_HOUR_TO, ARRIVAL_WINDOW_MIN,
} from "./smsConfig.js"

// How many texts (segments) each kind may take, so each one costs and reads as
// little as possible: the reminder and the review request fit in one text, a
// reply in at most two. A GSM-7 text is one segment up to 160 characters.
export const MAX_PARTS = { reminder: 1, review: 1, reply: 2 }
export const partsLimit = kind => MAX_PARTS[kind] || 1

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

// A first name as it fits a text: one word, at most 15 letters, and without
// accents outside the plain SMS alphabet, which would turn the whole text into
// Unicode (70 characters a segment). José stays José; Ramón becomes Ramon.
function smsFirstName(firstName) {
  let n = plainChars(firstName).trim().split(/\s+/)[0] || ""
  if (segments(n).encoding !== "GSM-7") n = n.normalize("NFD").replace(/[̀-ͯ]/g, "")
  return segments(n).encoding === "GSM-7" && n.length <= 15 ? n : ""
}

// The first wording that fits in one text; the shorter ones drop the name, then
// the line about replying, only when a long name or time needs the room.
const firstThatFits = versions => versions.find(v => segments(v).parts === 1) || versions[versions.length - 1]

// `tomorrow` is false when the reminder is for another day, so the text says
// "on Nov 7" instead of promising "tomorrow".
export function buildReminder({ firstName, date, timePref, service = "TV mounting", tomorrow = true }) {
  const name = smsFirstName(firstName)
  const window = arrivalWindow(timePref)
  const day = tomorrow ? `tomorrow, ${shortDate(date)}` : `on ${shortDate(date)}`
  const visit = `we'll arrive ${window ? `${day}, between ${window}` : day} for your ${service}.`
  const hi = n => `${SMS_PREFIX} Hi${n ? ` ${n}` : ""}, `
  return firstThatFits([
    `${hi(name)}${visit} Questions? Reply here. ${SMS_SUFFIX}`,
    `${hi("")}${visit} Questions? Reply here. ${SMS_SUFFIX}`,
    `${hi("")}${visit} ${SMS_SUFFIX}`,
  ])
}

// The review request. The same for every customer: no asking only the happy
// ones, and nothing offered in return.
export function buildReviewRequest({ firstName, reviewUrl }) {
  const text = n => `${SMS_PREFIX} Hi${n ? ` ${n}` : ""}, thanks for choosing us! ` +
    `Would you leave us a quick Google review? ${reviewUrl} ${SMS_SUFFIX}`
  return firstThatFits([text(smsFirstName(firstName)), text("")])
}

// A reply in an ongoing conversation goes as typed when the customer was told
// how to opt out recently; carriers ask for that in the first text and from
// time to time, not in every message. Otherwise it gets the start and ending.
export const REPLY_NOTICE_DAYS = 30
// Curly quotes, long dashes and "…" that phones and keyboards put in would turn
// a text into Unicode (70 characters a segment instead of 160); they become
// their plain equivalents.
const PLAIN = { "‘": "'", "’": "'", "‚": "'", "“": '"', "”": '"', "–": "-", "—": "-", "…": "...", " ": " " }
export const plainChars = text => String(text || "").replace(/[‘’‚“”–—… ]/g, c => PLAIN[c])
export const plainBody = text => plainChars(text).replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").trim()
export const replyBody = (text, noticeIsRecent) => (noticeIsRecent ? plainBody(text) : finalizeBody(text))

// The text as it will be sent: trimmed, one line-ending style, and always
// starting with "PrimeTV:" and ending with "Reply STOP to opt out." — added
// back if an edit removed them, so no message can go out without them.
export function finalizeBody(text) {
  let body = plainBody(text)
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
// ^ { } [ ] ~ \ | € take two characters' room each in GSM-7.
export function segments(text) {
  const s = String(text || "")
  const gsm = /^[\n\r @£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ!"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà^{}\\[~\]|€]*$/.test(s)
  const size = gsm ? s.length + (s.match(/[\^{}\\[\]~|€]/g) || []).length : s.length
  const single = gsm ? 160 : 70, multi = gsm ? 153 : 67
  return { chars: size, encoding: gsm ? "GSM-7" : "Unicode", parts: size <= single ? 1 : Math.ceil(size / multi) }
}

// Start of the booked time in minutes, for putting a day in order.
export function startMinutes(timePref) {
  const one = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(String(timePref || ""))
  return one ? toMinutes(one[1], one[2], one[3]) : 24 * 60
}

// What an incoming text asks for. Twilio's Advanced Opt-Out already answers
// these and says which one it was (OptOutType); the words are the fallback.
const KEYWORDS = {
  stop: ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT", "OPTOUT", "REVOKE"],
  start: ["START", "UNSTOP"],
  help: ["HELP", "INFO"],
}
export function inboundKeyword(body, optOutType) {
  const t = String(optOutType || "").trim().toLowerCase()
  if (t === "stop" || t === "start" || t === "help") return t
  const word = String(body || "").trim().toUpperCase().replace(/[.!]+$/, "")
  return Object.keys(KEYWORDS).find(k => KEYWORDS[k].includes(word)) || null
}

// The customer's number on a logged text, whichever way it went.
export const customerPhoneOf = m => (m.direction === "in" ? m.from_phone : m.to_phone)
