"use client"
import { useState, useEffect, useMemo } from "react"

const PERIODS = ["Today", "This Week", "This Month", "This Year", "All Time"]
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function periodStart(period) {
  const now = new Date()
  if (period === "Today") return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (period === "This Week") {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    d.setDate(d.getDate() - d.getDay())
    return d
  }
  if (period === "This Month") return new Date(now.getFullYear(), now.getMonth(), 1)
  if (period === "This Year")  return new Date(now.getFullYear(), 0, 1)
  return new Date(0)
}

export default function ReportePage() {
  const [bookings,   setBookings]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [period,     setPeriod]     = useState("This Year")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo,   setCustomTo]   = useState("")

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res  = await fetch("/api/bookings")
    const data = await res.json()
    if (data.ok) setBookings(data.bookings)
    setLoading(false)
  }

  const usingCustomRange = Boolean(customFrom || customTo)

  const range = useMemo(() => {
    if (usingCustomRange) {
      const start = customFrom ? new Date(customFrom + "T00:00:00") : new Date(0)
      const end   = customTo   ? new Date(customTo   + "T23:59:59") : new Date(8640000000000000)
      return { start, end }
    }
    return { start: periodStart(period), end: new Date(8640000000000000) }
  }, [period, customFrom, customTo, usingCustomRange])

  function selectPeriod(p) {
    setPeriod(p); setCustomFrom(""); setCustomTo("")
  }

  const filtered = useMemo(() => bookings.filter(b => {
    const d = new Date(b.createdAt)
    return d >= range.start && d <= range.end
  }), [bookings, range])

  const rangeLabel = usingCustomRange
    ? `${customFrom || "…"} → ${customTo || "…"}`
    : period

  // ── TV size distribution ─────────────────────────────────────────────────
  const tvSizeCounts = useMemo(() => {
    const map = {}
    filtered.forEach(b => {
      ;(b.tvs || []).forEach(tv => {
        if (!tv.size) return
        const key = `${tv.size}"`
        map[key] = (map[key] || 0) + 1
      })
      if (b.customQuote && b.customMode === "sized" && b.customTvSize) {
        const key = `${b.customTvSize}"`
        map[key] = (map[key] || 0) + (parseInt(b.customTvQty) || 1)
      }
    })
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12)
  }, [filtered])

  // ── Busiest day of week (by request date, calendar order) ───────────────
  const dayOfWeekCounts = useMemo(() => {
    const counts = DOW.map(label => ({ label, value: 0 }))
    filtered.forEach(b => {
      const d = new Date(b.createdAt)
      if (isNaN(d)) return
      counts[d.getDay()].value += 1
    })
    return counts
  }, [filtered])

  // ── Wall type breakdown ──────────────────────────────────────────────────
  const wallTypeCounts = useMemo(() => {
    const map = {}
    filtered.forEach(b => {
      ;(b.tvs || []).forEach(tv => {
        if (!tv.wallType) return
        map[tv.wallType] = (map[tv.wallType] || 0) + 1
      })
    })
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
  }, [filtered])

  const totalTvs = useMemo(() => filtered.reduce((s, b) => {
    const standard = (b.tvs || []).length
    const custom   = b.customQuote && b.customMode === "sized" ? (parseInt(b.customTvQty) || 1) : 0
    return s + standard + custom
  }, 0), [filtered])

  const topSize = tvSizeCounts[0]?.label ?? "—"
  const topDay  = useMemo(() => {
    const best = dayOfWeekCounts.reduce((m, d) => d.value > m.value ? d : m, { label: "—", value: 0 })
    return best.value > 0 ? best.label : "—"
  }, [dayOfWeekCounts])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Reporte</h1>
            <p className="text-sm text-gray-500 mt-0.5">TV sizes, busiest days & job composition</p>
          </div>
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm self-start sm:self-auto overflow-x-auto max-w-full">
            {PERIODS.map(p => (
              <button key={p} onClick={() => selectPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex-none ${
                  !usingCustomRange && period === p ? "bg-[#E50914] text-white" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">From</label>
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
              className="mt-1 block rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-300" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">To</label>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
              className="mt-1 block rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-300" />
          </div>
          {usingCustomRange && (
            <button onClick={() => { setCustomFrom(""); setCustomTo("") }}
              className="text-xs text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-red-50 transition">
              Clear range ×
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-400">Loading…</p>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard label="Bookings"        value={filtered.length} bg="bg-blue-50"   color="text-blue-700" />
            <StatCard label="TVs Mounted"     value={totalTvs}        bg="bg-orange-50" color="text-orange-600" />
            <StatCard label="Top TV Size"     value={topSize}         bg="bg-red-50"    color="text-[#E50914]" />
            <StatCard label="Busiest Day"     value={topDay}          bg="bg-purple-50" color="text-purple-700" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RankedBarChart
              title="TV Sizes"
              subtitle={`Most-mounted sizes — ${rangeLabel}`}
              data={tvSizeCounts}
              hue="#E50914"
              emptyText="No TV size data for this period yet."
            />
            <RankedBarChart
              title="Busiest Day"
              subtitle={`Bookings by day of the week — ${rangeLabel}`}
              data={dayOfWeekCounts}
              hue="#7c3aed"
              sorted={false}
              emptyText="No bookings for this period yet."
            />
            <RankedBarChart
              title="Wall Types"
              subtitle={`Installation surfaces — ${rangeLabel}`}
              data={wallTypeCounts}
              hue="#ea580c"
              emptyText="No wall type data for this period yet."
            />
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, bg, color }) {
  return (
    <div className={`${bg} rounded-2xl border border-gray-200 p-4 shadow-sm h-full`}>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`font-extrabold mt-1 text-xl sm:text-2xl ${color || "text-gray-900"}`}>{value}</p>
    </div>
  )
}

function RankedBarChart({ title, subtitle, data, hue, sorted = true, emptyText }) {
  const rows = sorted ? [...data].sort((a, b) => b.value - a.value) : data
  const max  = Math.max(1, ...rows.map(d => d.value))
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h2 className="font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      {rows.length === 0 ? (
        <p className="text-center py-8 text-gray-400 text-sm">{emptyText}</p>
      ) : (
        <div className="space-y-2.5 mt-4">
          {rows.map(d => (
            <div key={d.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-gray-700">{d.label}</span>
                <span className="text-gray-400 font-medium tabular-nums">{d.value}</span>
              </div>
              <div className="h-3 rounded-md bg-gray-100 overflow-hidden" title={`${d.label}: ${d.value}`}>
                <div
                  className="h-full rounded-r-md transition-all duration-300"
                  style={{ width: `${(d.value / max) * 100}%`, backgroundColor: hue }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
