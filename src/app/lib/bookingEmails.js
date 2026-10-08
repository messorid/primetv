// ─────────────────────────────────────────────────────────────────────────────
// BOOKING EMAILS — what the office receives when someone books on the site.
//
// These are read on a phone, usually between jobs, so they are built for that:
// the appointment and the customer first, one-tap buttons to call, text, email
// or get directions, and each TV as its own card. The old version put the TVs
// in a five-column table, which on a phone squeezed every column into a
// sliver you had to zoom to read.
//
// Takes the raw request body and escapes everything once, here.
// ─────────────────────────────────────────────────────────────────────────────

import {
  esc, escLines, fmtDate, emailDocument, heading, para, sectionTitle, details,
  panel, customerCard, contactActions, appointmentBlock,
} from "./emailLayout.js"
import { PROMO_PRICES, HOME_INSTALL_LABELS } from "./clientEmail.js"

function rawAddress(a = {}) {
  return [a.street, a.apt, [a.city, a.state].filter(Boolean).join(", "), a.zip]
    .map(x => String(x || "").trim()).filter(Boolean).join(", ")
}

function context(body) {
  const info = body.info || {}
  const tvs = Array.isArray(body.tvs) ? body.tvs : []
  const mode = body.bookingMode || "standard"
  const cableQty = parseInt(body.cableConcealment) || 0
  const customPriceNum =
    body.customQuote && body.customPrice != null && body.customPrice !== "" ? parseFloat(body.customPrice) : null
  return {
    info, tvs, mode, cableQty,
    cableTotal: cableQty * 60,
    name: `${info.firstName || ""} ${info.lastName || ""}`.trim(),
    address: rawAddress(body.address),
    isPromo: mode === "promo",
    isCombo: mode === "bundle",
    isHomeInst: mode === "homeinstall",
    isStandard: !body.bookingMode || mode === "standard",
    hasPromo: mode === "promo" && !!body.selectedPromo,
    promoPrice: body.selectedPromo ? (PROMO_PRICES[body.selectedPromo] || "See quote") : "",
    homeInstLbl: mode === "homeinstall"
      ? (HOME_INSTALL_LABELS[body.homeInstallService] || body.homeInstallService || "Installation") : "",
    anyFrameTv: tvs.some(tv => tv?.model === "frame"),
    customPriceNum,
  }
}


function tvCards(tvs) {
  if (!tvs.length) return ""
  return tvs.map((tv, i) => panel({
    tone: tv?.model === "frame" ? "brand" : "neutral",
    top: i === 0 ? 0 : 10,
    title: `TV ${i + 1}${tv?.model === "frame" ? " — Frame TV (quote)" : ""}`,
    html: details([
      ["Size", tv.size ? `${esc(tv.size)}&quot;${tv.exactSize ? ` (${esc(tv.exactSize)}&quot;)` : ""}` : ""],
      ["Measurements", esc(tv.measurements)],
      ["Wall", esc(tv.wallType)],
      ["Comments", escLines(tv.comments)],
    ]) || "<em>No details given</em>",
  })).join("")
}

export function buildBusinessBookingEmail(body) {
  const c = context(body)
  const { info } = c

  const modeLabel = c.isHomeInst ? "Home Installation" : c.isCombo ? "Bundle (custom)" : c.isPromo ? "Promo Package" : "Standard"

  const whatRows = details([
    ["Booking type", modeLabel],
    c.hasPromo ? ["Promo", `${esc(body.selectedPromo)} — <strong>${esc(c.promoPrice)}</strong>`] : null,
    c.isHomeInst ? ["Service", `<strong>${esc(c.homeInstLbl)}</strong> — quote based`] : null,
    c.anyFrameTv ? ["Frame TV", "Yes — quote based"] : null,
    (c.isStandard || c.isPromo) && c.cableQty > 0 ? ["Cable concealment", `×${c.cableQty} — $${c.cableTotal}`] : null,
    body.couponCode ? ["Coupon", `${esc(body.couponCode)} — ${esc(body.appliedCouponLabel)}`] : null,
    body.customQuote ? ["Custom quote", body.customMode === "sized" ? "TV size &amp; qty" : "Comment only"] : null,
    body.customQuote && body.customMode === "sized" && body.customTvSize
      ? ["Custom TV size", `${esc(body.customTvSize)}${body.customTvQty ? ` × ${esc(body.customTvQty)}` : ""}`] : null,
    body.customQuote && c.customPriceNum != null ? ["Custom price", `<strong>$${c.customPriceNum.toFixed(2)}</strong>`] : null,
    body.couponComment ? ["Coupon comment", escLines(body.couponComment)] : null,
    body.moreTvs ? ["3+ TVs", "Yes — custom quote needed"] : null,
    body.moreTvsComment ? ["TV details", escLines(body.moreTvsComment)] : null,
    ["How they found us", esc(info.referral)],
    ["Payment", esc(info.payment)],
  ])

  const jobBlock = c.isHomeInst
    ? panel({ tone: "info", title: "🔧 Home installation — quote based",
        html: `<strong>${esc(c.homeInstLbl)}</strong>${body.homeInstallDetails ? `<br>${escLines(body.homeInstallDetails)}` : ""}` })
    : c.isCombo
    ? panel({ tone: "warn", title: "Bundle — custom job", html: escLines(body.comboDetails || "—") })
    : c.hasPromo
    ? para("<em>Package promo — TV details not required.</em>", { muted: true })
    : `${sectionTitle(`TVs (${c.tvs.length})`, { top: 24 })}${tvCards(c.tvs)}`

  const html = emailDocument({
    title: `New booking — ${c.name}`,
    preheader: `${c.name} · ${fmtDate(body.date)}${body.timePreference ? `, ${body.timePreference}` : ""} · ${c.address}`,
    body: `
      ${heading("New booking request", { kicker: "New booking" })}
      ${appointmentBlock({ label: "Requested for", date: body.date, time: body.timePreference })}
      ${customerCard({ name: c.name, phone: info.phone, email: info.email, address: c.address })}
      ${contactActions({ phone: info.phone, email: info.email, address: c.address, subject: "Your PrimeTvNashville booking" })}
      ${sectionTitle("What they booked", { top: 18 })}
      ${whatRows}
      ${jobBlock}
    `,
    footerNote: "Submitted from primetvnashville.com. Replying to this email writes straight to the customer. The calendar invite is attached.",
  })

  return { subject: `New Booking — ${c.name} | ${body.date || "no date"}`, html }
}

// The booking never reached the database. The customer has their confirmation,
// so nothing will remind anyone it exists — this email is the only record.
export function buildDbFailureAlert(body, dbErrMsg) {
  const c = context(body)
  const { info } = c
  const html = emailDocument({
    title: "Booking NOT saved",
    preheader: `${c.name} booked for ${fmtDate(body.date)} — add it to the admin panel by hand.`,
    body: `
      ${heading("Booking did NOT save to the database", { kicker: "⚠️ Action needed" })}
      ${panel({ tone: "danger", top: 18, title: "Add it manually",
          html: "The customer received their confirmation email, but the record could not be written to the bookings table after 3 attempts. <strong>Add it in the admin panel or this job will not appear anywhere.</strong>" })}
      ${appointmentBlock({ label: "Requested for", date: body.date, time: body.timePreference })}
      ${customerCard({ name: c.name, phone: info.phone, email: info.email, address: c.address })}
      ${contactActions({ phone: info.phone, email: info.email, address: c.address })}
      ${sectionTitle("Booking details", { top: 14 })}
      ${details([["How they found us", esc(info.referral)], ["Payment", esc(info.payment)], ["Database error", esc(dbErrMsg)]])}
      ${sectionTitle("Raw booking data")}
      <pre style="margin:0;background:#f6f6f6;border-radius:8px;padding:12px;font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-word;">${esc(JSON.stringify(body, null, 2))}</pre>
    `,
  })
  return { subject: `⚠️ BOOKING NOT SAVED TO DATABASE — ${c.name} | ${body.date || "no date"}`, html }
}

// The booking is saved but the confirmation bounced: usually a mistyped email,
// so the office has to phone them.
export function buildClientEmailFailureAlert(body) {
  const c = context(body)
  const { info } = c
  const html = emailDocument({
    title: "Customer did not get their confirmation",
    preheader: `${c.name}'s confirmation bounced — call them to confirm ${fmtDate(body.date)}.`,
    body: `
      ${heading("Confirmation did not reach the customer", { kicker: "⚠️ Call them" })}
      ${panel({ tone: "warn", top: 18, title: "The booking is saved",
          html: "It appears in the admin panel, but the confirmation to the customer could not be delivered. The email address below is most likely mistyped. <strong>Call them to confirm the appointment.</strong>" })}
      ${appointmentBlock({ label: "Requested for", date: body.date, time: body.timePreference })}
      ${customerCard({ name: c.name, phone: info.phone, email: info.email, address: c.address })}
      ${contactActions({ phone: info.phone, address: c.address })}
    `,
  })
  return { subject: `⚠️ CUSTOMER DID NOT GET THEIR CONFIRMATION — ${c.name} | ${body.date || "no date"}`, html }
}
