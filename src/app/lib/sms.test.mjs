import { test } from "node:test"
import assert from "node:assert/strict"
import {
  toE164, arrivalWindow, buildReminder, buildReviewRequest, inboundKeyword, customerPhoneOf, finalizeBody, replyBody, plainBody, partsLimit, sendingHours, nashvilleDate, segments, startMinutes,
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

test("the reminder is one plain-SMS text", () => {
  const t = buildReminder({ firstName: "Mike Smith", date: "2026-11-05", timePref: "2:00 PM" })
  assert.equal(t, "PrimeTV: Hi Mike, we'll arrive tomorrow, Nov 5, between 2-2:30 PM for your TV mounting. Questions? Reply here. Reply STOP to opt out.")
  assert.equal(segments(t).encoding, "GSM-7")
  assert.equal(segments(t).parts, 1)
  assert.match(buildReminder({ firstName: "Ana", date: "2026-11-07", timePref: "10:30 AM", tomorrow: false }), /we'll arrive on Nov 7, between 10:30-11 AM/)
})

test("even the longest reminder and review fit in one text", () => {
  const url = "https://g.page/r/CblSDOdhtcueEBI/review"
  const long = buildReminder({ firstName: "Maximilianusss", date: "2026-11-25", timePref: "11:45 AM", service: "installation" })
  assert.equal(segments(long).parts, 1, long)
  assert.match(long, /Hi Maximilianusss,/)
  assert.equal(segments(buildReminder({ firstName: "Bartholomew-Alexander", date: "2026-11-25", timePref: "11:45 AM", service: "installation" })).parts, 1)
  assert.equal(segments(buildReviewRequest({ firstName: "Maximilianusss", reviewUrl: url })).parts, 1)
})

test("accents that would make a text Unicode are dropped from the name", () => {
  const t = buildReminder({ firstName: "Ramón", date: "2026-11-05", timePref: "2:00 PM" })
  assert.match(t, /Hi Ramon,/)
  assert.equal(segments(t).encoding, "GSM-7")
  assert.match(buildReminder({ firstName: "José", date: "2026-11-05", timePref: "2:00 PM" }), /Hi José,/) // é is plain SMS
})

test("curly quotes and long dashes become plain, keeping a text in GSM-7", () => {
  assert.equal(plainBody("We’ll be there — see you “soon”…"), `We'll be there - see you "soon"...`)
  assert.equal(segments(plainBody("We’ll be there")).encoding, "GSM-7")
})

test("each kind has its own text limit", () => {
  assert.equal(partsLimit("reminder"), 1)
  assert.equal(partsLimit("review"), 1)
  assert.equal(partsLimit("reply"), 2)
  assert.equal(segments("a".repeat(160)).parts, 1)
  assert.equal(segments("a".repeat(161)).parts, 2)
  assert.equal(segments("a".repeat(306)).parts, 2)
  assert.equal(segments("a".repeat(307)).parts, 3)
  assert.equal(segments("{" + "a".repeat(159)).parts, 2) // { counts double
})

test("the review request is one plain-SMS text with the link", () => {
  const url = "https://g.page/r/CblSDOdhtcueEBI/review"
  const t = buildReviewRequest({ firstName: "Mike Smith", reviewUrl: url })
  assert.equal(t, `PrimeTV: Hi Mike, thanks for choosing us! Would you leave us a quick Google review? ${url} Reply STOP to opt out.`)
  assert.equal(finalizeBody(t), t) // the link and the ending survive sending as they are
  assert.equal(segments(t).encoding, "GSM-7")
  assert.equal(segments(t).parts, 1)
  assert.match(buildReviewRequest({ firstName: "", reviewUrl: url }), /^PrimeTV: Hi, thanks/)
})

test("incoming STOP, START and HELP are recognized; other texts are not", () => {
  assert.equal(inboundKeyword("Stop", ""), "stop")
  assert.equal(inboundKeyword("  unsubscribe. ", undefined), "stop")
  assert.equal(inboundKeyword("START", ""), "start")
  assert.equal(inboundKeyword("help!", ""), "help")
  assert.equal(inboundKeyword("anything", "STOP"), "stop") // Twilio's own reading wins
  for (const t of ["Yes", "stop by at 3?", "Can you stop by tomorrow", "", null]) assert.equal(inboundKeyword(t, ""), null, String(t))
})

test("a conversation is keyed by the customer's number either way", () => {
  assert.equal(customerPhoneOf({ direction: "in", from_phone: "+16155550142", to_phone: "+16153956565" }), "+16155550142")
  assert.equal(customerPhoneOf({ direction: "out", to_phone: "+16155550142" }), "+16155550142")
})

test("a reply goes as typed only after a recent STOP notice", () => {
  assert.equal(replyBody("  See you   at 3 ", true), "See you at 3")
  assert.equal(replyBody("See you at 3", false), `${SMS_PREFIX} See you at 3. ${SMS_SUFFIX}`)
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
  for (const must of ["reminders", "review", "PrimeTV", "frequency varies", "Msg & data rates may apply", "STOP", "HELP", "not a condition"]) {
    assert.ok(SMS_CONSENT_TEXT.includes(must), must)
  }
})

test("a finished call is logged as answered or missed, never as answered by mistake", async () => {
  const { callStatusFromDial, xml } = await import("./voice.js")
  assert.equal(callStatusFromDial("completed", "in"), "answered")
  assert.equal(callStatusFromDial("answered", "out"), "answered")
  for (const s of ["no-answer", "busy", "failed", "canceled", ""]) assert.equal(callStatusFromDial(s, "in"), "missed", s)
  assert.equal(callStatusFromDial("no-answer", "out"), "no-answer")
  assert.equal(callStatusFromDial("canceled", "out"), "not-connected")
  assert.equal(xml(`a<b & "c"`), "a&lt;b &amp; &quot;c&quot;")
})
