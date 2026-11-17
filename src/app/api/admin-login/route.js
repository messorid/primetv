export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Sign in to the admin. The owner signs in with ADMIN_EMAIL / ADMIN_PASSWORD
// from the environment; staff (sellers) with their own email and password
// from the staff_users table. Either way the session cookie is issued here,
// httpOnly and signed, with the role inside it.

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ADMIN_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/adminSession"
import { ensureStaffTable, verifyPassword } from "@/app/lib/staff.js"

const invalid = () => Response.json({ ok: false, error: "Invalid credentials" }, { status: 401 })

async function issue(session) {
  const token = await createSessionToken(session)
  if (!token) return Response.json({ ok: false, error: "Server not configured" }, { status: 500 })
  const response = NextResponse.json({ ok: true, role: session.role })
  response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions())
  return response
}

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    const typedEmail = String(email || "").trim()
    if (!typedEmail || !password) return invalid()

    const validEmail    = process.env.ADMIN_EMAIL
    const validPassword = process.env.ADMIN_PASSWORD
    if (!validEmail || !validPassword) {
      return Response.json({ ok: false, error: "Server not configured" }, { status: 500 })
    }

    if (email === validEmail && password === validPassword) return issue({ role: "admin" })

    // A staff member.
    const sql = neon(process.env.DATABASE_URL)
    await ensureStaffTable(sql)
    const [u] = await sql`
      SELECT id, role, password_hash FROM staff_users
      WHERE lower(email) = lower(${typedEmail}) AND active
    `
    if (!u || !(await verifyPassword(password, u.password_hash))) return invalid()
    await sql`UPDATE staff_users SET last_login_at = NOW() WHERE id = ${u.id}`
    return issue({ role: u.role, uid: u.id })
  } catch (err) {
    console.error("admin login error", err)
    return Response.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
