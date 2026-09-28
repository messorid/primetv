export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"

function db() { return neon(process.env.DATABASE_URL) }

const n = v => (v == null ? 0 : Number(v) || 0)

// Which day a job counts toward. completed_at is when the money was actually
// settled, so it wins; the scheduled date is the fallback for older rows that
// predate the completion flow.
function earnedOn(row) {
  if (row.completed_at) return new Date(row.completed_at).toISOString().slice(0, 10)
  if (row.date) return String(row.date).slice(0, 10)
  return new Date(row.created_at).toISOString().slice(0, 10)
}

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()

  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from") || ""   // YYYY-MM-DD inclusive
    const to   = searchParams.get("to")   || ""   // YYYY-MM-DD inclusive

    const sql = db()

    // Only completed work has earnings. A job still pending has no money in it.
    const rows = await sql`
      SELECT id, first_name, last_name, date, completed_at, created_at,
             installer_id, installer_name,
             amount_charged, amount_paid_workers, materials_cost, company_profit,
             profit_type, profit_value, address
      FROM bookings
      WHERE status = 'completed'
    `

    const inRange = rows.filter(r => {
      const d = earnedOn(r)
      if (from && d < from) return false
      if (to   && d > to)   return false
      return true
    })

    const blank = () => ({
      jobs: 0, revenue: 0, materials: 0, installerPay: 0, companyProfit: 0,
    })

    const add = (acc, r) => {
      acc.jobs          += 1
      acc.revenue       += n(r.amount_charged)
      acc.materials     += n(r.materials_cost)
      acc.installerPay  += n(r.amount_paid_workers)
      acc.companyProfit += n(r.company_profit)
      return acc
    }

    // ── Totals ───────────────────────────────────────────────────────────────
    const totals = inRange.reduce((a, r) => add(a, r), blank())

    // ── Per installer ────────────────────────────────────────────────────────
    const byInstaller = new Map()
    for (const r of inRange) {
      const key  = r.installer_id || `name:${r.installer_name || ""}` || "unassigned"
      const name = r.installer_name || "Unassigned"
      if (!byInstaller.has(key)) {
        byInstaller.set(key, { key, installerId: r.installer_id || null, name, ...blank() })
      }
      add(byInstaller.get(key), r)
    }
    const installers = [...byInstaller.values()]
      .map(i => ({ ...i, avgPerJob: i.jobs ? i.installerPay / i.jobs : 0 }))
      .sort((a, b) => b.installerPay - a.installerPay)

    // ── Per day ──────────────────────────────────────────────────────────────
    const byDay = new Map()
    for (const r of inRange) {
      const d = earnedOn(r)
      if (!byDay.has(d)) byDay.set(d, { date: d, ...blank(), installers: {} })
      const day = byDay.get(d)
      add(day, r)
      const who = r.installer_name || "Unassigned"
      day.installers[who] = n(day.installers[who]) + n(r.amount_paid_workers)
    }
    const days = [...byDay.values()].sort((a, b) => (a.date < b.date ? 1 : -1))

    // ── Individual jobs, so a day can be opened up ───────────────────────────
    const jobs = inRange
      .map(r => ({
        id: r.id,
        date: earnedOn(r),
        customer: `${r.first_name || ""} ${r.last_name || ""}`.trim(),
        city: r.address?.city || "",
        installerName: r.installer_name || "Unassigned",
        revenue: n(r.amount_charged),
        materials: n(r.materials_cost),
        installerPay: n(r.amount_paid_workers),
        companyProfit: n(r.company_profit),
        profitType: r.profit_type || "",
        profitValue: r.profit_value == null ? null : Number(r.profit_value),
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1))

    return Response.json({
      ok: true,
      range: { from, to },
      totals: {
        ...totals,
        margin: totals.revenue > 0 ? (totals.companyProfit / totals.revenue) * 100 : null,
        avgPerJob: totals.jobs ? totals.revenue / totals.jobs : 0,
      },
      installers,
      days,
      jobs,
    })
  } catch (err) {
    console.error("earnings GET error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
