// ─────────────────────────────────────────────────────────────────────────────
// CALLS on the PrimeTV Twilio number. Nothing here calls anyone on its own.
//
//   incoming  Twilio asks /api/voice/inbound what to do; the call is forwarded
//             to CALL_FORWARD_TO (e.g. a Google Voice number) for RING_SECONDS.
//             Unanswered, the caller hears a short message and it's logged as
//             missed.
//   outgoing  someone presses "Call" in the admin: Twilio rings CALL_FORWARD_TO
//             first, the person answers and presses 1, then Twilio dials the
//             customer showing the PrimeTV number. Pressing 1 keeps a voicemail
//             from being connected to the customer.
//
// Calls are never recorded. Every Twilio request is checked against its
// signature; credentials come only from the environment.
// ─────────────────────────────────────────────────────────────────────────────

import { BRAND } from "./emailLayout.js"
import { toE164 } from "./smsRules.js"

export const siteUrl = () => process.env.SITE_URL || BRAND.site
export const voiceUrl = (step, params = {}) => {
  const q = new URLSearchParams(params).toString()
  return `${siteUrl()}/api/voice/${step}${q ? `?${q}` : ""}`
}
export const ourNumber = () => toE164(process.env.TWILIO_NUMBER) || "+16153956565"
export const forwardNumber = () => toE164(process.env.CALL_FORWARD_TO)

// Short enough that Twilio gives up before a voicemail on the forwarded phone
// answers, so a call nobody took is logged as missed, not as answered.
export const RING_SECONDS = 18
export const MISSED_MESSAGE = "Sorry we missed your call. We'll call you back shortly. Thank you for calling PrimeTV."

const XML_ESC = { "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }
export const xml = s => String(s ?? "").replace(/[<>&'"]/g, c => XML_ESC[c])
export const say = text => `<Say language="en-US">${xml(text)}</Say>`
export const twiml = (body = "") =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${body}</Response>`, { status: 200, headers: { "Content-Type": "text/xml" } })

export async function ensureCallTables(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS calls (
      id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      direction      TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      booking_id     UUID,
      call_sid       TEXT,
      status         TEXT NOT NULL,
      duration       INT,
      placed_by      TEXT,
      created_at     TIMESTAMPTZ DEFAULT NOW(),
      ended_at       TIMESTAMPTZ,
      read_at        TIMESTAMPTZ
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS calls_phone_idx ON calls (customer_phone)`
  await sql`CREATE INDEX IF NOT EXISTS calls_sid_idx ON calls (call_sid)`
}

// What a finished <Dial> means for the log.
//   incoming: answered | missed
//   outgoing: answered | no-answer | busy | failed | not-connected
export function callStatusFromDial(dialStatus, direction) {
  const s = String(dialStatus || "").toLowerCase()
  if (s === "completed" || s === "answered") return "answered"
  if (direction === "in") return "missed"
  if (s === "no-answer" || s === "busy" || s === "failed") return s
  return "not-connected"
}

// The latest booking for a number, matched on its last ten digits.
export async function bookingForPhone(sql, phone) {
  const last10 = String(phone || "").replace(/\D/g, "").slice(-10)
  if (last10.length !== 10) return null
  const [b] = await sql`
    SELECT id, first_name, last_name FROM bookings
    WHERE right(regexp_replace(COALESCE(phone, ''), '[^0-9]', '', 'g'), 10) = ${last10}
    ORDER BY created_at DESC LIMIT 1
  `
  return b || null
}

// Starts the outgoing bridge: rings the forwarding phone first.
export async function ringAgent({ id }) {
  const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN
  const agent = forwardNumber()
  if (!sid || !token) return { ok: false, error: "Twilio is not configured on the server." }
  if (!agent) return { ok: false, error: "No phone to ring: set CALL_FORWARD_TO in Vercel." }
  const form = new URLSearchParams({
    To: agent, From: ourNumber(), Timeout: "25",
    Url: voiceUrl("bridge", { id }), Method: "POST",
    StatusCallback: voiceUrl("agent-status", { id }), StatusCallbackMethod: "POST",
  })
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Calls.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: data.message || `Twilio error (HTTP ${res.status})` }
    return { ok: true, sid: data.sid }
  } catch (err) {
    return { ok: false, error: `Could not reach Twilio: ${err.message}` }
  }
}
