export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST /api/voice/call { phone, bookingId, placedBy } — someone pressed "Call"
// in the admin. Twilio rings our forwarding phone; when they answer and press
// 1, it dials the customer from the PrimeTV number (see src/app/lib/voice.js).

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { toE164 } from "@/app/lib/smsRules.js"
import { ensureCallTables, forwardNumber, ringAgent } from "@/app/lib/voice.js"

const bad = (error, status = 400) => Response.json({ ok: false, error }, { status })

export async function POST(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  let input
  try { input = await request.json() } catch { return bad("Bad request") }
  const to = toE164(input?.phone)
  const placedBy = String(input?.placedBy || "").trim().slice(0, 60)
  if (!to) return bad("A valid US phone number is required.")
  if (!placedBy) return bad("Enter your name first, so the log shows who called.")
  if (!forwardNumber()) return bad("No phone to ring: set CALL_FORWARD_TO in Vercel.", 409)
  if (to === forwardNumber()) return bad("That's the phone that would ring for this call.", 409)

  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureCallTables(sql)
    const [row] = await sql`
      INSERT INTO calls (direction, customer_phone, booking_id, status, placed_by)
      VALUES ('out', ${to}, ${input?.bookingId || null}, 'calling', ${placedBy}) RETURNING id
    `
    const r = await ringAgent({ id: row.id })
    if (!r.ok) {
      await sql`UPDATE calls SET status = 'failed', ended_at = NOW() WHERE id = ${row.id}`
      return bad(r.error, 502)
    }
    await sql`UPDATE calls SET call_sid = ${r.sid} WHERE id = ${row.id}`
    return Response.json({ ok: true, id: row.id })
  } catch (err) {
    console.error("voice call error", err)
    return bad("Something went wrong. No call was placed.", 500)
  }
}
