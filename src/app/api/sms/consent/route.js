export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST /api/sms/consent
//   { bookingId, action: "text_yes", givenAt, note, recordedBy }
//       The customer replied YES by text when asked. Recorded with when they
//       said it, who recorded it, and a note of what they wrote.
//   { bookingId, action: "optout", note, recordedBy }
//       The customer asked to stop (told us, or Twilio told us). Blocks every
//       text to that number until they consent again.

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { ensureSmsTables, recordConsent, recordOptout } from "@/app/lib/sms.js"
import { toE164 } from "@/app/lib/smsRules.js"
import { CONSENT_METHODS } from "@/app/lib/smsConfig.js"

const bad = (error, status = 400) => Response.json({ ok: false, error }, { status })

export async function POST(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  let input
  try { input = await request.json() } catch { return bad("Bad request") }
  const { bookingId, action } = input || {}
  const recordedBy = String(input?.recordedBy || "").trim().slice(0, 60)
  const note = String(input?.note || "").trim().slice(0, 500)
  if (!bookingId) return bad("bookingId required")
  if (!recordedBy) return bad("Enter your name first, so the record shows who added it.")

  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureSmsTables(sql)
    const [b] = await sql`SELECT phone FROM bookings WHERE id = ${bookingId}`
    if (!b) return bad("Booking not found", 404)
    const phone = toE164(b.phone)
    if (!phone) return bad("This booking has no valid US mobile number.")

    if (action === "text_yes") {
      const givenAt = new Date(input?.givenAt)
      if (isNaN(givenAt) || givenAt > new Date(Date.now() + 5 * 60_000)) return bad("Enter when the customer replied YES.")
      if (!note) return bad("Add what the customer wrote, e.g. “Yes, please text me”.")
      await recordConsent(sql, {
        phone, method: "text_yes", consentText: CONSENT_METHODS.text_yes, givenAt: givenAt.toISOString(),
        recordedBy, bookingId, note,
      })
      return Response.json({ ok: true })
    }
    if (action === "optout") {
      await recordOptout(sql, { phone, source: "manual", recordedBy, note })
      return Response.json({ ok: true })
    }
    return bad("Unknown action")
  } catch (err) {
    console.error("sms consent error", err)
    return bad("Could not save. Please try again.", 500)
  }
}
