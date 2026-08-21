import nodemailer from "nodemailer"

const SERVICE_LABELS = {
  furniture:     "Furniture Assembly",
  mirror_picture: "Picture / Mirror Hanging",
  shelves_wall:  "Shelves / Wall Installation",
  gazebo:        "Gazebo / Pergola Assembly",
  other:         "Other Installation",
}

export async function POST(request) {
  try {
    const { service, answers, contact } = await request.json()

    if (!contact?.name || !contact?.phone || !contact?.email) {
      return Response.json({ ok: false, error: "Missing contact info" }, { status: 400 })
    }

    const serviceLabel = SERVICE_LABELS[service] || service

    const answersHtml = Object.entries(answers || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:4px 8px;font-weight:600;color:#555;white-space:nowrap">${k.replace(/_/g, " ")}</td><td style="padding:4px 8px;color:#222">${v}</td></tr>`)
      .join("")

    const html = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
  <div style="background:#E50914;padding:20px 24px">
    <h1 style="margin:0;color:#fff;font-size:18px">New Installation Quote Request</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">PrimeTvNashville</p>
  </div>
  <div style="padding:24px">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#f9fafb;border-radius:8px;overflow:hidden">
      <tr><td style="padding:10px 14px;font-weight:700;background:#f3f4f6;color:#111;font-size:15px" colspan="2">Service Requested</td></tr>
      <tr><td colspan="2" style="padding:10px 14px;font-size:16px;font-weight:700;color:#E50914">${serviceLabel}</td></tr>
    </table>

    ${answersHtml ? `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#f9fafb;border-radius:8px;overflow:hidden">
      <tr><td style="padding:10px 14px;font-weight:700;background:#f3f4f6;color:#111;font-size:14px" colspan="2">Project Details</td></tr>
      ${answersHtml}
    </table>` : ""}

    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden">
      <tr><td style="padding:10px 14px;font-weight:700;background:#f3f4f6;color:#111;font-size:14px" colspan="2">Contact Information</td></tr>
      <tr><td style="padding:4px 8px;font-weight:600;color:#555">Name</td><td style="padding:4px 8px;color:#222">${contact.name}</td></tr>
      <tr><td style="padding:4px 8px;font-weight:600;color:#555">Phone</td><td style="padding:4px 8px;color:#222">${contact.phone}</td></tr>
      <tr><td style="padding:4px 8px;font-weight:600;color:#555">Email</td><td style="padding:4px 8px;color:#222">${contact.email}</td></tr>
      ${contact.address ? `<tr><td style="padding:4px 8px;font-weight:600;color:#555">Address</td><td style="padding:4px 8px;color:#222">${contact.address}</td></tr>` : ""}
      ${contact.zip ? `<tr><td style="padding:4px 8px;font-weight:600;color:#555">ZIP</td><td style="padding:4px 8px;color:#222">${contact.zip}</td></tr>` : ""}
      ${contact.date ? `<tr><td style="padding:4px 8px;font-weight:600;color:#555">Preferred date</td><td style="padding:4px 8px;color:#222">${contact.date}</td></tr>` : ""}
    </table>
  </div>
</div>`

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })

    await transporter.sendMail({
      from: `"PrimeTV Nashville" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: contact.email,
      subject: `[Installation Quote] ${serviceLabel} — ${contact.name}`,
      html,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error("installation-quote error", err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
