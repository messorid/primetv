// ─────────────────────────────────────────────────────────────────────────────
// A booking the office creates from the admin panel, phone bookings and repeat
// customers included.
//
// Unlike the old quick-add, this is a real booking: the customer's details are
// required, the customer always gets the same confirmation email the public
// form sends, and the agreed total travels with it. Two things stay with the
// crew only: the instructions (stored in `notes`, which already reaches the
// installer's work order and jobs page) and the job photos. Neither is ever
// handed to buildClientEmail.
// ─────────────────────────────────────────────────────────────────────────────

import { isValidEmail } from "./formValidation.js"

const MODES = ["standard", "promo", "homeinstall"]

const text = v => String(v ?? "").trim()

// Turns the admin form into the values to store, or { error } naming every
// field still missing, so the office fixes them in one pass.
export function adminBookingFrom(body = {}) {
  const a = body.address || {}
  const address = {
    street: text(a.street), apt: text(a.apt), city: text(a.city), state: text(a.state), zip: text(a.zip),
  }

  const missing = [
    ["First name", body.firstName], ["Last name", body.lastName],
    ["Phone", body.phone], ["Email", body.email],
    ["Street", address.street], ["City", address.city], ["State", address.state], ["ZIP", address.zip],
  ].filter(([, v]) => !text(v)).map(([label]) => label)
  if (missing.length) return { error: `Required: ${missing.join(", ")}` }
  if (!isValidEmail(text(body.email))) return { error: "That email address doesn't look right" }

  let jobTotal = null
  if (text(body.jobTotal) !== "") {
    jobTotal = Number(text(body.jobTotal).replace(/[$,]/g, ""))
    if (!Number.isFinite(jobTotal) || jobTotal < 0) return { error: "The total must be a positive amount" }
    jobTotal = Math.round(jobTotal * 100) / 100
  }

  const mode = MODES.includes(body.bookingMode) ? body.bookingMode : "standard"
  const tvs = mode === "standard" && !body.moreTvs && Array.isArray(body.tvs) ? body.tvs : []

  return {
    values: {
      firstName: text(body.firstName), lastName: text(body.lastName),
      email: text(body.email), phone: text(body.phone),
      date: text(body.date), timePref: text(body.timePref) || "Flexible",
      address,
      payment: text(body.payment), referral: text(body.referral) || null,
      bookingMode: mode,
      promo: mode === "promo" ? text(body.promo) || null : null,
      homeInstallService: mode === "homeinstall" ? text(body.homeInstallService) || "other" : "",
      tvs,
      moreTvs: mode === "standard" && !!body.moreTvs,
      moreTvsComment: mode === "standard" && body.moreTvs ? text(body.moreTvsComment) || null : null,
      cableConcealment: mode === "homeinstall" ? 0 : Math.max(0, Math.min(10, parseInt(body.cableConcealment) || 0)),
      jobDescription: mode === "homeinstall" ? text(body.jobDescription) || null : null,
      notes: text(body.notes) || null,
      jobTotal,
    },
  }
}
