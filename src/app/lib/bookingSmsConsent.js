import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"
import { BRAND } from "./emailLayout.js"
import { toE164 } from "./smsRules.js"

export const CONSENT_ENDPOINT = "/api/sms/booking-opt-in"
export const CONSENT_COOKIE = "primetv-sms-invite"
export const CONSENT_VALID_SECONDS = 30 * 24 * 60 * 60

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

function signature(payload, booking) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  const phone = toE164(booking.phone)
  const email = booking.email?.trim().toLowerCase()
  if (!secret || !phone || !email || booking.status === "cancelled") return null
  return createHmac("sha256", secret)
    .update(JSON.stringify(["primetv-sms-consent", payload, phone, email]))
    .digest()
}

export function bookingSmsConsentUrl(booking, now = Date.now()) {
  if (!UUID.test(booking._id)) return null
  const payload = `${booking._id}.${randomUUID()}.${Math.floor(now / 1000) + CONSENT_VALID_SECONDS}`
  const proof = signature(payload, booking)
  if (!proof) return null
  const url = new URL(CONSENT_ENDPOINT, process.env.SITE_URL || BRAND.site)
  url.searchParams.set("invite", `${payload}.${proof.toString("base64url")}`)
  return url.toString()
}

export function parseSmsInvite(token, now = Date.now()) {
  if (!token || token.length > 140) return null
  const parts = token.split(".")
  const [bookingId, consentId, expiry, proof] = parts
  if (parts.length !== 4 || !UUID.test(bookingId) || !UUID.test(consentId) ||
      !/^\d{10}$/.test(expiry) || Number(expiry) <= now / 1000 || !/^[\w-]{43}$/.test(proof)) return null
  return { bookingId, consentId, payload: parts.slice(0, 3).join("."), proof: Buffer.from(proof, "base64url") }
}

export function matchesSmsInvite(invite, booking) {
  const expected = signature(invite.payload, booking)
  return Boolean(expected && timingSafeEqual(expected, invite.proof))
}
