// ─────────────────────────────────────────────────────────────────────────────
// CREW PAGE — each installer's own page, /crew/<token>: their jobs for today,
// the coming weeks and the past week, with directions, the customer's phone,
// the work, and the job closeout one tap away.
//
// Like the closeout, the link is the only key: long and random, kept out of
// search engines and analytics, and the office can replace it at any time
// (the old link then stops working).
// ─────────────────────────────────────────────────────────────────────────────

import { BRAND } from "./emailLayout.js"
import { newToken, isToken, closeoutTokenFor, workItemsOf, ensureCloseoutTables } from "./closeout.js"
import { ensureCrewTable, getCrewFor, crewOrLegacy } from "./crew.js"

export const PAST_DAYS = 7
export const AHEAD_DAYS = 30

export const crewPageUrl = token => `${process.env.SITE_URL || BRAND.site}/crew/${token}`

// Today's date in Nashville, as "YYYY-MM-DD".
export function businessToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(now)
}

export function shiftDay(iso, n) {
  const d = new Date(iso + "T12:00:00Z")
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

async function ensurePortalColumn(sql) {
  await sql`ALTER TABLE installers ADD COLUMN IF NOT EXISTS portal_token TEXT`
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS installers_portal_token_idx ON installers (portal_token)`
}

// The installer's link token, created on first use; `rotate` replaces it.
export async function portalTokenFor(sql, installerId, { rotate = false } = {}) {
  await ensurePortalColumn(sql)
  if (rotate) {
    const [r] = await sql`UPDATE installers SET portal_token = ${newToken()} WHERE id = ${installerId} RETURNING portal_token`
    return r?.portal_token || null
  }
  await sql`UPDATE installers SET portal_token = ${newToken()} WHERE id = ${installerId} AND portal_token IS NULL`
  const [r] = await sql`SELECT portal_token FROM installers WHERE id = ${installerId}`
  return r?.portal_token || null
}

// The token for whoever has this email, for the link in the work order.
export async function portalTokenForEmail(sql, email) {
  if (!email) return null
  await ensurePortalColumn(sql)
  const [r] = await sql`SELECT id FROM installers WHERE lower(email) = lower(${email}) AND active = TRUE LIMIT 1`
  return r ? portalTokenFor(sql, r.id) : null
}

const minutes = t => {
  const s = String(t || "")
  const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(s)
  if (m) return ((Number(m[1]) % 12) + (/pm/i.test(m[3]) ? 12 : 0)) * 60 + Number(m[2] || 0)
  if (/morning/i.test(s)) return 480
  if (/afternoon/i.test(s)) return 720
  if (/evening/i.test(s)) return 1020
  return 1440
}

// Everything the page shows, by token. Null when the token matches no active
// installer.
export async function loadCrewPage(sql, token, today = businessToday()) {
  if (!isToken(token)) return null
  await ensurePortalColumn(sql)
  const [inst] = await sql`SELECT id, name FROM installers WHERE portal_token = ${token} AND active = TRUE`
  if (!inst) return null

  await ensureCrewTable(sql)
  await ensureCloseoutTables(sql)
  const from = shiftDay(today, -PAST_DAYS), to = shiftDay(today, AHEAD_DAYS)
  const rows = await sql`
    SELECT * FROM bookings b
    WHERE b.status <> 'cancelled' AND b.date >= ${from} AND b.date <= ${to}
      AND (b.installer_id = ${inst.id}
           OR b.id IN (SELECT booking_id FROM booking_crew WHERE installer_id = ${inst.id}))
  `
  const crewBy = await getCrewFor(sql, rows.map(r => r.id))
  const signed = rows.length ? await sql`
    SELECT booking_id, signed_at FROM job_closeouts WHERE booking_id = ANY(${rows.map(r => r.id)}::uuid[])
  ` : []
  const signedBy = new Map(signed.map(s => [s.booking_id, s.signed_at]))

  const jobs = []
  for (const b of rows) {
    const crew = crewOrLegacy(crewBy.get(b.id), b).map(m => m.installerName).filter(Boolean)
    const a = b.address || {}
    jobs.push({
      id: b.id,
      date: b.date,
      time: b.time_pref || "",
      status: b.status,
      customer: `${b.first_name || ""} ${b.last_name || ""}`.trim(),
      phone: b.phone || "",
      address: [a.street, a.apt, a.city, a.state, a.zip].filter(Boolean).join(", "),
      work: workItemsOf(b),
      partners: crew.filter(n => n !== inst.name),
      notes: b.notes || "",
      customerNotes: [b.combo_details, b.more_tvs_comment].filter(Boolean).join("\n"),
      closeoutPath: `/job/${await closeoutTokenFor(sql, b.id)}`,
      signed: !!signedBy.get(b.id),
    })
  }
  jobs.sort((x, y) => x.date.localeCompare(y.date) || minutes(x.time) - minutes(y.time))

  return {
    name: inst.name,
    today,
    todayJobs: jobs.filter(j => j.date === today),
    upcoming: jobs.filter(j => j.date > today),
    recent: jobs.filter(j => j.date < today).reverse(),
  }
}
