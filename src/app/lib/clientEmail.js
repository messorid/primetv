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

export const PROMO_PRICES = {
  '2 TVs up to 55"':                  "From $199",
  '2 TVs up to 70"':                  "From $250",
  '1 TV up to 55" + 1 TV up to 70"': "From $230",
}

export const HOME_INSTALL_LABELS = {
  furniture:      "Furniture Assembly",
  mirror_picture: "Picture / Mirror Hanging",
  shelves_wall:   "Shelves & Wall Installation",
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

  const homeInstallBlock = isHomeInst ? `
    <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;padding:16px 20px;margin-top:20px;">
      <p style="margin:0;font-size:12px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.05em;">
        🔧 Home Installation — Quote Based
      </p>
      <p style="margin:8px 0 0;font-size:15px;font-weight:700;color:#1e3a8a;">${safe(homeInstLbl)}</p>
      ${b.comboDetails ? `<p style="margin:8px 0 0;font-size:13px;color:#1e40af;">${safe(b.comboDetails).replace(/\n/g, "<br>")}</p>` : ""}
      <p style="margin:10px 0 0;font-size:12px;color:#3b82f6;">
        We will review this request and contact you with pricing before the appointment.
      </p>
    </div>
  ` : ""

  const frameTvBlock = anyFrameTv ? `
    <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:14px 18px;margin-top:12px;">
      <p style="margin:0;font-size:12px;font-weight:700;color:#e50914;text-transform:uppercase;letter-spacing:.05em;">
        🖼️ Frame TV — Quote Based
      </p>
      <p style="margin:6px 0 0;font-size:13px;color:#7f1d1d;">
        Frame TV installations are quoted individually based on the measurements, the mount and the
        wall. One of our sales representatives will confirm your exact price before the appointment.
      </p>
    </div>
  ` : ""

  const promoPriceBlock = hasPromo ? `
    <div style="background:#fff5f5;border:2px solid #e50914;border-radius:10px;padding:16px 20px;margin-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="margin:0;font-size:12px;font-weight:700;color:#e50914;text-transform:uppercase;letter-spacing:.05em;">Package Price</p>
          <p style="margin:4px 0 0;font-size:13px;color:#555;">${safe(b.selectedPromo)}</p>
        </div>
        <span style="font-size:28px;font-weight:900;color:#e50914;">${promoPrice}</span>
      </div>
      ${cableQty > 0 ? `<p style="margin:10px 0 0;font-size:13px;color:#e50914;font-weight:600;">🔌 + Cable Concealment ×${cableQty}: +$${cableTotal}</p>` : ""}
    </div>
  ` : ""

  const couponBlock = (b.couponCode && b.appliedCouponLabel && !b.customQuote) ? `
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px 18px;margin-top:12px;">
      ${!couponHidden ? `<p style="margin:0;font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:.05em;">Coupon Applied — ${safe(b.couponCode)}</p>` : ""}
      <p style="margin:${couponHidden ? "0" : "6px"} 0 0;font-size:14px;color:#166534;font-weight:600;">${safe(b.appliedCouponLabel)}</p>
      ${b.couponComment ? `<p style="margin:8px 0 0;font-size:13px;color:#166534;font-style:italic;">"${safe(b.couponComment)}"</p>` : ""}
    </div>
  ` : ""

  const customQuoteBlock = b.customQuote ? `
    <div style="background:#fff5f5;border:2px solid #e50914;border-radius:10px;padding:16px 20px;margin-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="margin:0;font-size:12px;font-weight:700;color:#e50914;text-transform:uppercase;letter-spacing:.05em;">Installation Price</p>
          ${b.customMode === "sized" && b.customTvSize ? `<p style="margin:4px 0 0;font-size:13px;color:#555;">${safe(b.customTvSize)}${b.customTvQty ? ` × ${b.customTvQty}` : ""}</p>` : ""}
        </div>
        ${customPriceNum != null ? `<span style="font-size:28px;font-weight:900;color:#e50914;">$${customPriceNum.toFixed(2)}</span>` : ""}
      </div>
      ${b.couponComment ? `<p style="margin:10px 0 0;font-size:13px;color:#78350f;font-style:italic;">"${safe(b.couponComment)}"</p>` : ""}
    </div>
  ` : ""

  const moreTvsBlock = b.moreTvs ? `
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:14px 18px;margin-top:12px;">
      <p style="margin:0;font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.05em;">3+ TVs — Custom Quote</p>
      <p style="margin:6px 0 0;font-size:13px;color:#78350f;">Pricing varies for 3 or more TVs. We will contact you to confirm the total before the appointment.</p>
      ${b.moreTvsComment ? `<p style="margin:8px 0 0;font-size:13px;color:#78350f;font-style:italic;">"${safe(b.moreTvsComment)}"</p>` : ""}
    </div>
  ` : ""

  const bundleBlock = (isCombo && b.comboDetails) ? `
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:14px 18px;margin-top:12px;">
      <p style="margin:0;font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:.05em;">Your Installation</p>
      <p style="margin:8px 0 0;font-size:13px;color:#78350f;">${safe(b.comboDetails).replace(/\n/g, "<br>")}</p>
    </div>
  ` : ""

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

  const html = `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <h2 style="color:#e50914;border-bottom:3px solid #e50914;padding-bottom:12px;">
            📺 Your Booking is Confirmed!
          </h2>

          <p style="color:#444;margin-top:16px;font-size:15px;">
            Hi ${safe(firstName)},
          </p>
          <p style="color:#444;font-size:15px;">
            Thank you for choosing <strong>PrimeTvNashville</strong>! We've received your booking request and will contact you shortly to confirm your appointment.
          </p>

          <div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:20px;margin-top:24px;">
            <h4 style="margin:0 0 14px;color:#222;font-size:15px;">Booking Summary</h4>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              ${crow("Date", date)}
              ${crow("Time Window", timePreference)}
              ${crow("Address", fullAddress)}
              ${isHomeInst
                ? crow("Service", `${safe(homeInstLbl)} — quote based`)
                : isCombo
                ? crow("Service", "Custom Installation")
                : hasPromo
                ? crow("Package", b.selectedPromo)
                : b.moreTvs
                ? crow("TVs", "3+ TVs — custom quote")
                : crow("TVs", `${tvList.length} TV${tvList.length !== 1 ? "s" : ""}`)
              }
              ${cableQty > 0 && !isCombo && !isHomeInst ? crow("Add-on", `Cable Concealment ×${cableQty} (+$${cableTotal})`) : ""}
            </table>
          </div>

          ${promoPriceBlock}
          ${customQuoteBlock}
          ${couponBlock}
          ${moreTvsBlock}
          ${bundleBlock}
          ${isHomeInst ? homeInstallBlock : ""}
          ${frameTvBlock}

          <p style="margin-top:24px;color:#444;font-size:14px;">
            Questions? Call us at <strong>(615) 669-0251</strong> or reply to this email.
          </p>

          <!-- Liability notice -->
          <div style="margin-top:28px;border:2px solid #e50914;border-radius:12px;padding:18px 20px;background:#fff5f5;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#e50914;text-transform:uppercase;letter-spacing:.05em;">
              ⚠️ Important — Wall Liability Notice
            </p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;line-height:1.6;">
              <strong>For all TV mounting and hidden cable concealment services:</strong> The customer is solely responsible for verifying that there are no electrical wires, water pipes, gas lines, or any other obstructions inside the wall before installation. PrimeTvNashville cannot see inside walls and is <strong>not responsible</strong> for any damage to electrical wiring, plumbing, gas lines, or any other in-wall infrastructure during the installation process.
            </p>
            <p style="margin:0;font-size:13px;color:#555;">
              By booking this service, you acknowledge and accept these conditions. Please read our full
              <a href="https://www.primetvnashville.com/terms" style="color:#e50914;font-weight:600;">Terms &amp; Conditions</a>
              for complete details.
            </p>
          </div>

          <div style="margin-top:24px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#aaa;">
            PrimeTvNashville — Expert TV Mounting in Nashville, TN ·
            <a href="https://www.primetvnashville.com/terms" style="color:#aaa;">Terms &amp; Conditions</a>
          </div>
        </div>
      `

  return {
    subject: "Booking Confirmed — PrimeTvNashville",
    html,
    attachments: ics
      ? [{ filename: "appointment.ics", content: ics, contentType: "text/calendar; method=REQUEST; charset=utf-8" }]
      : [],
  }
}
