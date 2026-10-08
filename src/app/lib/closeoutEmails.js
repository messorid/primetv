// ─────────────────────────────────────────────────────────────────────────────
// REVIEW + CLOSEOUT EMAILS
//
//   buildReviewRequestEmail   — asks a customer for a Google review; sent from
//                               the admin whenever the office chooses
//   buildCloseoutLinkEmail    — sends the installer the closeout link for a job
//   buildCloseoutSignedEmail  — the signed record, to the office and as a copy
//                               to the customer
//
// Pure functions over a stored booking row; the routes do the sending.
// ─────────────────────────────────────────────────────────────────────────────

import {
  esc, escLines, fmtDate, emailDocument, heading, para, sectionTitle, details,
  panel, buttons, appointmentBlock, BRAND,
} from "./emailLayout.js"
import { CONFIRM_TEXT } from "./closeoutRules.js"

export const GOOGLE_REVIEW_URL = "https://g.page/r/CblSDOdhtcueEBI/review"

const firstNameOf = b => String(b.first_name || "").trim()
const fullNameOf = b => `${b.first_name || ""} ${b.last_name || ""}`.trim()
const plain = v => String(v ?? "").replace(/[\r\n]+/g, " ").trim()

export function fmtSignedAt(iso) {
  if (!iso) return ""
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago", month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  }) + " (Central)"
}

export const fmtTip = (tip, method) =>
  Number(tip) > 0 ? `$${Number(tip).toFixed(2)}${method ? ` — ${method}` : ""}` : "No tip"

// ── Review request ──────────────────────────────────────────────────────────

export function buildReviewRequestEmail(b) {
  const first = firstNameOf(b)
  const when = b.date ? ` for your installation on ${fmtDate(b.date).replace(/, \d{4}$/, "")}` : ""
  const html = emailDocument({
    title: "Thank you from PrimeTvNashville",
    preheader: "A quick Google review helps our small business grow.",
    body: `
      ${heading(first ? `Thank you, ${esc(first)}!` : "Thank you!", { kicker: "Thank you" })}
      ${para(`Thank you for choosing PrimeTvNashville${esc(when)}.`)}
      ${para("We’d love to hear how everything went. If you have a minute, we would be grateful if you could leave us a quick Google review. Your feedback helps our small business grow.")}
      ${buttons([{ href: GOOGLE_REVIEW_URL, label: "⭐ Leave a Google review" }])}
      ${para(`Or open this link: <a href="${GOOGLE_REVIEW_URL}" style="color:${BRAND.red};font-weight:700;word-break:break-all;">${GOOGLE_REVIEW_URL}</a>`, { muted: true, size: 13, top: 4 })}
      ${para("Thank you,<br><strong>The PrimeTvNashville team</strong>", { top: 22 })}
    `,
  })
  return {
    subject: first ? `${plain(first)}, thank you from PrimeTvNashville` : "Thank you from PrimeTvNashville",
    html,
  }
}

// ── Closeout link for the installer ─────────────────────────────────────────

export function buildCloseoutLinkEmail({ b, installerName, url }) {
  const name = fullNameOf(b)
  const html = emailDocument({
    title: "Job closeout link",
    preheader: `Closeout for ${name} — ${b.date || "date TBD"}. Open it when the job is done.`,
    body: `
      ${heading("Job closeout", { kicker: "End of job",
          sub: `Hi <strong>${esc(installerName || "there")}</strong>, here is the closeout for this job.` })}
      ${appointmentBlock({ label: "Job", date: b.date, time: b.time_pref })}
      ${details([["Customer", esc(name)]], { top: 16 })}
      ${closeoutSteps()}
      ${buttons([{ href: url, label: "✍️ Open job closeout" }])}
      ${para(`<a href="${esc(url)}" style="color:${BRAND.muted};word-break:break-all;">${esc(url)}</a>`, { muted: true, size: 12, top: 2 })}
    `,
  })
  return { subject: `✍️ Closeout — ${plain(name)} | ${b.date || "TBD"}`, html }
}

// The three steps, shared with the work order so both say the same thing.
export function closeoutSteps() {
  return panel({
    tone: "info",
    title: "✍️ When the job is done",
    html: "1. Open the closeout link on your phone.<br>2. Add photos of the finished work.<br>3. Hand the phone to the customer to add a tip if they want, and sign.",
  })
}

// ── Signed closeout ─────────────────────────────────────────────────────────

// `view` is publicView(); `signatureSrc` and `photoSrcs` are absolute image
// URLs on the site. Images are linked rather than embedded because several
// mail apps hide embedded (cid:) images; the attached PDF holds the full
// record either way.
export function buildCloseoutSignedEmail({ b, view, installers = [], signatureSrc, photoSrcs = [], url, forCustomer = false }) {
  const s = view.signed
  const name = fullNameOf(b)
  const first = firstNameOf(b)

  const work = `
    ${sectionTitle("Work completed", { top: 22 })}
    ${view.workItems.map(item => `<p style="margin:0 0 8px;font-size:15px;line-height:1.45;color:${BRAND.ink};"><span style="color:#059669;font-weight:700;">✓</span>&nbsp; ${esc(item)}</p>`).join("")}
    ${s.notes ? panel({ tone: "neutral", title: "Notes", html: escLines(s.notes) }) : ""}`

  const signature = signatureSrc ? `
    ${sectionTitle("Customer signature", { top: 22 })}
    <img src="${esc(signatureSrc)}" alt="Signature of ${esc(s.name)}" width="320" style="display:block;width:100%;max-width:320px;height:auto;border:1px solid ${BRAND.line};border-radius:8px;background:#ffffff;">
    ${para(`<strong>${esc(s.name)}</strong> · ${esc(fmtSignedAt(s.at))}`, { size: 13, top: 6, muted: true })}
    ${para(`“${esc(CONFIRM_TEXT)}”`, { size: 13, top: 4, muted: true })}` : ""

  const photos = photoSrcs.length ? `
    ${sectionTitle(`Photos (${photoSrcs.length})`, { top: 22 })}
    ${photoSrcs.map(src => `<img src="${esc(src)}" alt="Finished work" width="520" style="display:block;width:100%;max-width:520px;height:auto;border-radius:8px;border:1px solid ${BRAND.line};margin:8px 0;">`).join("")}` : ""

  if (forCustomer) {
    const html = emailDocument({
      title: "Your job summary",
      preheader: `Your installation on ${b.date || ""} is complete. Here is a copy of what you signed.`,
      body: `
        ${heading(first ? `Thanks, ${esc(first)}! Your job is complete.` : "Your job is complete.", { kicker: "Job summary",
            sub: "Here is a copy of the job summary you signed, for your records." })}
        ${appointmentBlock({ label: "Installation date", date: b.date, time: b.time_pref })}
        ${details([
          installers.length ? ["Installer", esc(installers.join(", "))] : null,
          Number(s.tip) > 0 ? ["Tip", esc(fmtTip(s.tip, s.tipMethod))] : null,
        ], { top: 16 })}
        ${work}
    ${panel({ tone: "info", title: "📄 PDF attached", html: "A copy of the full record — details, signature and photos — is attached as a PDF." })}
        ${photos}
        ${signature}
        ${para(`Questions about your installation? Call <a href="${BRAND.tel}" style="color:${BRAND.red};font-weight:700;text-decoration:none;">${BRAND.phone}</a> or reply to this email.`, { muted: true, size: 13, top: 22 })}
      `,
    })
    return { subject: "Your job summary — PrimeTvNashville", html }
  }

  const html = emailDocument({
    title: "Job signed off",
    preheader: `${name} signed off ${b.date || ""} · tip ${fmtTip(s.tip, s.tipMethod)}`,
    body: `
      ${heading("Job signed off", { kicker: "✍️ Signed", sub: `<strong>${esc(name)}</strong> confirmed the work was done well.` })}
      ${appointmentBlock({ label: "Job date", date: b.date, time: b.time_pref })}
      ${details([
        ["Customer", esc(name)],
        ["Signed by", esc(s.name)],
        ["Signed", esc(fmtSignedAt(s.at))],
        ["Installer", esc(installers.join(", ") || "—")],
        ["Tip", `<strong>${esc(fmtTip(s.tip, s.tipMethod))}</strong>`],
        ["Photos", String(photoSrcs.length)],
      ], { top: 16 })}
      ${work}
    ${panel({ tone: "info", title: "📄 PDF attached", html: "The full record — details, signature and photos — is attached as a PDF." })}
      ${signature}
      ${photos}
      ${url ? buttons([{ href: url, label: "Open the closeout" }]) : ""}
    `,
  })
  return { subject: `✍️ Signed off — ${plain(name)} | ${b.date || "no date"} | tip ${fmtTip(s.tip, s.tipMethod)}`, html }
}
