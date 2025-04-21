import nodemailer from 'nodemailer'

export async function POST(request) {
  const body = await request.json()

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Generar filas dinámicamente para cada televisor
  const tvRows = body.tvDetails
    .map(
      (tv, idx) => `
        <tr style="background:${idx % 2 ? '#fafafa' : '#fff'};">
          <td style="padding:8px;">${idx + 1}</td>
          <td style="padding:8px;">${tv.tvType || '-'}</td>
          <td style="padding:8px;">${tv.tvSize || '-'}</td>
          <td style="padding:8px;">${tv.wallType || '-'}</td>
          <td style="padding:8px;">${tv.hideCables || '-'}</td>
          <td style="padding:8px;">${tv.comments || '-'}</td>
        </tr>
      `
    )
    .join('')

  const mailOptions = {
    from: `"PrimeTvNashville Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `PrimeTvNashville - New Quote from ${body.fullName}`,
    html: `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:10px;">
        <h2 style="color:#222; border-bottom:2px solid #e50914; padding-bottom:10px;">📺 New TV Installation Request</h2>

        <table style="width:100%; margin-top:20px;">
          <tr><td style="font-weight:bold; padding:8px;">Full Name:</td><td style="padding:8px;">${body.fullName}</td></tr>
          <tr><td style="font-weight:bold; padding:8px;">Email:</td><td style="padding:8px;">${body.email}</td></tr>
          <tr><td style="font-weight:bold; padding:8px;">Phone:</td><td style="padding:8px;">${body.phone}</td></tr>
          <tr><td style="font-weight:bold; padding:8px;">Preferred Date:</td><td style="padding:8px;">${body.preferredDate}</td></tr>
        </table>

        <h4 style="margin-top:30px; color:#444;">📦 TV Details</h4>
        <table style="width:100%; margin-top:10px; border-collapse:collapse;">
          <thead>
            <tr style="background:#f0f0f0;">
              <th style="padding:8px;">#</th>
              <th style="padding:8px;">Brand / Type</th>
              <th style="padding:8px;">Size</th>
              <th style="padding:8px;">Wall</th>
              <th style="padding:8px;">Hide Cables</th>
              <th style="padding:8px;">Comments</th>
            </tr>
          </thead>
          <tbody>
            ${tvRows}
          </tbody>
        </table>

        <div style="margin-top:20px; background:#f9f9f9; padding:12px; border-radius:5px;">
          <strong>Total Estimated Cost:</strong> $${body.totalCost.toFixed(2)}
        </div>

        <p style="margin-top:30px; font-size:14px; color:#888;">Email generated from PrimeTvNashville.com</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('Email error:', err)
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 })
  }
}
