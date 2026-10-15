export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { getCrewFor, crewOrLegacy } from "../../lib/crew.js"
import { ensureCloseoutTables } from "../../lib/closeout.js"

function db() { return neon(process.env.DATABASE_URL) }

const n = v => (v == null ? 0 : Number(v) || 0)

// The business day a job counts toward, in Nashville time. Taking the UTC date
// off completed_at files an evening job on the following day — a job finished
// at 8pm Central is already tomorrow in UTC — which silently moved earnings
// onto the wrong day. Postgres does the conversion so DST is handled properly.
const BUSINESS_TZ = "America/Chicago"

function earnedOn(row) {
  return row.earned_date || String(row.date || "").slice(0, 10)
}

// Pay weeks run Sunday to Saturday, like "This week" on the bookings page.
function weekOf(iso) {
  const d = new Date(`${iso}T12:00:00Z`)
  if (isNaN(d)) return { start: "", end: "" }
  d.setUTCDate(d.getUTCDate() - d.getUTCDay())
  const start = d.toISOString().slice(0, 10)
  d.setUTCDate(d.getUTCDate() + 6)
  return { start, end: d.toISOString().slice(0, 10) }
}

const r2 = v => Math.round(v * 100) / 100

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
             profit_type, profit_value, address,
             COALESCE(
               (completed_at AT TIME ZONE ${BUSINESS_TZ})::date::text,
               NULLIF(date, ''),
               (created_at AT TIME ZONE ${BUSINESS_TZ})::date::text
             ) AS earned_date
      FROM bookings
      WHERE status = 'completed'
    `

    // Crew rows say who actually did each job and how the pay divided. Jobs
    // from before crews existed fall back to their single installer.
    const crewByBooking = await getCrewFor(sql, rows.map(r => r.id))

    // Tips the customer added when signing the job closeout. They are for the
    // crew, so they sit beside the pay rather than inside revenue or profit.
    let tipBy = new Map()
    try {
      await ensureCloseoutTables(sql)
      const tipRows = rows.length ? await sql`
        SELECT booking_id, tip_amount, tip_method FROM job_closeouts
        WHERE signed_at IS NOT NULL AND tip_amount > 0 AND booking_id = ANY(${rows.map(r => r.id)}::uuid[])
      ` : []
      tipBy = new Map(tipRows.map(t => [t.booking_id, { amount: n(t.tip_amount), method: t.tip_method || "Other" }]))
    } catch (tipErr) {
      console.error("earnings: could not load tips", tipErr)
    }
    const tipOf = r => tipBy.get(r.id) || { amount: 0, method: null }
    const addTip = (acc, amount, method) => {
      acc.tips += amount
      if (method === "Cash") acc.tipsCash += amount
      else if (method === "Zelle") acc.tipsZelle += amount
      else acc.tipsOther += amount
    }

    const inRange = rows.filter(r => {
      const d = earnedOn(r)
      if (from && d < from) return false
      if (to   && d > to)   return false
      return true
    })

    const blank = () => ({
      jobs: 0, revenue: 0, materials: 0, installerPay: 0, companyProfit: 0,
      tips: 0, tipsCash: 0, tipsZelle: 0, tipsOther: 0,
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
    const totals = inRange.reduce((a, r) => { add(a, r); const t = tipOf(r); addTip(a, t.amount, t.method); return a }, blank())

    // ── Per installer ────────────────────────────────────────────────────────
    // Each person is credited their own share, so a two-person job counts once
    // for each of them with the pay divided rather than double-counted.
    const byInstaller = new Map()
    const byWeek = new Map()
    const weekRow = (r, key, installerId, name) => {
      const w = weekOf(earnedOn(r))
      if (!byWeek.has(w.start)) byWeek.set(w.start, { ...w, people: new Map() })
      const people = byWeek.get(w.start).people
      if (!people.has(key)) people.set(key, { key, installerId, name, jobs: 0, pay: 0, tips: 0, tipsCash: 0, tipsZelle: 0, tipsOther: 0 })
      return people.get(key)
    }
    for (const r of inRange) {
      const crew = crewOrLegacy(crewByBooking.get(r.id), r)
      const tip = tipOf(r)

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
        addTip(u, tip.amount, tip.method)
        const w = weekRow(r, key, null, "Unassigned")
        w.jobs += 1; w.pay += n(r.amount_paid_workers); addTip(w, tip.amount, tip.method)
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
        // A tip is for whoever did the job, so it is shared evenly.
        const tipShare = tip.amount / crew.length
        addTip(acc, tipShare, tip.method)

        const w = weekRow(r, key, m.installerId || null, name)
        w.jobs += 1; w.pay += pay; addTip(w, tipShare, tip.method)
      }
    }
    const installers = [...byInstaller.values()]
      .map(i => ({
        ...i,
        revenue:       Math.round(i.revenue * 100) / 100,
        materials:     Math.round(i.materials * 100) / 100,
        installerPay:  Math.round(i.installerPay * 100) / 100,
        companyProfit: Math.round(i.companyProfit * 100) / 100,
        tips:          r2(i.tips),
        tipsCash:      r2(i.tipsCash),
        tipsZelle:     r2(i.tipsZelle),
        tipsOther:     r2(i.tipsOther),
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
        tip: tipOf(r).amount,
        tipMethod: tipOf(r).method,
        profitType: r.profit_type || "",
        profitValue: r.profit_value == null ? null : Number(r.profit_value),
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1))

    // ── Pay weeks: what each person earned, Sunday to Saturday ───────────────
    const weeks = [...byWeek.values()]
      .map(w => {
        const people = [...w.people.values()]
          .map(p => ({
            ...p, pay: r2(p.pay), tips: r2(p.tips), tipsCash: r2(p.tipsCash), tipsZelle: r2(p.tipsZelle),
            tipsOther: r2(p.tipsOther), total: r2(p.pay + p.tips),
          }))
          .sort((a, b) => b.total - a.total)
        return {
          start: w.start, end: w.end, people,
          pay: r2(people.reduce((s, p) => s + p.pay, 0)),
          tips: r2(people.reduce((s, p) => s + p.tips, 0)),
          total: r2(people.reduce((s, p) => s + p.total, 0)),
        }
      })
      .sort((a, b) => (a.start < b.start ? 1 : -1))

    return Response.json({
      ok: true,
      range: { from, to },
      weeks,
      totals: {
        ...totals,
        margin: totals.revenue > 0 ? (totals.companyProfit / totals.revenue) * 100 : null,
        avgPerJob: totals.jobs ? totals.revenue / totals.jobs : 0,
        tips: r2(totals.tips), tipsCash: r2(totals.tipsCash), tipsZelle: r2(totals.tipsZelle), tipsOther: r2(totals.tipsOther),
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
