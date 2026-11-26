export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST /api/sms/consent { bookingId, action: "optout", note, recordedBy }
//   The customer asked to stop some other way (by phone, in person). Blocks every
//   text to that number. Opt-ins are recorded through the booking flows.

import { neon } from "@neondatabase/serverless"
import { isStaffRequest, unauthorized } from "@/lib/adminSession"
import { ensureSmsTables, recordOptout } from "@/app/lib/sms.js"
import { toE164 } from "@/app/lib/smsRules.js"

const bad = (error, status = 400) => Response.json({ ok: false, error }, { status })

export async function POST(request) {
  if (!(await isStaffRequest(request))) return unauthorized()
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
