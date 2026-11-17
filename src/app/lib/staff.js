// ─────────────────────────────────────────────────────────────────────────────
// STAFF — people other than the owner who sign in to the admin, and who else
// hears about new bookings and quotes.
//
//   role "seller"  sees and manages bookings, leads and messages, assigns
//                  installers; never sees money or pay, never deletes.
//
// Passwords are stored as scrypt hashes ("scrypt$<salt>$<hash>"), never as
// typed. Node only (node:crypto) — the Edge middleware never imports this.
//
// notify_bookings / notify_quotes: the person gets the office's email for each
// new booking / quote, and the owner's WhatsApp alert at their whatsapp number.
// ─────────────────────────────────────────────────────────────────────────────

import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { neon } from "@neondatabase/serverless"

const scrypt = promisify(scryptCb)
const KEYLEN = 64

export async function ensureStaffTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS staff_users (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name            TEXT NOT NULL,
      email           TEXT NOT NULL,
      role            TEXT NOT NULL DEFAULT 'seller',
      password_hash   TEXT NOT NULL,
      whatsapp        TEXT,
      notify_bookings BOOLEAN NOT NULL DEFAULT TRUE,
      notify_quotes   BOOLEAN NOT NULL DEFAULT TRUE,
      active          BOOLEAN NOT NULL DEFAULT TRUE,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      last_login_at   TIMESTAMPTZ
    )
  `
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS staff_users_email_idx ON staff_users (lower(email))`
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex")
  const hash = await scrypt(String(password), salt, KEYLEN)
  return `scrypt$${salt}$${hash.toString("hex")}`
}

export async function verifyPassword(password, stored) {
  const [kind, salt, hex] = String(stored || "").split("$")
  if (kind !== "scrypt" || !salt || !hex) return false
  const expected = Buffer.from(hex, "hex")
  const got = await scrypt(String(password), salt, expected.length)
  return expected.length === got.length && timingSafeEqual(expected, got)
}

// Rules for a new or reset password.
export function passwordProblem(password) {
  const p = String(password || "")
  if (p.length < 8) return "Use at least 8 characters."
  if (p.length > 200) return "That password is too long."
  return null
}

// Digits only, as the WhatsApp API wants them ("+58 424-552…" → "58424552…").
export const whatsappDigits = v => String(v || "").replace(/\D/g, "")

export const toStaff = r => ({
  id: r.id, name: r.name, email: r.email, role: r.role, whatsapp: r.whatsapp || "",
  notifyBookings: !!r.notify_bookings, notifyQuotes: !!r.notify_quotes, active: !!r.active,
  createdAt: r.created_at, lastLoginAt: r.last_login_at,
})

// Same, opening its own connection, for the public booking and quote routes.
export async function teamToNotify(kind) {
  if (!process.env.DATABASE_URL) return { emails: [], whatsapp: [] }
  return staffNotifyTargets(neon(process.env.DATABASE_URL), kind)
}

// Who else gets told about a new booking or quote: { emails, whatsapp }.
// Never throws — a problem here must not cost a booking or a quote.
export async function staffNotifyTargets(sql, kind) {
  try {
    await ensureStaffTable(sql)
    const rows = kind === "booking"
      ? await sql`SELECT email, whatsapp FROM staff_users WHERE active AND notify_bookings`
      : await sql`SELECT email, whatsapp FROM staff_users WHERE active AND notify_quotes`
    return {
      emails: rows.map(r => String(r.email || "").trim()).filter(Boolean),
      whatsapp: rows.map(r => whatsappDigits(r.whatsapp)).filter(Boolean),
    }
  } catch (err) {
    console.error("staff notify targets failed", err)
    return { emails: [], whatsapp: [] }
  }
}
