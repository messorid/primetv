// ─────────────────────────────────────────────────────────────────────────────
// The customer's booking confirmation.
//
// This lives outside the booking route so the admin panel can rebuild and
// resend the exact same message from a stored booking — a confirmation that
// landed in spam, or one that bounced before the address was corrected, should
// not have to be retyped by hand.
//
// It takes the camelCase shape that `toBooking()` returns from the bookings
// API, which is also what the public form has on hand at submit time.
// ─────────────────────────────────────────────────────────────────────────────

import { validateCoupon } from "./coupons.js"
import {
  BRAND, emailDocument, heading, para, sectionTitle, details, panel, priceBox, buttons, fmtDate,
  appointmentBlock,
} from "./emailLayout.js"

export const PROMO_PRICES = {
  '2 TVs up to 55"':                  "From $199",
  '2 TVs up to 70"':                  "From $250",
  '1 TV up to 55" + 1 TV up to 70"': "From $230",
}

export const HOME_INSTALL_LABELS = {
  furniture:      "Furniture Assembly",
  mirror_picture: "Picture / Mirror Hanging",
  shelves_wall:   "Shelves & Wall Installation",
  ceiling_fan:    "Ceiling Fan Installation",
  gazebo:         "Gazebo / Pergola Assembly",
  playset:        "Playground / Playset Installation",
  other:          "Other Installation",
}

export function safe(v) {
  return String(v ?? "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export function crow(label, value) {
  return `
    <tr>
      <td style="padding:6px 0;width:140px;font-weight:600;color:#666;font-size:13px;">${label}</td>
      <td style="padding:6px 0;font-size:13px;">${value}</td>
    </tr>
  `
}

export function buildICS({ uid, date, timePref, summary, description, location, organizer, attendees }) {
  if (!date) return null
  let startH = 10, startM = 0
  const m = (timePref || "").match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (m) {
    startH = parseInt(m[1]); startM = parseInt(m[2])
    if (m[3].toUpperCase() === "PM" && startH !== 12) startH += 12
    if (m[3].toUpperCase() === "AM" && startH === 12) startH = 0
  } else if (/morning/i.test(timePref)) { startH = 9 }
  else if (/afternoon/i.test(timePref)) { startH = 13 }
  else if (/evening/i.test(timePref))   { startH = 17 }
  const p2 = n => String(n).padStart(2, "0")
  const [y, mo, d] = date.split("-")
  const dtStart = `${y}${mo}${d}T${p2(startH)}${p2(startM)}00`
  const dtEnd   = `${y}${mo}${d}T${p2(Math.min(startH + 2, 23))}${p2(startM)}00`
  const stamp   = new Date().toISOString().replace(/[-:.]/g,"").slice(0,15) + "Z"
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PrimeTvNashville//EN",
    "METHOD:REQUEST", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid || Date.now()}@primetv`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/Chicago:${dtStart}`,
    `DTEND;TZID=America/Chicago:${dtEnd}`,
    `SUMMARY:${summary}`,
    description ? `DESCRIPTION:${description.replace(/[\r\n]+/g, "\\n")}` : "",
    location    ? `LOCATION:${location}` : "",
    `ORGANIZER;CN=PrimeTvNashville:mailto:${organizer}`,
    ...(attendees || []).filter(a => a?.email).map(a =>
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${a.name}:mailto:${a.email}`
    ),
    "STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n")
}

export function formatAddress(address) {
  const a = address || {}
  return [
    safe(a.street),
    a.apt ? safe(a.apt) : null,
    `${safe(a.city)}, ${safe(a.state)} ${safe(a.zip)}`,
  ].filter(Boolean).join(", ")
}

// Builds the full confirmation message. `organizer` is the sending mailbox,
// needed for the calendar invite.
//
// Built from the shared email layout: tables rather than flex, so the price
// sits beside its label in every client instead of wrapping under it in
// Outlook and the Gmail app; a real date ("Thursday, October 1") instead of
// "2026-10-01"; and a phone number the customer can tap.
export function buildClientEmail(b, { organizer } = {}) {
  const firstName      = b.firstName || ""
  const lastName       = b.lastName || ""
  const fullName       = `${safe(firstName)} ${safe(lastName)}`
  const fullAddress    = formatAddress(b.address)
  const date           = b.date || ""
  const timePreference = b.timePreference || ""

  const tvList     = Array.isArray(b.tvs) ? b.tvs : []
  const isPromo    = b.bookingMode === "promo"
  const isCombo    = b.bookingMode === "bundle"
  const isHomeInst = b.bookingMode === "homeinstall"
  const hasPromo   = isPromo && !!b.selectedPromo
  const promoPrice = hasPromo ? (PROMO_PRICES[b.selectedPromo] || "See quote") : ""
  const homeInstLbl = isHomeInst
    ? (HOME_INSTALL_LABELS[b.homeInstallService] || b.homeInstallService || "Installation")
    : ""

  const cableQty   = parseInt(b.cableConcealment) || 0
  const cableTotal = cableQty * 60

  const anyFrameTv = tvList.some(tv => tv?.model === "frame")

  // Whether to hide the code is a property of the coupon itself, so it is
  // re-derived rather than stored — a resend must match the original.
  const couponHidden = b.couponHidden ?? Boolean(validateCoupon(b.couponCode)?.hideCodeFromClient)

  const customPriceNum =
    b.customQuote && b.customPrice != null && b.customPrice !== ""
      ? parseFloat(b.customPrice)
      : null

  const serviceRow = isHomeInst
    ? ["Service", `${safe(homeInstLbl)} — quote based`]
    : isCombo
    ? ["Service", "Custom Installation"]
    : hasPromo
    ? ["Package", safe(b.selectedPromo)]
    : b.moreTvs
    ? ["TVs", "3+ TVs — custom quote"]
    : ["TVs", `${tvList.length} TV${tvList.length !== 1 ? "s" : ""}`]

  // ── Price and quote blocks ────────────────────────────────────────────────
  const promoPriceBlock = hasPromo ? priceBox({
    label: "Package Price",
    sub: safe(b.selectedPromo),
    amount: promoPrice,
    note: cableQty > 0 ? `🔌 + Cable Concealment ×${cableQty}: +$${cableTotal}` : "",
  }) : ""

  const customQuoteBlock = b.customQuote ? priceBox({
    label: "Installation Price",
    sub: b.customMode === "sized" && b.customTvSize
      ? `${safe(b.customTvSize)}${b.customTvQty ? ` × ${safe(b.customTvQty)}` : ""}` : "",
    amount: customPriceNum != null ? `$${customPriceNum.toFixed(2)}` : "",
    note: b.couponComment ? `&ldquo;${safe(b.couponComment)}&rdquo;` : "",
  }) : ""

  const couponBlock = (b.couponCode && b.appliedCouponLabel && !b.customQuote) ? panel({
    tone: "success",
    title: couponHidden ? "Offer applied" : `Coupon Applied — ${safe(b.couponCode)}`,
    html: `<strong>${safe(b.appliedCouponLabel)}</strong>${b.couponComment ? `<br><em>&ldquo;${safe(b.couponComment)}&rdquo;</em>` : ""}`,
  }) : ""

  const moreTvsBlock = b.moreTvs ? panel({
    tone: "warn",
    title: "3+ TVs — Custom Quote",
    html: `Pricing varies for 3 or more TVs. We will contact you to confirm the total before the appointment.${
      b.moreTvsComment ? `<br><em>&ldquo;${safe(b.moreTvsComment)}&rdquo;</em>` : ""}`,
  }) : ""

  const bundleBlock = (isCombo && b.comboDetails) ? panel({
    tone: "warn",
    title: "Your Installation",
    html: safe(b.comboDetails).replace(/\n/g, "<br>"),
  }) : ""

  const homeInstallBlock = isHomeInst ? panel({
    tone: "info",
    title: "🔧 Home Installation — Quote Based",
    html: `<strong style="font-size:15px;">${safe(homeInstLbl)}</strong>${
      b.comboDetails ? `<br>${safe(b.comboDetails).replace(/\n/g, "<br>")}` : ""
    }<br><span style="font-size:13px;">We will review this request and contact you with pricing before the appointment.</span>`,
  }) : ""

  const frameTvBlock = anyFrameTv ? panel({
    tone: "brand",
    title: "🖼️ Frame TV — Quote Based",
    html: "Frame TV installations are quoted individually based on the measurements, the mount and the wall. One of our sales representatives will confirm your exact price before the appointment.",
  }) : ""

  // The appointment itself, large, because it is the one thing the customer
  // comes back to this email to check.
  const appointment = appointmentBlock({ date, time: timePreference, address: fullAddress, top: 22 })

  const ics = buildICS({
    uid:         `${date || "nodate"}-${(b.email || "").replace(/[^a-z0-9]/gi, "")}@primetv`,
    date,
    timePref:    timePreference,
    summary:     "TV Installation — PrimeTvNashville",
    description: `Your TV installation appointment.\nAddress: ${fullAddress}`,
    location:    fullAddress,
    organizer,
    attendees:   [{ name: fullName, email: b.email }],
  })

  const body = `
    ${heading("Your Booking is Confirmed!", { kicker: "Booking received" })}
    ${para(`Hi ${safe(firstName)},`, { top: 18 })}
    ${para("Thank you for choosing <strong>PrimeTvNashville</strong>! We&rsquo;ve received your booking request and will contact you shortly to confirm your appointment.", { top: 8 })}

    ${appointment}

    ${sectionTitle("Booking Summary")}
    ${details([
      // The dark appointment block already shows these; repeat them only when
      // there is no date and so no block.
      date ? null : ["Time window", safe(timePreference)],
      date ? null : ["Address", fullAddress],
      serviceRow,
      cableQty > 0 && !isCombo && !isHomeInst ? ["Add-on", `Cable Concealment ×${cableQty} (+$${cableTotal})`] : null,
    ])}

    ${promoPriceBlock}
    ${customQuoteBlock}
    ${couponBlock}
    ${moreTvsBlock}
    ${bundleBlock}
    ${homeInstallBlock}
    ${frameTvBlock}

    ${sectionTitle("Questions or changes?")}
    ${para(`Call or text us at <a href="${BRAND.tel}" style="color:#E50914;font-weight:700;text-decoration:none;">${BRAND.phone}</a>, or simply reply to this email.`, { top: 0 })}
    ${buttons([
      { href: BRAND.tel, label: "📞 Call us" },
      { href: BRAND.sms, label: "💬 Text us", variant: "secondary" },
    ], { top: 14 })}

    ${panel({
      tone: "danger",
      top: 24,
      title: "⚠️ Important — Wall Liability Notice",
      html: `<strong>For all TV mounting and hidden cable concealment services:</strong> The customer is solely responsible for verifying that there are no electrical wires, water pipes, gas lines, or any other obstructions inside the wall before installation. PrimeTvNashville cannot see inside walls and is <strong>not responsible</strong> for any damage to electrical wiring, plumbing, gas lines, or any other in-wall infrastructure during the installation process.<br><br>By booking this service, you acknowledge and accept these conditions. Please read our full <a href="https://www.primetvnashville.com/terms" style="color:#E50914;font-weight:700;">Terms &amp; Conditions</a> for complete details.`,
    })}
  `

  const html = emailDocument({
    title: "Booking Confirmed — PrimeTvNashville",
    preheader: date
      ? `${fmtDate(date)}${timePreference ? `, ${timePreference}` : ""} — we'll be in touch to confirm.`
      : "We've received your booking and will be in touch to confirm.",
    body,
    footerNote: `You're receiving this because you booked an installation at primetvnashville.com. <a href="https://www.primetvnashville.com/terms" style="color:#9ca3af;">Terms &amp; Conditions</a>`,
  })

  return {
    subject: "Booking Confirmed — PrimeTvNashville",
    html,
    attachments: ics
      ? [{ filename: "appointment.ics", content: ics, contentType: "text/calendar; method=REQUEST; charset=utf-8" }]
      : [],
  }
}
