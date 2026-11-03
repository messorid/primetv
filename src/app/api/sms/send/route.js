export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST /api/sms/send { bookingId, kind, body, sentBy, resend }
//
// Sends ONE text, because a person pressed "Send" after reading it. Every
// rule is checked again here, whatever the screen showed: a name for who is
// sending, consent on record and no STOP, 8 AM–9 PM in Nashville, the
// required "PrimeTV:" start and STOP ending, and a second confirmation before
// repeating a text that already went out.

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { ensureSmsTables, smsStatusFor, sendSms, recordOptout, UNSUBSCRIBED } from "@/app/lib/sms.js"
import { toE164, finalizeBody, sendingHours, MAX_SMS_CHARS } from "@/app/lib/smsRules.js"

const KINDS = ["reminder"]
const bad = (error, status = 400, extra = {}) => Response.json({ ok: false, error, ...extra }, { status })

export async function POST(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  let input
  try { input = await request.json() } catch { return bad("Bad request") }
  const { bookingId, kind = "reminder", resend = false } = input || {}
  const sentBy = String(input?.sentBy || "").trim().slice(0, 60)

  if (!KINDS.includes(kind)) return bad("Unknown message type")
  if (!bookingId) return bad("bookingId required")
  if (!sentBy) return bad("Enter your name first, so the log shows who sent it.")

  const hours = sendingHours()
  if (!hours.ok) return bad(hours.reason, 409, { code: "quiet_hours" })

  const body = finalizeBody(input?.body)
  if (body.length > MAX_SMS_CHARS) return bad(`The message is too long (${body.length} of ${MAX_SMS_CHARS} characters).`)

  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureSmsTables(sql)
    const [b] = await sql`SELECT id, phone, status FROM bookings WHERE id = ${bookingId}`
    if (!b) return bad("Booking not found", 404)
    if (b.status === "cancelled") return bad("This booking is cancelled.", 409)
    const to = toE164(b.phone)
    if (!to) return bad("This booking has no valid US mobile number.", 409)

    const st = (await smsStatusFor(sql, [to])).get(to)
    if (!st.allowed) return bad(st.reason, 409, { code: "no_consent" })

    // Already sent (or logged in dry-run)? Only again on purpose.
    const [prev] = await sql`
      SELECT created_at, sent_by, status FROM sms_messages
      WHERE booking_id = ${bookingId} AND kind = ${kind} AND status NOT IN ('failed', 'undelivered')
      ORDER BY created_at DESC LIMIT 1
    `
    if (prev && !resend) {
      return bad("A reminder was already sent for this booking.", 409, {
        code: "already_sent", previous: { at: prev.created_at, by: prev.sent_by, status: prev.status },
      })
    }

    const result = await sendSms({ to, body })
    const [row] = await sql`
      INSERT INTO sms_messages (booking_id, kind, to_phone, body, sent_by, mode, twilio_sid, status, error_code, error_message, status_at)
      VALUES (${bookingId}, ${kind}, ${to}, ${body}, ${sentBy}, ${result.mode}, ${result.sid}, ${result.status},
              ${result.errorCode}, ${result.errorMessage}, NOW())
      RETURNING created_at, sent_by, mode, status, error_code, error_message, body
    `
    if (result.errorCode === UNSUBSCRIBED) {
      await recordOptout(sql, { phone: to, source: "twilio_21610", recordedBy: sentBy })
      return bad("Twilio refused: this customer replied STOP. They're now marked as opted out.", 409, { code: "opted_out" })
    }
    if (result.status === "failed") return bad(`Not sent: ${result.errorMessage || "Twilio error"}`, 502, { message: row })
    return Response.json({ ok: true, message: { at: row.created_at, by: row.sent_by, mode: row.mode, status: row.status, body: row.body } })
  } catch (err) {
    console.error("sms send error", err)
    return bad("Something went wrong. Nothing was sent.", 500)
  }
}
