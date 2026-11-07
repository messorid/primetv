export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST /api/sms/inbound — Twilio's webhook for a text a customer sends to our
// number ("A message comes in" on the number). Public, so every request must
// carry a valid Twilio signature for this exact URL.
//
// It only records: the text goes into the Messages screen and the office gets
// an email. It never replies. Twilio's Advanced Opt-Out answers STOP, START and
// HELP by itself; here STOP and START are recorded so the app agrees with it.

import { after } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureSmsTables, validTwilioSignature, inboundUrl, recordOptout, liftOptout } from "@/app/lib/sms.js"
import { toE164, displayPhone, inboundKeyword } from "@/app/lib/smsRules.js"
import { getTransport, mailFrom, notifyTo, canSendMail } from "@/app/lib/mailer.js"
import { emailDocument, heading, para, buttons, esc, escLines, BRAND } from "@/app/lib/emailLayout.js"

const EMPTY_TWIML = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`
const twiml = () => new Response(EMPTY_TWIML, { status: 200, headers: { "Content-Type": "text/xml" } })

export async function POST(request) {
  const raw = await request.text()
  const params = Object.fromEntries(new URLSearchParams(raw))
  if (!validTwilioSignature(process.env.TWILIO_AUTH_TOKEN, request.headers.get("x-twilio-signature"), inboundUrl(), params)) {
    return new Response("Forbidden", { status: 403 })
  }
  const sid = params.MessageSid || params.SmsSid
  const from = toE164(params.From) || String(params.From || "")
  const body = String(params.Body || "")
  if (!sid || !from) return twiml()

  const media = []
  for (let i = 0; i < Math.min(Number(params.NumMedia) || 0, 10); i++) {
    if (params[`MediaUrl${i}`]) media.push({ url: params[`MediaUrl${i}`], type: params[`MediaContentType${i}`] || "" })
  }

  let name = "", keyword = null
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureSmsTables(sql)
    // Twilio can deliver the same webhook twice; record it once.
    const [dup] = await sql`SELECT id FROM sms_messages WHERE twilio_sid = ${sid}`
    if (dup) return twiml()

    const last10 = from.replace(/\D/g, "").slice(-10)
    const [b] = await sql`
      SELECT id, first_name, last_name FROM bookings
      WHERE right(regexp_replace(COALESCE(phone, ''), '[^0-9]', '', 'g'), 10) = ${last10}
      ORDER BY created_at DESC LIMIT 1
    `
    name = b ? `${b.first_name || ""} ${b.last_name || ""}`.trim() : ""
    await sql`
      INSERT INTO sms_messages (booking_id, kind, direction, to_phone, from_phone, body, mode, twilio_sid, status, media, status_at)
      VALUES (${b?.id || null}, 'inbound', 'in', ${String(params.To || "")}, ${from}, ${body}, 'live', ${sid}, 'received',
              ${media.length ? JSON.stringify(media) : null}, NOW())
    `
    keyword = inboundKeyword(body, params.OptOutType)
    if (keyword === "stop") await recordOptout(sql, { phone: from, source: "text_stop", note: body.slice(0, 100) })
    if (keyword === "start") await liftOptout(sql, from)
  } catch (err) {
    console.error("sms inbound error", err)
    return new Response("Error", { status: 500 })
  }

  // The email goes after the answer to Twilio, so a slow mail server can't
  // make Twilio give up on the webhook.
  after(() => notifyOffice({ from, name, body, media, keyword }).catch(err => console.error("sms inbound email failed", err)))
  return twiml()
}

async function notifyOffice({ from, name, body, media, keyword }) {
  if (!canSendMail()) return
  const who = name ? `${name} (${displayPhone(from)})` : displayPhone(from)
  const what = keyword === "stop" ? "Opted out (STOP)" : keyword === "start" ? "Opted back in (START)" : "New text"
  const link = `${process.env.SITE_URL || BRAND.site}/admin/messages?phone=${encodeURIComponent(from)}`
  const html = emailDocument({
    title: `${what} from ${who}`,
    preheader: body.slice(0, 90),
    body: [
      heading(`${what} from ${esc(who)}`),
      para(body ? escLines(body) : "<em>(no text)</em>"),
      media.length ? para(`${media.length} attachment${media.length > 1 ? "s" : ""} — open the conversation to see ${media.length > 1 ? "them" : "it"}.`, { muted: true }) : "",
      keyword === "stop" ? para("Twilio already confirmed it to them. No more texts can go to this number.", { muted: true }) : "",
      buttons([{ href: link, label: "Open the conversation" }]),
    ].join(""),
  })
  await getTransport().sendMail({
    from: mailFrom("PrimeTV Texts"),
    to: notifyTo(),
    subject: `${what} from ${who}`.replace(/[\r\n]+/g, " "),
    html,
  })
}
