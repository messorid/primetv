// ─────────────────────────────────────────────────────────────────────────────
// JOB CLOSEOUT — the page the installer hands the customer at the end of a job:
// what was done, photos of it, an optional tip, and the customer's signature
// confirming the work was done well.
//
// Each booking gets one closeout, reached through /job/<token>. The token is
// the only key — no login — so it is long and random (144 bits), the page is
// kept out of search engines and analytics, and once signed the record is
// read-only.
//
// The rules (what counts as a valid sign-off, how the work is summarised) are
// plain functions here so they can be tested without a database.
// ─────────────────────────────────────────────────────────────────────────────

import { randomBytes } from "node:crypto"
import { BRAND } from "./emailLayout.js"
import { HOME_INSTALL_LABELS } from "./clientEmail.js"
import { ensureCrewTable, getCrewFor, crewOrLegacy } from "./crew.js"
export * from "./closeoutRules.js"

// Links in emails always point at the live site. SITE_URL overrides it for a
// local test so links open the local server instead.
export function closeoutUrl(token) {
  return `${process.env.SITE_URL || BRAND.site}/job/${token}`
}

// 18 random bytes → 24 URL-safe characters.
export function newToken() {
  return randomBytes(18).toString("base64url")
}

export const isToken = t => typeof t === "string" && /^[A-Za-z0-9_-]{20,64}$/.test(t)

// What the customer is signing for, as plain lines, from the booking row.
export function workItemsOf(b) {
  const items = []
  if (b.booking_mode === "homeinstall") {
    items.push(HOME_INSTALL_LABELS[b.home_install_service] || b.home_install_service || "Home installation")
  }
  if (b.promo) items.push(`Package: ${b.promo}`)
  if (b.custom_quote && b.custom_tv_size) {
    items.push(`TV mounting: ${b.custom_tv_size}${b.custom_tv_qty ? ` × ${b.custom_tv_qty}` : ""}`)
  }
  const tvs = Array.isArray(b.tvs) ? b.tvs : []
  tvs.forEach((tv, i) => {
    // Sizes are stored both as "55" and as '43" – 55"'; add the inch mark only
    // where it is missing.
    const raw = String(tv?.exactSize || tv?.size || "").trim()
    const size = raw ? (raw.includes('"') ? raw : `${raw}"`) : ""
    const kind = tv?.model === "frame" ? "Frame TV" : "TV"
    const wall = tv?.wallType ? ` on ${String(tv.wallType).replace(/\s*\(standard\)/i, "").toLowerCase()}` : ""
    items.push(`${tvs.length > 1 ? `TV ${i + 1}: ` : ""}${size ? `${size} ` : ""}${kind} mounted${wall}`.trim())
  })
  if (b.more_tvs) items.push("Additional TVs mounted")
  const cable = parseInt(b.cable_concealment) || 0
  if (cable > 0) items.push(`In-wall cable concealment × ${cable}`)
  if (b.booking_mode === "bundle" && b.combo_details) items.push(String(b.combo_details).trim())
  return items.length ? items : ["Installation service"]
}

// ── Database ────────────────────────────────────────────────────────────────

export async function ensureCloseoutTables(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS job_closeouts (
      booking_id   UUID PRIMARY KEY,
      token        TEXT UNIQUE NOT NULL,
      work_items   JSONB,
      notes        TEXT,
      tip_amount   NUMERIC(10,2),
      tip_method   TEXT,
      signer_name  TEXT,
      signature    TEXT,
      signed_at    TIMESTAMPTZ,
      signed_ip    TEXT,
      signed_agent TEXT,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS closeout_photos (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID NOT NULL,
      data_url   TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS closeout_photos_booking_id_idx ON closeout_photos (booking_id)`
}

// The booking's closeout token, created the first time anyone asks for it.
export async function closeoutTokenFor(sql, bookingId) {
  await ensureCloseoutTables(sql)
  await sql`
    INSERT INTO job_closeouts (booking_id, token) VALUES (${bookingId}, ${newToken()})
    ON CONFLICT (booking_id) DO NOTHING
  `
  const [row] = await sql`SELECT token FROM job_closeouts WHERE booking_id = ${bookingId}`
  return row?.token || null
}

// Everything the page needs, by token. Null when the token matches nothing.
export async function loadCloseout(sql, token) {
  if (!isToken(token)) return null
  await ensureCloseoutTables(sql)
  const [c] = await sql`SELECT * FROM job_closeouts WHERE token = ${token}`
  if (!c) return null
  const [b] = await sql`SELECT * FROM bookings WHERE id = ${c.booking_id}`
  if (!b) return null
  const photos = await sql`
    SELECT id FROM closeout_photos WHERE booking_id = ${c.booking_id} ORDER BY created_at ASC
  `
  return { closeout: c, booking: b, photoIds: photos.map(p => p.id) }
}

// The public, page-safe view of a closeout: no address, email or phone, since
// anyone holding the link can read it.
export function publicView({ closeout: c, booking: b, photoIds }, crewNames = []) {
  return {
    token:        c.token,
    customerName: `${b.first_name || ""} ${b.last_name || ""}`.trim(),
    date:         b.date || "",
    time:         b.time_pref || "",
    installers:   crewNames,
    cancelled:    b.status === "cancelled",
    workItems:    Array.isArray(c.work_items) && c.work_items.length ? c.work_items : workItemsOf(b),
    photos:       photoIds.map(id => ({ id, url: `/api/job/${c.token}/photos/${id}` })),
    signed: c.signed_at ? {
      at:         new Date(c.signed_at).toISOString(),
      name:       c.signer_name,
      tip:        c.tip_amount == null ? 0 : Number(c.tip_amount),
      tipMethod:  c.tip_method,
      notes:      c.notes || "",
      signatureUrl: `/api/job/${c.token}/signature`,
    } : null,
  }
}

// Turns a stored data URL back into bytes for an image response or an email
// attachment.
export function decodeDataUrl(dataUrl) {
  const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/s.exec(String(dataUrl || ""))
  if (!m) return null
  return { mime: m[1], buffer: Buffer.from(m[2], "base64") }
}

// Names of everyone on the job, lead first; falls back to the single
// installer on bookings made before crews existed.
export async function crewFor(sql, booking) {
  await ensureCrewTable(sql)
  const byBooking = await getCrewFor(sql, [booking.id])
  return crewOrLegacy(byBooking.get(booking.id), booking)
}
