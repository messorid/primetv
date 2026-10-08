import { getTransport, mailFrom, notifyTo } from "../../lib/mailer.js"
import { wizardQuoteEmail } from "../../lib/leadEmails.js"

// The original multi-TV quote wizard's endpoint. No page on the site posts to
// it any more, but it is public, so it gets the same treatment as the live
// forms: everything escaped, and no crash on a payload that lacks tvDetails or
// totalCost. It used to drop the visitor's input into the HTML raw and throw a
// 500 on `body.tvDetails.map` when the field was missing.
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ success: false, error: "Bad request" }), { status: 400 })
  }

  const transporter = getTransport()
  if (!transporter) {
    return new Response(JSON.stringify({ success: false, error: "Email is not configured" }), { status: 500 })
  }

  const who = String(body.fullName || "Unknown").replace(/[\r\n]+/g, " ").trim()

  try {
    await transporter.sendMail({
      from: mailFrom("PrimeTvNashville Website"),
      to: notifyTo(),
      replyTo: body.email || undefined,
      subject: `PrimeTvNashville - New Quote from ${who}`,
      html: wizardQuoteEmail(body),
    })
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error("Email error:", err)
    return new Response(JSON.stringify({ success: false, error: "Could not send" }), { status: 500 })
  }
}
