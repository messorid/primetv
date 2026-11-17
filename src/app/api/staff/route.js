export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// The owner manages the team here. Owner only.
//   GET                          everyone, without password hashes
//   POST  { name, email, password, whatsapp, notifyBookings, notifyQuotes }
//   PATCH { id, ...any of: name, email, whatsapp, notifyBookings, notifyQuotes, active, password }

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { ensureStaffTable, hashPassword, passwordProblem, whatsappDigits, toStaff } from "@/app/lib/staff.js"

const bad = (error, status = 400) => Response.json({ ok: false, error }, { status })
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureStaffTable(sql)
    const rows = await sql`SELECT * FROM staff_users ORDER BY active DESC, name`
    return Response.json({ ok: true, staff: rows.map(toStaff) })
  } catch (err) {
    console.error("staff GET error", err)
    return bad("Could not load the team.", 500)
  }
}

export async function POST(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  let b
  try { b = await request.json() } catch { return bad("Bad request") }
  const name = String(b?.name || "").trim().slice(0, 80)
  const email = String(b?.email || "").trim().toLowerCase()
  if (!name) return bad("Enter a name.")
  if (!validEmail(email)) return bad("Enter a valid email.")
  if (email === String(process.env.ADMIN_EMAIL || "").trim().toLowerCase()) return bad("That's the owner's email.")
  const problem = passwordProblem(b?.password)
  if (problem) return bad(problem)
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureStaffTable(sql)
    const [dup] = await sql`SELECT id FROM staff_users WHERE lower(email) = ${email}`
    if (dup) return bad("Someone on the team already uses that email.", 409)
    const [row] = await sql`
      INSERT INTO staff_users (name, email, role, password_hash, whatsapp, notify_bookings, notify_quotes)
      VALUES (${name}, ${email}, 'seller', ${await hashPassword(b.password)}, ${whatsappDigits(b?.whatsapp) || null},
              ${b?.notifyBookings !== false}, ${b?.notifyQuotes !== false})
      RETURNING *
    `
    return Response.json({ ok: true, member: toStaff(row) })
  } catch (err) {
    console.error("staff POST error", err)
    return bad("Could not save.", 500)
  }
}

export async function PATCH(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  let b
  try { b = await request.json() } catch { return bad("Bad request") }
  if (!b?.id) return bad("id required")
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureStaffTable(sql)
    const [cur] = await sql`SELECT * FROM staff_users WHERE id = ${b.id}`
    if (!cur) return bad("Not found", 404)

    const name = "name" in b ? String(b.name || "").trim().slice(0, 80) : cur.name
    const email = "email" in b ? String(b.email || "").trim().toLowerCase() : cur.email
    if (!name) return bad("Enter a name.")
    if (!validEmail(email)) return bad("Enter a valid email.")
    if (email !== cur.email) {
      const [dup] = await sql`SELECT id FROM staff_users WHERE lower(email) = ${email} AND id <> ${b.id}`
      if (dup) return bad("Someone on the team already uses that email.", 409)
    }
    let hash = cur.password_hash
    if (b.password) {
      const problem = passwordProblem(b.password)
      if (problem) return bad(problem)
      hash = await hashPassword(b.password)
    }
    const [row] = await sql`
      UPDATE staff_users SET
        name = ${name}, email = ${email}, password_hash = ${hash},
        whatsapp = ${"whatsapp" in b ? (whatsappDigits(b.whatsapp) || null) : cur.whatsapp},
        notify_bookings = ${"notifyBookings" in b ? !!b.notifyBookings : cur.notify_bookings},
        notify_quotes = ${"notifyQuotes" in b ? !!b.notifyQuotes : cur.notify_quotes},
        active = ${"active" in b ? !!b.active : cur.active}
      WHERE id = ${b.id}
      RETURNING *
    `
    return Response.json({ ok: true, member: toStaff(row) })
  } catch (err) {
    console.error("staff PATCH error", err)
    return bad("Could not save.", 500)
  }
}
