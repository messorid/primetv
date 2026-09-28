export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { ensureQuoteLeadsTable, mapQuoteLead } from "../../lib/quoteLeads.js"

function db() { return neon(process.env.DATABASE_URL) }

const STATUSES = ["new", "contacted", "quoted", "won", "lost"]

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()

  try {
    const sql = db()
    await ensureQuoteLeadsTable(sql)
    const rows = await sql`SELECT * FROM quote_leads ORDER BY created_at DESC LIMIT 1000`
    return Response.json({ success: true, leads: rows.map(mapQuoteLead) })
  } catch (err) {
    console.error("quote-leads GET failed", err)
    return Response.json({ success: false, error: "Could not load leads" }, { status: 500 })
  }
}

export async function PATCH(request) {
  if (!(await isAdminRequest(request))) return unauthorized()

  try {
    const { id, status, notes } = await request.json()
    if (!id) return Response.json({ success: false, error: "Missing id" }, { status: 400 })
    if (status !== undefined && !STATUSES.includes(status)) {
      return Response.json({ success: false, error: "Unknown status" }, { status: 400 })
    }

    const sql = db()
    await ensureQuoteLeadsTable(sql)

    const [row] = await sql`
      UPDATE quote_leads
         SET status = COALESCE(${status ?? null}, status),
             notes  = COALESCE(${notes ?? null}, notes)
       WHERE id = ${id}
      RETURNING *
    `
    if (!row) return Response.json({ success: false, error: "Lead not found" }, { status: 404 })
    return Response.json({ success: true, lead: mapQuoteLead(row) })
  } catch (err) {
    console.error("quote-leads PATCH failed", err)
    return Response.json({ success: false, error: "Could not update lead" }, { status: 500 })
  }
}

export async function DELETE(request) {
  if (!(await isAdminRequest(request))) return unauthorized()

  try {
    const id = new URL(request.url).searchParams.get("id")
    if (!id) return Response.json({ success: false, error: "Missing id" }, { status: 400 })

    const sql = db()
    await ensureQuoteLeadsTable(sql)
    await sql`DELETE FROM quote_leads WHERE id = ${id}`
    return Response.json({ success: true })
  } catch (err) {
    console.error("quote-leads DELETE failed", err)
    return Response.json({ success: false, error: "Could not delete lead" }, { status: 500 })
  }
}
