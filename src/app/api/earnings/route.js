export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { getCrewFor, crewOrLegacy } from "../../lib/crew.js"

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

    // Crew rows say who actually did each job and how the pay divided. Jobs
    // from before crews existed fall back to their single installer.
    const crewByBooking = await getCrewFor(sql, rows.map(r => r.id))

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
    // Each person is credited their own share, so a two-person job counts once
    // for each of them with the pay divided rather than double-counted.
    const byInstaller = new Map()
    for (const r of inRange) {
      const crew = crewOrLegacy(crewByBooking.get(r.id), r)

      if (crew.length === 0) {
        const key = "unassigned"
        if (!byInstaller.has(key)) {
          byInstaller.set(key, { key, installerId: null, name: "Unassigned", ...blank() })
        }
        const u = byInstaller.get(key)
        u.jobs += 1
        u.revenue += n(r.amount_charged)
        u.materials += n(r.materials_cost)
        u.installerPay += n(r.amount_paid_workers)
        u.companyProfit += n(r.company_profit)
        continue
      }

      for (const m of crew) {
        const key  = m.installerId || `name:${m.installerName || ""}`
        const name = m.installerName || "Unassigned"
        if (!byInstaller.has(key)) {
          byInstaller.set(key, { key, installerId: m.installerId || null, name, ...blank() })
        }
        const acc   = byInstaller.get(key)
        const frac  = (m.sharePct == null ? 100 : m.sharePct) / 100
        // amount is authoritative once a job is completed; the share is the
        // fallback for a crew assigned but not yet settled.
        const pay   = m.amount != null ? m.amount : n(r.amount_paid_workers) * frac

        acc.jobs          += 1
        acc.revenue       += n(r.amount_charged) * frac
        acc.materials     += n(r.materials_cost) * frac
        acc.installerPay  += pay
        acc.companyProfit += n(r.company_profit) * frac
      }
    }
    const installers = [...byInstaller.values()]
      .map(i => ({
        ...i,
        revenue:       Math.round(i.revenue * 100) / 100,
        materials:     Math.round(i.materials * 100) / 100,
        installerPay:  Math.round(i.installerPay * 100) / 100,
        companyProfit: Math.round(i.companyProfit * 100) / 100,
        avgPerJob:     i.jobs ? i.installerPay / i.jobs : 0,
      }))
      .sort((a, b) => b.installerPay - a.installerPay)

    // ── Per day ──────────────────────────────────────────────────────────────
    const byDay = new Map()
    for (const r of inRange) {
      const d = earnedOn(r)
      if (!byDay.has(d)) byDay.set(d, { date: d, ...blank(), installers: {} })
      const day = byDay.get(d)
      add(day, r)
      for (const m of crewOrLegacy(crewByBooking.get(r.id), r)) {
        const who = m.installerName || "Unassigned"
        const frac = (m.sharePct == null ? 100 : m.sharePct) / 100
        const pay = m.amount != null ? m.amount : n(r.amount_paid_workers) * frac
        day.installers[who] = Math.round((n(day.installers[who]) + pay) * 100) / 100
      }
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
        crew: crewOrLegacy(crewByBooking.get(r.id), r).map(m => ({
          name: m.installerName,
          sharePct: m.sharePct,
          amount: m.amount,
        })),
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
