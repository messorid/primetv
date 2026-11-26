import assert from "node:assert/strict"
import test from "node:test"
import { bookingSmsConsentUrl, CONSENT_VALID_SECONDS, matchesSmsInvite, parseSmsInvite } from "./bookingSmsConsent.js"
import { buildClientEmail } from "./clientEmail.js"
import { bookingReminderConsent, consentState, smsConsentBlocker } from "./sms.js"

test("the private link binds consent to the booking's current phone and email", t => {
  const originalSecret = process.env.ADMIN_SESSION_SECRET
  process.env.ADMIN_SESSION_SECRET = "fixture-secret-used-only-for-this-test"
  t.after(() => {
    if (originalSecret === undefined) delete process.env.ADMIN_SESSION_SECRET
    else process.env.ADMIN_SESSION_SECRET = originalSecret
  })
  const booking = {
    _id: "d7874a5d-963d-4c79-9bb2-87958383b221",
    phone: "(615) 555-0123",
    email: "fixture@example.com",
    status: "pending",
  }
  const now = Date.parse("2026-11-26T18:00:00Z")
  const url = bookingSmsConsentUrl(booking, now)
  const token = new URL(url).searchParams.get("invite")
  const invite = parseSmsInvite(token, now)
  const replacement = bookingSmsConsentUrl(booking, now)
  assert.equal(invite.bookingId, booking._id)
  assert.equal(matchesSmsInvite(invite, booking), true)
  assert.equal(matchesSmsInvite(invite, { ...booking, phone: "615-555-0124" }), false)
  assert.equal(matchesSmsInvite(invite, { ...booking, email: "changed@example.com" }), false)
  assert.equal(matchesSmsInvite(invite, { ...booking, status: "cancelled" }), false)
  const modified = token.slice(0, -43) + "A".repeat(43)
  assert.equal(matchesSmsInvite(parseSmsInvite(modified, now), booking), false)
  assert.equal(parseSmsInvite(token, now + CONSENT_VALID_SECONDS * 1000), null)
  assert.notEqual(parseSmsInvite(new URL(replacement).searchParams.get("invite"), now).consentId, invite.consentId)
  assert.match(buildClientEmail(booking, { smsConsentUrl: url }).html, /Choose text reminders/)
  assert.doesNotMatch(buildClientEmail(booking).html, /Choose text reminders/)
})

test("office-email consent is limited to reminders and respects a prior STOP", () => {
  const consent = { method: "booking_email", given_at: "2026-11-26T18:00:00Z" }
  const status = { consent, ...consentState(consent, null) }
  assert.equal(smsConsentBlocker(status, "reminder"), null)
  assert.match(smsConsentBlocker(status, "review"), /reminders only/)
  assert.match(smsConsentBlocker(status, "reply"), /reminders only/)
  assert.equal(consentState(consent, { opted_out_at: "2026-11-25T18:00:00Z" }).allowed, false)
  assert.equal(smsConsentBlocker({ ...status, consent: { method: "booking_form" } }, "review"), null)
})

test("verbal consent applies to reminders for this booking and keeps STOP in force", () => {
  const noConsent = { consent: null, optout: null, ...consentState(null, null) }
  const booking = { choice: "phone", phone: "+16155550123" }
  const consent = { method: "booking_phone", phone: booking.phone, given_at: "2026-11-26T18:00:00Z" }
  assert.equal(bookingReminderConsent(noConsent, booking, consent, true).allowed, true)
  assert.match(bookingReminderConsent(noConsent, booking, consent, false).reason, /Twilio/)
  assert.equal(bookingReminderConsent(noConsent, { ...booking, phone: "+16155550124" }, consent, true).allowed, false)
  assert.equal(bookingReminderConsent(noConsent, booking, null, true).allowed, false)
  const stopped = { ...noConsent, optout: { opted_out_at: "2026-11-25T18:00:00Z" } }
  assert.match(bookingReminderConsent(stopped, booking, consent, true).reason, /STOP/)
  const previous = { ...noConsent, consent: { method: "booking_form" }, allowed: true, reason: null }
  assert.equal(bookingReminderConsent(previous, booking, consent, false), previous)
  assert.match(bookingReminderConsent(previous, { ...booking, choice: "declined" }, null, true).reason, /declined/)
})
