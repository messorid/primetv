export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"

function db() { return neon(process.env.DATABASE_URL) }

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS expenses (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category    TEXT DEFAULT 'marketing',
      description TEXT,
      amount      NUMERIC(10,2) NOT NULL,
      date        DATE DEFAULT CURRENT_DATE,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function GET() {
  try {
    const sql = db()
    await ensureTable(sql)
    const rows = await sql`SELECT * FROM expenses ORDER BY date DESC, created_at DESC`
    return Response.json({ ok: true, expenses: rows })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { category, description, amount, date } = await request.json()
    const sql = db()
    await ensureTable(sql)
    const [row] = await sql`
      INSERT INTO expenses (category, description, amount, date)
      VALUES (${category || "marketing"}, ${description || ""}, ${amount}, ${date || new Date().toISOString().split("T")[0]})
      RETURNING *
    `
    return Response.json({ ok: true, expense: row })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const sql = db()
    await sql`DELETE FROM expenses WHERE id = ${id}`
    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
