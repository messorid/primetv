// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP ALERTS — what the owner's phone says for each event, and what an
// installer's says when a job is assigned to them.
//
// Pure functions that return the templates' variables (see whatsapp.js). For
// the owner: what happened, who the customer is, and the few details that tell
// you at a glance whether it needs you now. The emails still carry everything
// else.
//
// Bookings arrive in two shapes, the form's request body and the stored row,
// so both are mapped onto one job summary.
// ─────────────────────────────────────────────────────────────────────────────

import { PROMO_PRICES, HOME_INSTALL_LABELS } from "./clientEmail.js"
import { fullAddressOf } from "./installerEmails.js"

const line = (parts, sep = " · ") =>
  parts.filter(Boolean).map(p => String(p).trim()).filter(Boolean).join(sep)

const tagged = (icon, text) => (text ? `${icon} ${text}` : "")

// "sáb, 25 oct (Morning)", or "Sat, Oct 25 (Morning)" in English. The stored
// date is an ISO day; anything else is shown as it was typed.
export function when(date, time, locale = "es") {
  let day = String(date ?? "").trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    const d = new Date(`${day}T12:00:00`)
    if (!isNaN(d)) day = d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" })
  }
  const t = String(time ?? "").trim()
  if (!day) return t
  return t ? `${day} (${t})` : day
}

// Some legacy sizes were saved with their own inch mark.
const inches = size => (size ? `${String(size).replace(/"+$/, "")}"` : "")

function jobSummary(j) {
  const tvs = Array.isArray(j.tvs) ? j.tvs : []
  const main =
    j.mode === "homeinstall" ? HOME_INSTALL_LABELS[j.homeInstallService] || j.homeInstallService || "Home installation"
    : j.mode === "bundle"    ? "Bundle (custom)"
    : j.promo                ? `Promo ${j.promo} (${PROMO_PRICES[j.promo] || "see quote"})`
    : tvs.length             ? `${tvs.length} TV${tvs.length > 1 ? "s" : ""}: ${tvs.map(tv =>
                                 `${inches(tv?.size) || "?"}${tv?.model === "frame" ? " Frame" : ""}`).join(", ")}`
    : ""
  const cableQty = parseInt(j.cableQty) || 0
  const price = j.customPrice != null && j.customPrice !== "" ? Number(j.customPrice) : NaN

  return line([
    main,
    j.customTvSize && `Trabajo especial ${inches(j.customTvSize)}${j.customTvQty ? ` × ${j.customTvQty}` : ""}`,
    cableQty > 0 && `Ocultar cables ×${cableQty}`,
    j.moreTvs && "3+ TVs (cotizar)",
    Number.isFinite(price) && `Precio especial $${price.toFixed(2)}`,
    j.couponCode && `Cupón ${j.couponCode}`,
  ], " + ")
}

// A booking from the public form, straight from the request body. `saved`
// false means the database refused it, and the email is the only record.
export function bookingAlert(body = {}, { saved = true } = {}) {
  const info = body.info || {}
  const custom = !!body.customQuote
  return {
    kind: saved ? "Nueva reservación" : "Nueva reservación (NO se guardó, revisa el email)",
    customer: line([`${info.firstName || ""} ${info.lastName || ""}`, info.phone]),
    details: line([
      tagged("📅", when(body.date, body.timePreference)),
      tagged("🛠", jobSummary({
        mode: body.bookingMode,
        homeInstallService: body.homeInstallService,
        promo: body.bookingMode === "promo" ? body.selectedPromo : "",
        tvs: body.tvs,
        cableQty: body.cableConcealment,
        moreTvs: body.moreTvs,
        customTvSize: custom && body.customMode === "sized" ? body.customTvSize : "",
        customTvQty: body.customTvQty,
        customPrice: custom ? body.customPrice : null,
        couponCode: body.couponCode,
      })),
      tagged("📍", fullAddressOf(body)),
    ]),
  }
}

const QUOTE_KINDS = {
  quick_quote:        "Nueva cotización",
  installation_quote: "Nueva cotización de instalación",
  contact_form:       "Nuevo mensaje de contacto",
}

// Any quote form, from the lead object the route records (see quoteLeads.js).
export function quoteAlert(lead = {}) {
  return {
    kind: QUOTE_KINDS[lead.source] || "Nueva cotización",
    customer: line([lead.name, lead.phone]),
    details: line([
      tagged("🛠", line([lead.service, lead.tvSize, lead.mountType], ", ")),
      tagged("📅", when(lead.preferredDate, lead.preferredTime)),
      tagged("📍", lead.address || (lead.zip && `ZIP ${lead.zip}`)),
      tagged("💬", lead.notes),
    ]),
  }
}

// The installer's own heads-up when a job is assigned to them: the four
// variables of the installer template (see whatsapp.js), in English like the
// work order email. No prices, since the installer is paid from the split, not
// from what the customer pays. `crewmates` are the others on the same job.
export function installerJobAlert(b = {}, crewmates = []) {
  const tvs = Array.isArray(b.tvs) ? b.tvs : []
  const cableQty = parseInt(b.cable_concealment) || 0
  const others = crewmates.filter(Boolean)

  const job = line([
    b.booking_mode === "homeinstall" &&
      (HOME_INSTALL_LABELS[b.home_install_service] || b.home_install_service || "Home installation"),
    b.booking_mode === "bundle" && "Bundle",
    b.promo && `Package ${b.promo}`,
    b.custom_quote && b.custom_tv_size &&
      `Custom job ${inches(b.custom_tv_size)}${b.custom_tv_qty ? ` × ${b.custom_tv_qty}` : ""}`,
    tvs.length > 0 && `${tvs.length} TV${tvs.length > 1 ? "s" : ""}: ${tvs.map(tv =>
      `${inches(tv?.size) || "?"}${tv?.model === "frame" ? " Frame" : ""}`).join(", ")}`,
    b.more_tvs && "3+ TVs",
    cableQty > 0 && `Cable concealment ×${cableQty}`,
  ], " + ")

  return [
    when(b.date, b.time_pref, "en-US"),
    line([`${b.first_name || ""} ${b.last_name || ""}`, b.phone]),
    fullAddressOf(b),
    line([job, others.length && `👷 With ${others.join(", ")}`]),
  ]
}

// A crew assigned from the admin panel, for the owner. `b` is the stored
// booking row. Not sent for now: the owner turned these off. To bring them back,
// call notifyWhatsApp(assignmentAlert(...)) from the crew PATCH in api/bookings.
export function assignmentAlert(b = {}, installerNames = []) {
  const names = installerNames.filter(Boolean)
  return {
    kind: "Trabajo asignado",
    customer: line([`${b.first_name || ""} ${b.last_name || ""}`, b.phone]),
    details: line([
      tagged("👷", names.join(", ")),
      tagged("📅", when(b.date, b.time_pref)),
      tagged("🛠", jobSummary({
        mode: b.booking_mode,
        homeInstallService: b.home_install_service,
        promo: b.promo,
        tvs: b.tvs,
        cableQty: b.cable_concealment,
        moreTvs: b.more_tvs,
        customTvSize: b.custom_quote ? b.custom_tv_size : "",
        customTvQty: b.custom_tv_qty,
        customPrice: b.custom_quote ? b.custom_price : null,
        couponCode: b.coupon_code,
      })),
      tagged("📍", fullAddressOf(b)),
    ]),
  }
}
