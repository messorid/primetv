export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"

function db() { return neon(process.env.DATABASE_URL) }

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS installers (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      phone      TEXT,
      active     BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  // The installer's default cut, so a split is set once per person instead of
  // retyped on every job. Stored as what the INSTALLER earns, which is how it
  // is agreed with them; the company share is the remainder.
  await sql`ALTER TABLE installers ADD COLUMN IF NOT EXISTS commission_type TEXT DEFAULT 'percent'`
  await sql`ALTER TABLE installers ADD COLUMN IF NOT EXISTS commission_value NUMERIC(10,2) DEFAULT 65`
  // Weight used to divide the worker pay when several installers share a job.
  await sql`ALTER TABLE installers ADD COLUMN IF NOT EXISTS crew_share NUMERIC(6,2) DEFAULT 50`
}

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const sql = db()
    await ensureTable(sql)
    const rows = await sql`SELECT * FROM installers WHERE active = TRUE ORDER BY name`
    return Response.json({ ok: true, installers: rows.map(toInstaller) })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const { name, email, phone } = await request.json()
    const sql = db()
    await ensureTable(sql)
    const [row] = await sql`
      INSERT INTO installers (name, email, phone)
      VALUES (${name}, ${email}, ${phone || ""})
      RETURNING *
    `
    return Response.json({ ok: true, installer: row })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

// Set an installer's default cut.
export async function PATCH(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const { id, commissionType, commissionValue, crewShare } = await request.json()
    if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 })

    const type  = commissionType === "fixed" ? "fixed" : "percent"
    const value = Number(commissionValue)

    if (!Number.isFinite(value) || value < 0) {
      return Response.json({ ok: false, error: "Enter a positive amount" }, { status: 400 })
    }
    if (type === "percent" && value > 100) {
      return Response.json({ ok: false, error: "A percentage cannot exceed 100" }, { status: 400 })
    }

    const sql = db()
    await ensureTable(sql)

    // crewShare is optional; leave it untouched when the caller only changes
    // the company split.
    let share = null
    if (crewShare !== undefined) {
      share = Number(crewShare)
      if (!Number.isFinite(share) || share <= 0) {
        return Response.json({ ok: false, error: "Crew share must be greater than 0" }, { status: 400 })
      }
    }

    const [row] = share === null
      ? await sql`
          UPDATE installers
          SET commission_type = ${type}, commission_value = ${value}
          WHERE id = ${id}
          RETURNING *
        `
      : await sql`
          UPDATE installers
          SET commission_type = ${type}, commission_value = ${value}, crew_share = ${share}
          WHERE id = ${id}
          RETURNING *
        `
    if (!row) return Response.json({ ok: false, error: "Installer not found" }, { status: 404 })
    return Response.json({ ok: true, installer: toInstaller(row) })
  } catch (err) {
    console.error("installers PATCH error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const sql = db()
    await sql`UPDATE installers SET active = FALSE WHERE id = ${id}`
    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ ok: false }, { status: 500 })
  }
}

function toInstaller(row) {
  return {
    ...row,
    commissionType:  row.commission_type || "percent",
    commissionValue: row.commission_value == null ? 65 : Number(row.commission_value),
    crewShare:       row.crew_share == null ? 50 : Number(row.crew_share),
  }
}
