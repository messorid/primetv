// ─────────────────────────────────────────────────────────────────────────────
// SMS SETTINGS — everything that names the business or fixes the wording of a
// text, in one place. When the LLC and the Standard A2P brand arrive, this is
// the file that changes.
//
// No imports, so both the admin screens (browser) and the API routes use it.
// ─────────────────────────────────────────────────────────────────────────────

// How every message starts: the brand the customer sees first.
export const SMS_BRAND = "PrimeTV"
export const SMS_PREFIX = `${SMS_BRAND}:`
export const SMS_SUFFIX = "Reply STOP to opt out."

// The number to CALL for help. Texts come from a separate Twilio number, which
// is deliberately not named in the consent or the terms: consent is given to
// the business, so the sending number can change without asking anyone again.
export const SMS_PHONE_DISPLAY = "(615) 669-0251"
export const SMS_TERMS_PATH = "/sms-terms"

// Sending is allowed from 8:00 AM until 9:00 PM, Nashville time.
export const SMS_TZ = "America/Chicago"
export const SMS_HOUR_FROM = 8
export const SMS_HOUR_TO = 21

// The window promised in a reminder: the booked start time plus this.
export const ARRIVAL_WINDOW_MIN = 30

// The checkbox on the booking form. The exact text, and its version, are
// stored with every consent, so a later change to the wording never rewrites
// what an earlier customer agreed to. Change the version whenever the text
// changes.
export const SMS_CONSENT_VERSION = "2026-11-03.2"
export const SMS_CONSENT_TEXT =
  `Yes, ${SMS_BRAND} may text me appointment reminders and, after my job, a request for a review. ` +
  `Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. ` +
  `Consent is not a condition of booking.`

// How consent was given, as stored. The registered campaign has one way in: the
// box on the booking form.
export const CONSENT_METHODS = {
  booking_form: "Checked the SMS box when booking on the website",
}
