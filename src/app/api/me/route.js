export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/me — who is signed in, so the admin shows only what they can use:
// { ok, role: "admin" | "seller", name }. The server checks every request on
// its own; this is for the screens.

import { neon } from "@neondatabase/serverless"
import { getSession, unauthorized } from "@/lib/adminSession"
import { ensureStaffTable } from "@/app/lib/staff.js"

export async function GET(request) {
  const session = await getSession(request)
  if (!session) return unauthorized()
  if (session.role === "admin") return Response.json({ ok: true, role: "admin", name: "Owner" })
  try {
    const sql = neon(process.env.DATABASE_URL)
    await ensureStaffTable(sql)
    const [u] = await sql`SELECT name, active FROM staff_users WHERE id = ${session.uid}`
    if (!u || !u.active) return unauthorized()
    return Response.json({ ok: true, role: session.role, name: u.name })
  } catch (err) {
    console.error("me error", err)
    return Response.json({ ok: true, role: session.role, name: "" })
  }
}
