export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Admin view of a booking's job closeout.
//   GET  ?bookingId=…                         — link and status (creates the link)
//   POST { bookingId, action: "sendToCrew" }  — email the link to everyone on the job
//   POST { bookingId, action: "reopen" }      — clear the signature so it can be signed again

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { closeoutTokenFor, loadCloseout, publicView, crewFor, closeoutUrl } from "@/app/lib/closeout.js"
import { buildCloseoutLinkEmail } from "@/app/lib/closeoutEmails.js"
import { getTransport, mailFrom, canSendMail } from "@/app/lib/mailer.js"

async function load(sql, bookingId) {
  const token = await closeoutTokenFor(sql, bookingId)
  const data = token && await loadCloseout(sql, token)
  if (!data) return null
  const crew = await crewFor(sql, data.booking)
  return { token, data, crew }
}

function payload({ token, data, crew }) {
  const view = publicView(data, crew.map(m => m.installerName).filter(Boolean))
  return { ok: true, url: closeoutUrl(token), path: `/job/${token}`, view }
}

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const bookingId = new URL(request.url).searchParams.get("bookingId")
    if (!bookingId) return Response.json({ ok: false, error: "bookingId required" }, { status: 400 })
    const found = await load(neon(process.env.DATABASE_URL), bookingId)
    if (!found) return Response.json({ ok: false, error: "Booking not found" }, { status: 404 })
    return Response.json(payload(found))
  } catch (err) {
    console.error("closeout GET error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const { bookingId, action } = await request.json()
    if (!bookingId) return Response.json({ ok: false, error: "bookingId required" }, { status: 400 })
    const sql = neon(process.env.DATABASE_URL)
    const found = await load(sql, bookingId)
    if (!found) return Response.json({ ok: false, error: "Booking not found" }, { status: 404 })

    if (action === "sendToCrew") {
      const people = found.crew.filter(m => m.installerEmail)
      if (!people.length) {
        return Response.json({ ok: false, error: "Assign an installer with an email address first." }, { status: 400 })
      }
      if (!canSendMail()) return Response.json({ ok: false, error: "Email is not configured on the server" }, { status: 500 })
      const transporter = getTransport()
      const url = closeoutUrl(found.token)
      const sentTo = []
      const failed = []
      for (const m of people) {
        try {
          const mail = buildCloseoutLinkEmail({ b: found.data.booking, installerName: m.installerName, url })
          await transporter.sendMail({ from: mailFrom("PrimeTvNashville"), to: m.installerEmail, subject: mail.subject, html: mail.html })
          sentTo.push(m.installerName)
        } catch (err) {
          console.error("closeout link email failed for", m.installerEmail, err)
          failed.push(m.installerName)
        }
      }
      if (!sentTo.length) return Response.json({ ok: false, error: "Could not send the email." }, { status: 502 })
      return Response.json({ ok: true, sentTo, failed })
    }

    if (action === "reopen") {
      await sql`
        UPDATE job_closeouts
        SET signed_at = NULL, signature = NULL, signer_name = NULL, tip_amount = NULL, tip_method = NULL,
            notes = NULL, work_items = NULL, signed_ip = NULL, signed_agent = NULL
        WHERE booking_id = ${bookingId}
      `
      return Response.json(payload(await load(sql, bookingId)))
    }

    return Response.json({ ok: false, error: "Unknown action" }, { status: 400 })
  } catch (err) {
    console.error("closeout POST error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
