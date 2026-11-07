// ─────────────────────────────────────────────────────────────────────────────
// SMS — the server side of every outgoing text: consent and opt-out records,
// the message log, sending through Twilio, and checking Twilio's delivery
// reports. Nothing here sends on its own; every send starts with a person
// pressing a button in the admin.
//
// SMS_MODE decides what "send" does:
//   (unset) / "dry-run"  nothing leaves the server; the message is logged as
//                        what WOULD have been sent. The default.
//   "test"               Twilio test credentials and Twilio's test number, to
//                        check the API path. Nothing is delivered or billed.
//   "live"               real texts through the Messaging Service.
//
// Credentials come only from TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and
// TWILIO_MESSAGING_SERVICE_SID, and are never logged or returned.
// ─────────────────────────────────────────────────────────────────────────────

import { createHmac, timingSafeEqual } from "node:crypto"
import { BRAND } from "./emailLayout.js"

export const smsMode = () => {
  const m = String(process.env.SMS_MODE || "").trim().toLowerCase()
  return m === "live" || m === "test" ? m : "dry-run"
}

// Twilio's test number: with test credentials it "sends" without delivering.
const TEST_FROM = "+15005550006"

export const statusCallbackUrl = () => `${process.env.SITE_URL || BRAND.site}/api/sms/status`
// The number's "A message comes in" webhook. Set exactly this URL in Twilio:
// the signature is checked against it.
export const inboundUrl = () => `${process.env.SITE_URL || BRAND.site}/api/sms/inbound`

// ── Tables ──────────────────────────────────────────────────────────────────

export async function ensureSmsTables(sql) {
  // Consent is kept per phone number, with how and when it was given and the
  // exact words agreed to. Rows are never edited; a new consent is a new row.
  await sql`
    CREATE TABLE IF NOT EXISTS sms_consents (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone           TEXT NOT NULL,
      method          TEXT NOT NULL,
      consent_text    TEXT,
      consent_version TEXT,
      given_at        TIMESTAMPTZ NOT NULL,
      recorded_at     TIMESTAMPTZ DEFAULT NOW(),
      recorded_by     TEXT,
      booking_id      UUID,
      ip              TEXT,
      user_agent      TEXT,
      note            TEXT
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS sms_consents_phone_idx ON sms_consents (phone)`
  // An opt-out (STOP) per phone. A consent given after it lifts it.
  await sql`
    CREATE TABLE IF NOT EXISTS sms_optouts (
      phone        TEXT PRIMARY KEY,
      opted_out_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      source       TEXT,
      recorded_by  TEXT,
      note         TEXT
    )
  `
  // Every text sent (or, in dry-run, that would have been sent).
  await sql`
    CREATE TABLE IF NOT EXISTS sms_messages (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id    UUID,
      kind          TEXT NOT NULL,
      to_phone      TEXT NOT NULL,
      body          TEXT NOT NULL,
      sent_by       TEXT,
      mode          TEXT NOT NULL,
      twilio_sid    TEXT,
      status        TEXT,
      error_code    INT,
      error_message TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      status_at     TIMESTAMPTZ
    )
  `
  // Texts customers send us are rows too: direction 'in', from_phone is theirs,
  // read_at is when someone opened the conversation.
  await sql`
    ALTER TABLE sms_messages
      ADD COLUMN IF NOT EXISTS direction  TEXT NOT NULL DEFAULT 'out',
      ADD COLUMN IF NOT EXISTS from_phone TEXT,
      ADD COLUMN IF NOT EXISTS read_at    TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS media      JSONB
  `
  await sql`CREATE INDEX IF NOT EXISTS sms_messages_booking_idx ON sms_messages (booking_id, kind)`
  await sql`CREATE INDEX IF NOT EXISTS sms_messages_sid_idx ON sms_messages (twilio_sid)`
}

// ── Consent ─────────────────────────────────────────────────────────────────

// Whether a phone may be texted, and why not if it can't.
export function consentState(consent, optout) {
  if (!consent) return { allowed: false, reason: "No SMS consent: this customer didn't tick the SMS box when booking." }
  if (optout && new Date(optout.opted_out_at) >= new Date(consent.given_at)) {
    return { allowed: false, reason: `Opted out (STOP) on ${new Date(optout.opted_out_at).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Chicago" })}.` }
  }
  return { allowed: true, reason: null }
}

// The latest consent and any opt-out for each phone in the list.
export async function smsStatusFor(sql, phones) {
  const list = [...new Set(phones.filter(Boolean))]
  const out = new Map()
  if (!list.length) return out
  const consents = await sql`
    SELECT DISTINCT ON (phone) phone, method, given_at, recorded_by, note, consent_version
    FROM sms_consents WHERE phone = ANY(${list}) ORDER BY phone, given_at DESC
  `
  const optouts = await sql`SELECT phone, opted_out_at, source FROM sms_optouts WHERE phone = ANY(${list})`
  const c = new Map(consents.map(r => [r.phone, r]))
  const o = new Map(optouts.map(r => [r.phone, r]))
  for (const p of list) {
    const consent = c.get(p) || null, optout = o.get(p) || null
    out.set(p, { consent, optout, ...consentState(consent, optout) })
  }
  return out
}

export async function recordConsent(sql, { phone, method, consentText, consentVersion, givenAt, recordedBy, bookingId, ip, userAgent, note }) {
  await sql`
    INSERT INTO sms_consents (phone, method, consent_text, consent_version, given_at, recorded_by, booking_id, ip, user_agent, note)
    VALUES (${phone}, ${method}, ${consentText || null}, ${consentVersion || null}, ${givenAt || new Date().toISOString()},
            ${recordedBy || null}, ${bookingId || null}, ${ip || null}, ${userAgent || null}, ${note || null})
  `
}

export async function recordOptout(sql, { phone, source, recordedBy, note }) {
  await sql`
    INSERT INTO sms_optouts (phone, opted_out_at, source, recorded_by, note)
    VALUES (${phone}, NOW(), ${source || null}, ${recordedBy || null}, ${note || null})
    ON CONFLICT (phone) DO UPDATE SET opted_out_at = NOW(), source = EXCLUDED.source,
      recorded_by = EXCLUDED.recorded_by, note = EXCLUDED.note
  `
}

// START after a STOP: the customer agreed on the booking form before, so that
// consent applies again. Without an earlier consent it changes nothing.
export async function liftOptout(sql, phone) {
  const [c] = await sql`SELECT 1 FROM sms_consents WHERE phone = ${phone} LIMIT 1`
  if (!c) return false
  await sql`DELETE FROM sms_optouts WHERE phone = ${phone}`
  return true
}

// ── Sending ─────────────────────────────────────────────────────────────────

// Twilio error 21610: the number replied STOP to our Messaging Service.
export const UNSUBSCRIBED = 21610

// Sends one text. Never throws for a Twilio refusal — it returns it, so the
// log always gets a row with the outcome.
export async function sendSms({ to, body }) {
  const mode = smsMode()
  if (mode === "dry-run") return { mode, sid: null, status: "dry-run", errorCode: null, errorMessage: null }

  const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN
  const service = process.env.TWILIO_MESSAGING_SERVICE_SID
  if (!sid || !token || (mode === "live" && !service)) {
    return { mode, sid: null, status: "failed", errorCode: null, errorMessage: "Twilio is not configured on the server" }
  }
  const form = new URLSearchParams({ To: to, Body: body })
  if (mode === "live") {
    form.set("MessagingServiceSid", service)
    form.set("StatusCallback", statusCallbackUrl())
  } else {
    form.set("From", TEST_FROM) // test credentials can't use a Messaging Service
  }
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { mode, sid: null, status: "failed", errorCode: data.code ?? null, errorMessage: data.message || `HTTP ${res.status}` }
    return { mode, sid: data.sid, status: data.status || "queued", errorCode: data.error_code ?? null, errorMessage: data.error_message ?? null }
  } catch (err) {
    return { mode, sid: null, status: "failed", errorCode: null, errorMessage: `Could not reach Twilio: ${err.message}` }
  }
}

// ── Delivery reports ────────────────────────────────────────────────────────

// Twilio signs each callback: HMAC-SHA1, keyed with the auth token, over the
// full URL followed by every POST parameter (sorted by name) as name+value,
// base64-encoded in the X-Twilio-Signature header.
export function twilioSignature(authToken, url, params) {
  const data = url + Object.keys(params).sort().map(k => k + params[k]).join("")
  return createHmac("sha1", authToken).update(Buffer.from(data, "utf-8")).digest("base64")
}

export function validTwilioSignature(authToken, signature, url, params) {
  if (!authToken || !signature) return false
  const expected = Buffer.from(twilioSignature(authToken, url, params))
  const given = Buffer.from(String(signature))
  return expected.length === given.length && timingSafeEqual(expected, given)
}

// Statuses can arrive out of order; a later one never overwrites a final one.
const RANK = { "dry-run": 0, accepted: 1, queued: 1, sending: 2, sent: 3, delivered: 4, undelivered: 4, failed: 4, read: 5 }
export const statusRank = s => RANK[s] ?? 0
