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

  const mailOptions = {
    from: `"PrimeTvNashville Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Puedes cambiar esto a otro destino si deseas
    subject: `PrimeTvNashville - New Quote from ${body.fullName}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #222; border-bottom: 2px solid #e50914; padding-bottom: 10px;">📺 New TV Installation Request</h2>
      
      <table style="width: 100%; margin-top: 20px;">
        <tr><td style="font-weight: bold; padding: 8px;">Full Name:</td><td style="padding: 8px;">${body.fullName}</td></tr>
        <tr><td style="font-weight: bold; padding: 8px;">Email:</td><td style="padding: 8px;">${body.email}</td></tr>
        <tr><td style="font-weight: bold; padding: 8px;">Phone:</td><td style="padding: 8px;">${body.phone}</td></tr>
        <tr><td style="font-weight: bold; padding: 8px;">Preferred Date:</td><td style="padding: 8px;">${body.preferredDate}</td></tr>
      </table>

      <h4 style="margin-top: 30px; color: #444;">📦 TV Details</h4>
      <table style="width: 100%; margin-top: 10px;">
        <tr><td style="font-weight: bold; padding: 8px;">TV Brand / Type:</td><td style="padding: 8px;">${body.brandOrType}</td></tr>
        <tr><td style="font-weight: bold; padding: 8px;">TV Size:</td><td style="padding: 8px;">${body.tvSize}</td></tr>
        <tr><td style="font-weight: bold; padding: 8px;">Wall Type:</td><td style="padding: 8px;">${body.wallType}</td></tr>
        <tr><td style="font-weight: bold; padding: 8px;">Hide Cables:</td><td style="padding: 8px;">${body.hideCables}</td></tr>
        <tr><td style="font-weight: bold; padding: 8px;">Another TV:</td><td style="padding: 8px;">${body.anotherTv}</td></tr>
      </table>

      <div style="margin-top: 20px;">
        <h4 style="margin-bottom: 8px; color: #444;">📝 Additional Comments:</h4>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-line; line-height: 1.6;">
          ${body.comments || 'No additional comments.'}
        </p>
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #888;">Email generated from PrimeTvNashville.com</p>
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
