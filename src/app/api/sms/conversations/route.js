export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET  /api/sms/conversations              every conversation, newest first
// GET  /api/sms/conversations?phone=+1…    one conversation, oldest first, with
//                                          what's needed to reply or call
//   &tests=1 includes texts logged in test mode (dry-run). Outside live mode
//   they are always included, or what you just "sent" would vanish.
// POST /api/sms/conversations { phone }    marks its incoming texts and missed
//                                          calls as read
//
// A conversation is everything with one number: texts both ways and calls.

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { ensureSmsTables, smsStatusFor, smsMode, recentOptOutNotice } from "@/app/lib/sms.js"
import { toE164, sendingHours, customerPhoneOf, REPLY_NOTICE_DAYS } from "@/app/lib/smsRules.js"
import { ensureCallTables, forwardNumber } from "@/app/lib/voice.js"

const shape = m => ({
  id: m.id, type: "sms", direction: m.direction, kind: m.kind, body: m.body, at: m.created_at, by: m.sent_by,
  mode: m.mode, status: m.status, errorMessage: m.error_message, media: m.media || [], readAt: m.read_at,
})
const callShape = c => ({
  id: c.id, type: "call", direction: c.direction, status: c.status, duration: c.duration, by: c.placed_by,
  at: c.created_at, readAt: c.read_at,
})
const isUnread = item => !item.readAt && item.direction === "in" && (item.type === "sms" || item.status === "missed")

// The latest booking for each number, for names and links.
async function bookingsByPhone(sql) {
  const rows = await sql`SELECT id, first_name, last_name, phone, date, status, created_at FROM bookings ORDER BY created_at DESC`
  const map = new Map()
  for (const r of rows) {
    const p = toE164(r.phone)
    if (p && !map.has(p)) map.set(p, { id: r.id, name: `${r.first_name || ""} ${r.last_name || ""}`.trim(), firstName: r.first_name || "", date: r.date, status: r.status })
  }
  return map
}

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  const q = new URL(request.url).searchParams
  const tests = q.get("tests") === "1" || smsMode() !== "live"
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureSmsTables(sql)
    await ensureCallTables(sql)
    const people = await bookingsByPhone(sql)

    if (q.get("phone")) {
      const phone = toE164(q.get("phone")) || q.get("phone")
      const rows = await sql`
        SELECT * FROM sms_messages
        WHERE ((direction = 'in' AND from_phone = ${phone}) OR (direction <> 'in' AND to_phone = ${phone}))
          AND (${tests}::boolean OR mode <> 'dry-run')
        ORDER BY created_at ASC
      `
      const calls = await sql`SELECT * FROM calls WHERE customer_phone = ${phone} ORDER BY created_at ASC`
      const st = (await smsStatusFor(sql, [phone])).get(phone)
      return Response.json({
        ok: true, mode: smsMode(), hours: sendingHours(), phone,
        // Whether a reply can go as typed (see /api/sms/send).
        noticeIsRecent: await recentOptOutNotice(sql, phone, REPLY_NOTICE_DAYS),
        canCall: !!forwardNumber() && !!toE164(phone),
        booking: people.get(phone) || null,
        consent: st ? { allowed: st.allowed, reason: st.reason } : { allowed: false, reason: "Not a valid US mobile number." },
        messages: rows.map(shape),
        calls: calls.map(callShape),
      })
    }

    const rows = await sql`
      SELECT id, direction, kind, body, created_at, sent_by, mode, status, error_message, media, read_at, to_phone, from_phone
      FROM sms_messages WHERE (${tests}::boolean OR mode <> 'dry-run')
      ORDER BY created_at DESC LIMIT 3000
    `
    const calls = await sql`
      SELECT id, direction, customer_phone, status, duration, placed_by, created_at, read_at
      FROM calls ORDER BY created_at DESC LIMIT 2000
    `
    const items = [
      ...rows.map(m => ({ phone: customerPhoneOf(m), item: shape(m) })),
      ...calls.map(c => ({ phone: c.customer_phone, item: callShape(c) })),
    ].sort((a, b) => new Date(b.item.at) - new Date(a.item.at))

    const convs = new Map()
    for (const { phone, item } of items) {
      if (!phone) continue
      let c = convs.get(phone)
      if (!c) {
        const p = people.get(phone)
        c = { phone, name: p?.name || "", bookingId: p?.id || null, last: item, unread: 0, count: 0 }
        convs.set(phone, c)
      }
      c.count++
      if (isUnread(item)) c.unread++
    }
    return Response.json({ ok: true, mode: smsMode(), conversations: [...convs.values()] })
  } catch (err) {
    console.error("sms conversations GET error", err)
    return Response.json({ ok: false, error: "Could not load the messages." }, { status: 500 })
  }
}

export async function POST(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  let input
  try { input = await request.json() } catch { return Response.json({ ok: false, error: "Bad request" }, { status: 400 }) }
  const phone = toE164(input?.phone) || String(input?.phone || "")
  if (!phone) return Response.json({ ok: false, error: "phone required" }, { status: 400 })
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureSmsTables(sql)
    await ensureCallTables(sql)
    await sql`UPDATE sms_messages SET read_at = NOW() WHERE direction = 'in' AND from_phone = ${phone} AND read_at IS NULL`
    await sql`UPDATE calls SET read_at = NOW() WHERE direction = 'in' AND customer_phone = ${phone} AND read_at IS NULL`
    return Response.json({ ok: true })
  } catch (err) {
    console.error("sms conversations POST error", err)
    return Response.json({ ok: false, error: "Could not save." }, { status: 500 })
  }
}
