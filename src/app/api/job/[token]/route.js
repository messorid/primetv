export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST /api/job/<token> — the customer signs off the job.
//
// Public: the token in the path is the only key. A closeout can be signed
// once; after that it is read-only (the office can reopen it from the admin).

import { neon } from "@neondatabase/serverless"
import {
  loadCloseout, validateSignoff, workItemsOf, publicView, crewFor, closeoutUrl, closeoutRecord, siteUrl,
} from "@/app/lib/closeout.js"
import { buildCloseoutPdf, closeoutPdfName } from "@/app/lib/closeoutPdf.js"
import { buildCloseoutSignedEmail } from "@/app/lib/closeoutEmails.js"
import { getTransport, mailFrom, notifyTo, canSendMail } from "@/app/lib/mailer.js"
import { isValidEmail } from "@/app/lib/formValidation.js"
import { runAfterResponse } from "@/app/lib/afterResponse.js"

const json = (data, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } })

export async function POST(request, { params }) {
  const { token } = await params
  try {
    const sql = neon(process.env.DATABASE_URL)
    const data = await loadCloseout(sql, token)
    if (!data) return json({ ok: false, error: "This closeout link is not valid." }, 404)
    if (data.booking.status === "cancelled") return json({ ok: false, error: "This job was cancelled." }, 409)
    if (data.closeout.signed_at) return json({ ok: false, error: "This job has already been signed." }, 409)

    let body
    try { body = await request.json() } catch { return json({ ok: false, error: "Bad request" }, 400) }

    const check = validateSignoff(body)
    if (!check.ok) return json({ ok: false, errors: check.errors }, 400)
    const v = check.value

    // The work list is frozen at signing, so a later edit to the booking does
    // not change what the customer signed for.
    const items = workItemsOf(data.booking)
    const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null
    const agent = (request.headers.get("user-agent") || "").slice(0, 300) || null

    const [row] = await sql`
      UPDATE job_closeouts
      SET work_items = ${JSON.stringify(items)}::jsonb, notes = ${v.notes || null},
          tip_amount = ${v.tip}, tip_method = ${v.tipMethod},
          signer_name = ${v.signerName}, signature = ${v.signature},
          signed_at = NOW(), signed_ip = ${ip}, signed_agent = ${agent}
      WHERE token = ${token} AND signed_at IS NULL
      RETURNING *
    `
    // Two phones submitting at once: the second finds it already signed.
    if (!row) return json({ ok: false, error: "This job has already been signed." }, 409)

    const crew = await crewFor(sql, data.booking)
    const view = publicView({ ...data, closeout: row }, crew.map(m => m.installerName).filter(Boolean))

    runAfterResponse(() => sendSignedEmails(sql, data.booking, token))
    return json({ ok: true, view })
  } catch (err) {
    console.error("closeout sign error", err)
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500)
  }
}

// The office gets the signed record; the customer gets a copy of what they
// signed. Both carry the record as a PDF, and show the images from the site.
// Either failing is logged and does not undo the signature.
async function sendSignedEmails(sql, booking, token) {
  if (!canSendMail()) return
  let record, pdf
  try {
    record = await closeoutRecord(sql, token)
    if (!record) return
    pdf = await buildCloseoutPdf(record)
  } catch (err) {
    console.error("closeout record/PDF for email failed", err)
    if (!record) return
  }
  const { view } = record
  const attachments = pdf
    ? [{ filename: closeoutPdfName(view), content: Buffer.from(pdf), contentType: "application/pdf" }]
    : []
  const common = {
    b: booking, view, installers: view.installers,
    signatureSrc: siteUrl(view.signed.signatureUrl),
    photoSrcs: view.photos.map(p => siteUrl(p.url)),
  }
  const transporter = getTransport()

  try {
    const office = buildCloseoutSignedEmail({ ...common, url: closeoutUrl(token) })
    await transporter.sendMail({ from: mailFrom("PrimeTvNashville"), to: notifyTo(), subject: office.subject, html: office.html, attachments })
  } catch (err) {
    console.error("closeout office email failed", err)
  }

  if (booking.email && isValidEmail(booking.email)) {
    try {
      const copy = buildCloseoutSignedEmail({ ...common, forCustomer: true })
      await transporter.sendMail({ from: mailFrom("PrimeTvNashville"), to: booking.email, subject: copy.subject, html: copy.html, attachments })
    } catch (err) {
      console.error("closeout customer copy failed", err)
    }
  }
}
