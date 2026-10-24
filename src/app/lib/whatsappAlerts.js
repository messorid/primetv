// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP ALERTS — what the owner's phone says for each event.
//
// Pure functions that return the template's three variables (see whatsapp.js):
// what happened, who the customer is, and the few details that tell you at a
// glance whether it needs you now. The emails still carry everything else.
//
// Bookings arrive in two shapes, the form's request body and the stored row,
// so both are mapped onto one job summary.
// ─────────────────────────────────────────────────────────────────────────────

import { PROMO_PRICES, HOME_INSTALL_LABELS } from "./clientEmail.js"
import { fullAddressOf } from "./installerEmails.js"

const line = (parts, sep = " · ") =>
  parts.filter(Boolean).map(p => String(p).trim()).filter(Boolean).join(sep)

const tagged = (icon, text) => (text ? `${icon} ${text}` : "")

// "sáb, 25 oct (Morning)". The stored date is an ISO day; anything else is
// shown as it was typed.
export function when(date, time) {
  let day = String(date ?? "").trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    const d = new Date(`${day}T12:00:00`)
    if (!isNaN(d)) day = d.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" })
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

// A crew assigned from the admin panel. `b` is the stored booking row.
// Not sent for now: the owner turned assignment alerts off. To bring them back,
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
