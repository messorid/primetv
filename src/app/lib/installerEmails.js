// ─────────────────────────────────────────────────────────────────────────────
// INSTALLER EMAILS — the work order an installer gets when assigned a job, and
// the notice when that job is cancelled.
//
// Pure functions that take a stored booking and return { subject, html }. The
// admin route keeps the parts that need the database and the mail server
// (loading photos, building the calendar invite, sending); everything that
// decides what the email says lives here, where it can be tested and previewed
// without either.
// ─────────────────────────────────────────────────────────────────────────────

import {
  esc, escLines, emailDocument, heading, para, sectionTitle, details, panel,
  buttons, appointmentBlock, customerCard, mapsHref, telHref, BRAND,
} from "./emailLayout.js"
import { HOME_INSTALL_LABELS } from "./clientEmail.js"
import { closeoutSteps } from "./closeoutEmails.js"

function safe(v) {
  return String(v ?? "-").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
}

export const fullAddressOf = b =>
  [b.address?.street, b.address?.apt, b.address?.city, b.address?.state, b.address?.zip]
    .filter(Boolean).join(", ")

const plain = v => String(v ?? "").replace(/[\r\n]+/g, " ").trim()

export function buildServiceDetail(b) {
  const parts = []

  if (b.booking_mode === "homeinstall") {
    const label = HOME_INSTALL_LABELS[b.home_install_service] || b.home_install_service || "Installation"
    parts.push(`<strong>🔧 Home Installation:</strong> ${safe(label)}`)
  }

  if (b.promo) parts.push(`<strong>Package:</strong> ${safe(b.promo)}`)

  if (b.custom_quote && b.custom_tv_size) {
    parts.push(`<strong>Custom job:</strong> ${safe(b.custom_tv_size)}${b.custom_tv_qty ? ` × ${safe(b.custom_tv_qty)}` : ""}`)
  }

  const tvs = Array.isArray(b.tvs) ? b.tvs : []
  if (tvs.length) {
    parts.push(tvs.map((tv, i) => {
      // A Frame TV needs the slim-fit mount and One Connect Box handled, so the
      // installer has to see the model and measurements, not just the size.
      const isFrame = tv.model === "frame"
      const head = `TV #${i + 1}: ${isFrame ? '<strong style="color:#e50914;">Frame TV</strong> · ' : ""}` +
        `${tv.size ? `${safe(tv.size)}"` : "size n/a"}${tv.exactSize ? ` (${safe(tv.exactSize)}")` : ""} · ${safe(tv.wallType)}`
      const meas = tv.measurements ? `<br><span style="color:#b45309;">↳ Measurements: ${safe(tv.measurements)}</span>` : ""
      const note = tv.comments ? `<br><span style="color:#b45309;">↳ ${safe(tv.comments)}</span>` : ""
      return head + meas + note
    }).join("<br>"))
  }

  if (b.more_tvs) parts.push(`<strong>3 or more TVs</strong> — custom quote`)

  const cableQty = parseInt(b.cable_concealment) || 0
  if (cableQty > 0) parts.push(`<strong>🔌 Cable concealment ×${cableQty}</strong>`)

  return parts.length ? parts.join("<br>") : "—"
}

export function buildCustomerNotes(b) {
  const notes = [
    [b.booking_mode === "homeinstall" ? "Installation request" : "Job description", b.combo_details],
    ["TV details (3+ TVs)", b.more_tvs_comment],
    ["Quote note", b.coupon_comment],
  ].filter(([, v]) => v && String(v).trim())

  if (!notes.length) return ""

  return panel({
    tone: "warn",
    title: "📋 Customer description",
    html: notes.map(([label, value]) => `<strong>${label}:</strong><br>${safe(value).replace(/\n/g, "<br>")}`).join("<br><br>"),
  })
}

// `photoAttachments` are the inline images already prepared by the route; each
// carries the cid the HTML refers to.
export function buildInstallerJobEmail({ b, installerName, crew = null, photoAttachments = [], closeoutUrl = null }) {
  const serviceDetail = buildServiceDetail(b)
  const customerNotes = buildCustomerNotes(b)
  const fullAddress = fullAddressOf(b)

  const photoHtml = photoAttachments.length ? panel({
    tone: "info",
    title: `📸 Job photos (${photoAttachments.length})`,
    html: photoAttachments.map(a =>
      `<img src="cid:${a.cid}" alt="Job photo" width="520" style="display:block;width:100%;max-width:520px;height:auto;border-radius:8px;border:1px solid #cbd5e1;margin:8px 0;">`
    ).join("") + `<span style="font-size:12px;">Also attached to this email.</span>`,
  }) : ""

  const html = emailDocument({
    title: "New job assignment",
    preheader: `${b.date || "Date TBD"}${b.time_pref ? `, ${b.time_pref}` : ""} · ${fullAddress || "address TBD"}`,
    body: `
      ${heading("New job assignment", { kicker: "Job assigned",
          sub: `Hi <strong>${esc(installerName)}</strong>, you have been assigned a new installation job.` })}
      ${crew && crew.length > 1 ? panel({ tone: "purple", title: "👥 Working with",
          html: crew.filter(m => m.installerName !== installerName).map(m => esc(m.installerName)).join(", ") }) : ""}
      ${appointmentBlock({ label: "Job date", date: b.date, time: b.time_pref || "Flexible", address: esc(fullAddress) })}
      ${buttons([
        mapsHref(fullAddress) && { href: mapsHref(fullAddress), label: "📍 Directions" },
        telHref(b.phone) && { href: telHref(b.phone), label: "📞 Call customer", variant: "secondary" },
      ].filter(Boolean))}
      ${sectionTitle("The job", { top: 14 })}
      ${details([
        ["Service", serviceDetail],
        ["Payment", b.payment ? esc(b.payment) : ""],
      ])}
      ${customerNotes}
      ${b.notes ? panel({ tone: "purple", title: "🗒️ Office notes", html: escLines(b.notes) }) : ""}
      ${photoHtml}
      ${customerCard({ name: `${b.first_name || ""} ${b.last_name || ""}`.trim(), phone: b.phone })}
      ${closeoutUrl ? `${closeoutSteps()}${buttons([{ href: closeoutUrl, label: "✍️ Open job closeout" }], { top: 14 })}` : ""}
      ${para(`Questions? Contact the office at <a href="${BRAND.tel}" style="color:#E50914;font-weight:700;text-decoration:none;">${BRAND.phone}</a> or reply to this email.`, { muted: true, size: 13, top: 20 })}
    `,
  })

  return {
    subject: `New Job Assigned — ${b.date || "TBD"} | ${plain(b.first_name)} ${plain(b.last_name)}`,
    html,
  }
}

export function buildCancellationEmail(b) {
  const fullAddress = fullAddressOf(b)
  const html = emailDocument({
    title: "Job cancelled",
    preheader: `Cancelled: ${b.date || "TBD"}${b.time_pref ? `, ${b.time_pref}` : ""} — you do not need to attend.`,
    body: `
      ${heading("Job cancelled", { kicker: "❌ Cancelled",
          sub: `Hi <strong>${esc(b.installer_name)}</strong>, the following job that was assigned to you has been cancelled. You do not need to attend this appointment.` })}
      ${appointmentBlock({ label: "Cancelled job", date: b.date, time: b.time_pref || "Flexible", address: esc(fullAddress) })}
      ${details([["Customer", esc(`${b.first_name || ""} ${b.last_name || ""}`.trim())]], { top: 18 })}
      ${para(`Questions? Contact the office at <a href="${BRAND.tel}" style="color:#E50914;font-weight:700;text-decoration:none;">${BRAND.phone}</a> or reply to this email.`, { muted: true, size: 13, top: 20 })}
    `,
  })
  return {
    subject: `❌ Job Cancelled — ${b.date || "TBD"} | ${plain(b.first_name)} ${plain(b.last_name)}`,
    html,
  }
}
