export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/sms/review?bookingId=… — what the "ask for a review by text" dialog
// needs for one booking: the draft, the phone, earlier review texts, and the
// reasons it can't be sent. Sending goes through /api/sms/send with kind "review".

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { ensureSmsTables, smsStatusFor, smsMode } from "@/app/lib/sms.js"
import { toE164, buildReviewRequest, serviceLabel, sendingHours } from "@/app/lib/smsRules.js"
import { GOOGLE_REVIEW_URL } from "@/app/lib/closeoutEmails.js"

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  const bookingId = new URL(request.url).searchParams.get("bookingId")
  if (!bookingId) return Response.json({ ok: false, error: "bookingId required" }, { status: 400 })
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureSmsTables(sql)
    const [b] = await sql`
      SELECT id, first_name, phone, status, booking_mode, review_requested_at
      FROM bookings WHERE id = ${bookingId}
    `
    if (!b) return Response.json({ ok: false, error: "Booking not found" }, { status: 404 })

    const phone = toE164(b.phone)
    const st = phone ? (await smsStatusFor(sql, [phone])).get(phone) : null
    const blockers = []
    if (b.status !== "completed") blockers.push("The job has to be marked completed first.")
    if (!phone) blockers.push("No valid US mobile number on this booking.")
    else if (!st.allowed) blockers.push(st.reason)

    const [last] = await sql`
      SELECT created_at, sent_by, mode, status, error_message
      FROM sms_messages WHERE booking_id = ${bookingId} AND kind = 'review'
      ORDER BY created_at DESC LIMIT 1
    `
    return Response.json({
      ok: true,
      mode: smsMode(),
      hours: sendingHours(),
      phone,
      draft: buildReviewRequest({ firstName: b.first_name, service: serviceLabel(b), reviewUrl: GOOGLE_REVIEW_URL }),
      reviewUrl: GOOGLE_REVIEW_URL,
      reviewRequestedAt: b.review_requested_at ?? null,
      last: last ? { at: last.created_at, by: last.sent_by, mode: last.mode, status: last.status, errorMessage: last.error_message } : null,
      blockers,
    })
  } catch (err) {
    console.error("sms review GET error", err)
    return Response.json({ ok: false, error: "Could not load this booking." }, { status: 500 })
  }
}
