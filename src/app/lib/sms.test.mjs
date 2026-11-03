import { test } from "node:test"
import assert from "node:assert/strict"
import {
  toE164, arrivalWindow, buildReminder, finalizeBody, sendingHours, nashvilleDate, segments, startMinutes,
} from "./smsRules.js"
import { consentState, twilioSignature, validTwilioSignature, sendSms, smsMode, statusRank } from "./sms.js"
import { SMS_PREFIX, SMS_SUFFIX, SMS_CONSENT_TEXT } from "./smsConfig.js"

test("phones become E.164, and bad ones are refused", () => {
  assert.equal(toE164("(615) 555-0142"), "+16155550142")
  assert.equal(toE164("1 615 555 0142"), "+16155550142")
  for (const bad of ["555-0142", "(115) 555-0142", "(615) 155-0142", "", null]) assert.equal(toE164(bad), null, String(bad))
})

test("the arrival window is the booked time plus 30 minutes", () => {
  assert.equal(arrivalWindow("2:00 PM"), "2-2:30 PM")
  assert.equal(arrivalWindow("9:30 AM"), "9:30-10 AM")
  assert.equal(arrivalWindow("11:45 AM"), "11:45 AM-12:15 PM")
  assert.equal(arrivalWindow("12:00 PM"), "12-12:30 PM")
  // Older bookings stored a range; it is kept as it was.
  assert.equal(arrivalWindow("Morning (8am – 12pm)"), "8 AM-12 PM")
  assert.equal(arrivalWindow("Flexible"), null)
  assert.equal(arrivalWindow(""), null)
})

test("the reminder reads like the brief and stays in plain-SMS characters", () => {
  const t = buildReminder({ firstName: "Mike Smith", date: "2026-11-05", timePref: "2:00 PM" })
  assert.equal(t, "PrimeTV: Hi Mike, reminder that we'll be at your home tomorrow, Nov 5, between 2-2:30 PM for your TV mounting. Reply here with any questions. Reply STOP to opt out.")
  assert.equal(segments(t).encoding, "GSM-7")
  assert.equal(segments(t).parts, 2)
  assert.match(buildReminder({ firstName: "Ana", date: "2026-11-07", timePref: "10:30 AM", tomorrow: false }), /at your home on Nov 7, between 10:30-11 AM/)
})

test("every text keeps the required start and STOP ending", () => {
  assert.equal(finalizeBody("Hi Mike, see you tomorrow?"), `${SMS_PREFIX} Hi Mike, see you tomorrow? ${SMS_SUFFIX}`)
  assert.equal(finalizeBody("See you tomorrow"), `${SMS_PREFIX} See you tomorrow. ${SMS_SUFFIX}`)
  const full = `${SMS_PREFIX} Hi. ${SMS_SUFFIX}`
  assert.equal(finalizeBody(`  ${full}  `), full)
})

test("texts go out only between 8 AM and 9 PM in Nashville", () => {
  // November: Nashville is UTC-6.
  assert.equal(sendingHours(new Date("2026-11-03T13:59:00Z")).ok, false) // 7:59 AM
  assert.equal(sendingHours(new Date("2026-11-03T14:00:00Z")).ok, true)  // 8:00 AM
  assert.equal(sendingHours(new Date("2026-11-04T02:59:00Z")).ok, true)  // 8:59 PM
  assert.equal(sendingHours(new Date("2026-11-04T03:00:00Z")).ok, false) // 9:00 PM
  assert.match(sendingHours(new Date("2026-11-04T03:30:00Z")).reason, /9:30 PM/)
})

test("tomorrow is Nashville's tomorrow, even late at night", () => {
  // 10:30 PM Nov 3 in Nashville is already Nov 4 in UTC.
  assert.equal(nashvilleDate(new Date("2026-11-04T04:30:00Z")), "2026-11-03")
  assert.equal(nashvilleDate(new Date("2026-11-04T04:30:00Z"), 1), "2026-11-04")
})

test("the day sorts by start time, not as text", () => {
  assert.ok(startMinutes("9:00 AM") < startMinutes("10:00 AM"))
  assert.ok(startMinutes("12:30 PM") < startMinutes("1:00 PM"))
})

test("consent: none blocks, STOP after consent blocks, consent after STOP allows", () => {
  assert.equal(consentState(null, null).allowed, false)
  const consent = { given_at: "2026-11-01T10:00:00Z" }
  assert.equal(consentState(consent, null).allowed, true)
  assert.equal(consentState(consent, { opted_out_at: "2026-11-02T10:00:00Z" }).allowed, false)
  assert.equal(consentState({ given_at: "2026-11-03T10:00:00Z" }, { opted_out_at: "2026-11-02T10:00:00Z" }).allowed, true)
})

test("Twilio signatures match Twilio's own library, and tampering fails", () => {
  const url = "https://www.primetvnashville.com/api/sms/status"
  const params = { MessageSid: "SM123", MessageStatus: "delivered", To: "+16155550142", AccountSid: "AC1", ErrorCode: "", ApiVersion: "2010-04-01" }
  // Value from twilio.getExpectedTwilioSignature with the same inputs.
  assert.equal(twilioSignature("test_token_123", url, params), "6tnQvy7zTuZk4sJbsKEbJfUvkYE=")
  assert.equal(validTwilioSignature("test_token_123", "6tnQvy7zTuZk4sJbsKEbJfUvkYE=", url, params), true)
  assert.equal(validTwilioSignature("test_token_123", "6tnQvy7zTuZk4sJbsKEbJfUvkYE=", url, { ...params, MessageStatus: "failed" }), false)
  assert.equal(validTwilioSignature("", "x", url, params), false)
})

test("without SMS_MODE nothing is sent: dry-run is the default", async () => {
  const before = process.env.SMS_MODE
  delete process.env.SMS_MODE
  assert.equal(smsMode(), "dry-run")
  const r = await sendSms({ to: "+16155550142", body: "PrimeTV: test. Reply STOP to opt out." })
  assert.deepEqual(r, { mode: "dry-run", sid: null, status: "dry-run", errorCode: null, errorMessage: null })
  if (before !== undefined) process.env.SMS_MODE = before
})

test("a delivered status is not overwritten by a late 'sent'", () => {
  assert.ok(statusRank("delivered") > statusRank("sent"))
  assert.ok(statusRank("sent") > statusRank("queued"))
})

test("the consent checkbox says what, who, how often, cost and how to stop", () => {
  for (const must of ["reminders", "review", "PrimeTV", "(615) 669-0251", "frequency varies", "Msg & data rates may apply", "STOP", "HELP", "not a condition"]) {
    assert.ok(SMS_CONSENT_TEXT.includes(must), must)
  }
})
