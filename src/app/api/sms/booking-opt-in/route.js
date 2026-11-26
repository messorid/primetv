import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { CONSENT_COOKIE, CONSENT_ENDPOINT, matchesSmsInvite, parseSmsInvite } from "../../../lib/bookingSmsConsent.js"
import { BOOKING_EMAIL_CONSENT_TEXT, BOOKING_EMAIL_CONSENT_VERSION } from "../../../lib/smsConfig.js"
import { ensureSmsTables, smsStatusFor } from "../../../lib/sms.js"
import { toE164 } from "../../../lib/smsRules.js"

export const runtime = "nodejs"

const headers = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" }
const cookieOptions = { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: CONSENT_ENDPOINT }
const json = (data, status) => NextResponse.json(data, { status, headers })

export function GET(request) {
  const token = request.nextUrl.searchParams.get("invite")
  const invite = parseSmsInvite(token)
  const response = new NextResponse(null, {
    status: 303,
    headers: { ...headers, Location: invite ? "/sms-opt-in" : "/sms-opt-in?expired=1" },
  })
  response.cookies.set(CONSENT_COOKIE, invite ? token : "", {
    ...cookieOptions, maxAge: invite ? 60 * 60 : 0,
  })
  return response
}

export async function POST(request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "Invalid request." }, 415)
  }
  let input
  try { input = await request.json() } catch { return json({ error: "Invalid request." }, 400) }
  if (input?.consent !== true || input.version !== BOOKING_EMAIL_CONSENT_VERSION) {
    return json({ error: "Confirm the SMS checkbox using the latest version of this page." }, 400)
  }
  const phone = toE164(input.phone)
  if (!phone) return json({ error: "Enter your 10-digit US mobile number." }, 400)
  const invite = parseSmsInvite(request.cookies.get(CONSENT_COOKIE)?.value)
  const invalid = { error: "This link has expired or the booking details changed. Ask PrimeTV to resend your confirmation." }
  if (!invite) return json(invalid, 410)

  try {
    const sql = neon(process.env.DATABASE_URL)
    const [booking] = await sql`SELECT phone, email, status FROM bookings WHERE id = ${invite.bookingId}`
    if (!booking || !matchesSmsInvite(invite, booking)) return json(invalid, 410)
    if (phone !== toE164(booking.phone)) {
      return json({ error: "Enter the mobile number you gave us for this booking." }, 400)
    }

    await ensureSmsTables(sql)
    if ((await smsStatusFor(sql, [phone])).get(phone)?.allowed) {
      const response = json({ ok: true }, 200)
      response.cookies.set(CONSENT_COOKIE, "", { ...cookieOptions, maxAge: 0 })
      return response
    }
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 100) || null
    const userAgent = request.headers.get("user-agent")?.slice(0, 300) || null
    const [saved] = await sql`
      INSERT INTO sms_consents
        (id, phone, method, consent_text, consent_version, given_at, recorded_by, booking_id, ip, user_agent)
      SELECT ${invite.consentId}, ${phone}, 'booking_email', ${BOOKING_EMAIL_CONSENT_TEXT}, ${BOOKING_EMAIL_CONSENT_VERSION},
        NOW(), 'website', id, ${ip}, ${userAgent}
      FROM bookings
      WHERE id = ${invite.bookingId} AND phone = ${booking.phone} AND email = ${booking.email}
        AND status IS DISTINCT FROM 'cancelled'
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `
    if (!saved) {
      const [previous] = await sql`SELECT id FROM sms_consents WHERE id = ${invite.consentId}`
      if (!previous) return json(invalid, 410)
    }

    const [optout] = await sql`SELECT 1 FROM sms_optouts WHERE phone = ${phone}`
    const response = json({ ok: true, optedOut: Boolean(optout) }, 200)
    response.cookies.set(CONSENT_COOKIE, "", { ...cookieOptions, maxAge: 0 })
    return response
  } catch (error) {
    console.error("Booking SMS consent failed", error)
    return json({ error: "We could not save your choice. Please try again." }, 500)
  }
}
