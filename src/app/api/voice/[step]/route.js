export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Twilio's voice webhooks for the PrimeTV number (see src/app/lib/voice.js).
// Public, so every request must carry a valid Twilio signature for its exact
// URL, query string included.
//
//   POST /api/voice/inbound              a call comes in → forward it
//   POST /api/voice/dial-status?id=…     the forwarded or bridged leg ended
//   POST /api/voice/bridge?id=…          our phone answered an outgoing call
//   POST /api/voice/connect?id=…         they pressed a key → dial the customer
//   POST /api/voice/agent-status?id=…    our phone's leg of an outgoing call ended

import { after } from "next/server"
import { neon } from "@neondatabase/serverless"
import { validTwilioSignature } from "@/app/lib/sms.js"
import { toE164, displayPhone } from "@/app/lib/smsRules.js"
import {
  ensureCallTables, siteUrl, voiceUrl, ourNumber, forwardNumber, bookingForPhone, callStatusFromDial,
  RING_SECONDS, MISSED_MESSAGE, xml, say, twiml,
} from "@/app/lib/voice.js"
import { getTransport, mailFrom, notifyTo, canSendMail } from "@/app/lib/mailer.js"
import { emailDocument, heading, para, buttons, esc } from "@/app/lib/emailLayout.js"

const missed = () => twiml(say(MISSED_MESSAGE) + "<Hangup/>")

const STEPS = {
  async inbound(sql, p) {
    const sid = p.CallSid
    const from = toE164(p.From) || String(p.From || "")
    if (!sid || !from) return twiml("<Hangup/>")
    const [dup] = await sql`SELECT id FROM calls WHERE call_sid = ${sid}`
    let id = dup?.id
    if (!id) {
      const b = await bookingForPhone(sql, from)
      const [row] = await sql`
        INSERT INTO calls (direction, customer_phone, booking_id, call_sid, status)
        VALUES ('in', ${from}, ${b?.id || null}, ${sid}, 'ringing') RETURNING id
      `
      id = row.id
    }
    const fwd = forwardNumber()
    // Nowhere to ring, or the forwarding phone calling its own line.
    if (!fwd || from === fwd) {
      await sql`UPDATE calls SET status = 'missed', ended_at = NOW() WHERE id = ${id}`
      return missed()
    }
    return twiml(
      `<Dial timeout="${RING_SECONDS}" action="${xml(voiceUrl("dial-status", { id }))}" method="POST">` +
      `<Number>${xml(fwd)}</Number></Dial>`
    )
  },

  async "dial-status"(sql, p, id) {
    const [c] = id ? await sql`SELECT * FROM calls WHERE id = ${id}` : []
    if (!c) return twiml("<Hangup/>")
    const status = callStatusFromDial(p.DialCallStatus, c.direction)
    const duration = Number(p.DialCallDuration) || 0
    await sql`UPDATE calls SET status = ${status}, duration = ${duration}, ended_at = NOW() WHERE id = ${id}`
    if (c.direction === "in" && status === "missed") {
      after(() => emailMissed(sql, c).catch(err => console.error("missed call email failed", err)))
      return missed()
    }
    return twiml("<Hangup/>")
  },

  async bridge(sql, p, id) {
    return twiml(
      `<Gather numDigits="1" timeout="8" action="${xml(voiceUrl("connect", { id }))}" method="POST">` +
      say("PrimeTV call. Press 1 to connect to the customer.") +
      `</Gather>` + say("Not connected. Goodbye.") + "<Hangup/>"
    )
  },

  async connect(sql, p, id) {
    const [c] = id ? await sql`SELECT * FROM calls WHERE id = ${id}` : []
    if (!c) return twiml("<Hangup/>")
    if (p.Digits !== "1") {
      await sql`UPDATE calls SET status = 'not-connected', ended_at = NOW() WHERE id = ${id}`
      return twiml(say("Not connected. Goodbye.") + "<Hangup/>")
    }
    await sql`UPDATE calls SET status = 'connecting' WHERE id = ${id}`
    return twiml(
      say("Connecting.") +
      `<Dial callerId="${xml(ourNumber())}" timeout="30" action="${xml(voiceUrl("dial-status", { id }))}" method="POST">` +
      `<Number>${xml(c.customer_phone)}</Number></Dial>`
    )
  },

  async "agent-status"(sql, p, id) {
    // Our phone hung up or never answered before the customer was dialed.
    if (id) await sql`UPDATE calls SET status = 'not-connected', ended_at = NOW() WHERE id = ${id} AND status = 'calling'`
    return new Response("", { status: 204 })
  },
}

export async function POST(request, { params }) {
  const { step } = await params
  const handler = Object.hasOwn(STEPS, step) ? STEPS[step] : null
  if (!handler) return new Response("Not found", { status: 404 })

  const raw = await request.text()
  const p = Object.fromEntries(new URLSearchParams(raw))
  const u = new URL(request.url)
  if (!validTwilioSignature(process.env.TWILIO_AUTH_TOKEN, request.headers.get("x-twilio-signature"), siteUrl() + u.pathname + u.search, p)) {
    return new Response("Forbidden", { status: 403 })
  }
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureCallTables(sql)
    return await handler(sql, p, u.searchParams.get("id"))
  } catch (err) {
    console.error(`voice ${step} error`, err)
    // A caller still hears something instead of a Twilio error.
    return step === "inbound" || step === "dial-status" ? missed() : twiml("<Hangup/>")
  }
}

async function emailMissed(sql, c) {
  if (!canSendMail()) return
  const [b] = c.booking_id ? await sql`SELECT first_name, last_name FROM bookings WHERE id = ${c.booking_id}` : []
  const name = b ? `${b.first_name || ""} ${b.last_name || ""}`.trim() : ""
  const who = name ? `${name} (${displayPhone(c.customer_phone)})` : displayPhone(c.customer_phone)
  const link = `${siteUrl()}/admin/messages?phone=${encodeURIComponent(c.customer_phone)}`
  await getTransport().sendMail({
    from: mailFrom("PrimeTV Calls"),
    to: notifyTo(),
    subject: `Missed call from ${who}`.replace(/[\r\n]+/g, " "),
    html: emailDocument({
      title: `Missed call from ${who}`,
      body: heading(`Missed call from ${esc(who)}`) +
        para("Nobody answered, and they heard that we'll call back shortly.") +
        buttons([{ href: link, label: "Open the conversation" }]),
    }),
  })
}
