export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// An installer's private jobs page link.
//   GET  ?id=…                       — the link (created on first use)
//   POST { id, action: "email" }     — email it to the installer
//   POST { id, action: "rotate" }    — replace it; the old link stops working

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { portalTokenFor, crewPageUrl } from "@/app/lib/crewPortal.js"
import { buildCrewPageEmail } from "@/app/lib/installerEmails.js"
import { getTransport, mailFrom, canSendMail } from "@/app/lib/mailer.js"

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const id = new URL(request.url).searchParams.get("id")
    if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 })
    const token = await portalTokenFor(neon(process.env.DATABASE_URL), id)
    if (!token) return Response.json({ ok: false, error: "Installer not found" }, { status: 404 })
    return Response.json({ ok: true, url: crewPageUrl(token), path: `/crew/${token}` })
  } catch (err) {
    console.error("crew portal GET error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const { id, action } = await request.json()
    if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 })
    const sql = neon(process.env.DATABASE_URL)

    if (action === "rotate") {
      const token = await portalTokenFor(sql, id, { rotate: true })
      if (!token) return Response.json({ ok: false, error: "Installer not found" }, { status: 404 })
      return Response.json({ ok: true, url: crewPageUrl(token), path: `/crew/${token}` })
    }

    if (action === "email") {
      const [inst] = await sql`SELECT name, email FROM installers WHERE id = ${id} AND active = TRUE`
      if (!inst) return Response.json({ ok: false, error: "Installer not found" }, { status: 404 })
      if (!inst.email) return Response.json({ ok: false, error: "This installer has no email" }, { status: 400 })
      if (!canSendMail()) return Response.json({ ok: false, error: "Email is not configured on the server" }, { status: 500 })
      const url = crewPageUrl(await portalTokenFor(sql, id))
      const mail = buildCrewPageEmail({ installerName: inst.name, url })
      await getTransport().sendMail({ from: mailFrom("PrimeTvNashville"), to: inst.email, subject: mail.subject, html: mail.html })
      return Response.json({ ok: true, sentTo: inst.email })
    }

    return Response.json({ ok: false, error: "Unknown action" }, { status: 400 })
  } catch (err) {
    console.error("crew portal POST error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
