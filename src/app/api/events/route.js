export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"

function db() { return neon(process.env.DATABASE_URL) }

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_events (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type       TEXT NOT NULL,
      page       TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function POST(request) {
  try {
    const { type, page } = await request.json()
    if (!type) return Response.json({ ok: false }, { status: 400 })
    const sql = db()
    await ensureTable(sql)
    await sql`INSERT INTO contact_events (type, page) VALUES (${type}, ${page || "/"})`
    return Response.json({ ok: true })
  } catch (err) {
    console.error("events POST error", err)
    return Response.json({ ok: false }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sql = db()
    await ensureTable(sql)
    const rows = await sql`SELECT * FROM contact_events ORDER BY created_at DESC`
    return Response.json({ ok: true, events: rows })
  } catch (err) {
    console.error("events GET error", err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
