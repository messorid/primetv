export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST /api/sms/status — Twilio's delivery report for a text we sent
// (StatusCallback). Public, so every request must carry a valid Twilio
// signature for this exact URL. Incoming texts are NOT handled here: the
// number's inbound webhook belongs to the CRM.

import { neon } from "@neondatabase/serverless"
import {
  ensureSmsTables, validTwilioSignature, statusCallbackUrl, statusRank, recordOptout, UNSUBSCRIBED,
} from "@/app/lib/sms.js"

export async function POST(request) {
  const raw = await request.text()
  const params = Object.fromEntries(new URLSearchParams(raw))
  if (!validTwilioSignature(process.env.TWILIO_AUTH_TOKEN, request.headers.get("x-twilio-signature"), statusCallbackUrl(), params)) {
    return new Response("Forbidden", { status: 403 })
  }
  const sid = params.MessageSid || params.SmsSid
  const status = params.MessageStatus || params.SmsStatus
  if (!sid || !status) return new Response("", { status: 204 })

  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureSmsTables(sql)
    const [row] = await sql`SELECT id, status, to_phone FROM sms_messages WHERE twilio_sid = ${sid}`
    if (row && statusRank(status) >= statusRank(row.status)) {
      const code = params.ErrorCode ? Number(params.ErrorCode) : null
      await sql`
        UPDATE sms_messages SET status = ${status}, error_code = ${code}, status_at = NOW()
        WHERE id = ${row.id}
      `
      if (code === UNSUBSCRIBED) await recordOptout(sql, { phone: row.to_phone, source: "twilio_21610" })
    }
  } catch (err) {
    console.error("sms status callback error", err)
    return new Response("Error", { status: 500 }) // Twilio retries
  }
  return new Response("", { status: 204 })
}
