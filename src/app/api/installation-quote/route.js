import { captureQuoteLead } from "../../lib/quoteLeads.js"
import { getTransport, mailFrom, notifyTo } from "../../lib/mailer.js"
import { installationQuoteEmail } from "../../lib/leadEmails.js"

const SERVICE_LABELS = {
  furniture:     "Furniture Assembly",
  mirror_picture: "Picture / Mirror Hanging",
  shelves_wall:  "Shelves / Wall Installation",
  ceiling_fan:   "Ceiling Fan Installation",
  gazebo:        "Gazebo / Pergola Assembly",
  playset:       "Playground / Playset Installation",
  other:         "Other Installation",
}

export async function POST(request) {
  try {
    const { service, answers, contact } = await request.json()

    if (!contact?.name || !contact?.phone || !contact?.email) {
      return Response.json({ ok: false, error: "Missing contact info" }, { status: 400 })
    }

    const serviceLabel = SERVICE_LABELS[service] || service

    // El lead se guarda antes del correo, para que quede en el panel aunque
    // el envio falle. Un fallo de base de datos no rompe el formulario.
    const saved = await captureQuoteLead({
      source:        "installation_quote",
      service:       serviceLabel,
      name:          contact.name,
      phone:         contact.phone,
      email:         contact.email,
      zip:           contact.zip,
      address:       contact.address,
      preferredDate: contact.date,
      notes:         (answers && answers.description) || "",
      details:       { serviceKey: service, answers: answers || {} },
    })

    const html = installationQuoteEmail({ serviceLabel, answers, contact })

    const transporter = getTransport()

    let notified = false
    try {
      await transporter.sendMail({
        from: mailFrom("PrimeTV Nashville"),
        to: notifyTo(),
        replyTo: contact.email,
        subject: `[Installation Quote] ${serviceLabel} — ${String(contact.name).replace(/[\r\n]+/g, " ").trim()}`,
        html,
      })
      notified = true
    } catch (mailErr) {
      console.error("installation-quote email failed", mailErr)
    }

    if (!saved && !notified) {
      return Response.json({ ok: false }, { status: 500 })
    }

    return Response.json({ ok: true, saved, notified })
  } catch (err) {
    console.error("installation-quote error", err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
