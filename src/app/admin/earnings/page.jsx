"use client"
import { useEffect, useMemo, useState } from "react"

const money = v => `$${(Number(v) || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
const money2 = v => `$${(Number(v) || 0).toFixed(2)}`

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// Ranges are built in local time so "today" means the installer's today, not UTC's.
function presetRange(preset) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (preset === "today") return { from: iso(today), to: iso(today) }

  if (preset === "yesterday") {
    const y = new Date(today); y.setDate(y.getDate() - 1)
    return { from: iso(y), to: iso(y) }
  }
  if (preset === "week") {
    const s = new Date(today); s.setDate(s.getDate() - s.getDay())
    return { from: iso(s), to: iso(today) }
  }
  if (preset === "7d") {
    const s = new Date(today); s.setDate(s.getDate() - 6)
    return { from: iso(s), to: iso(today) }
  }
  if (preset === "month") {
    return { from: iso(new Date(today.getFullYear(), today.getMonth(), 1)), to: iso(today) }
  }
  if (preset === "30d") {
    const s = new Date(today); s.setDate(s.getDate() - 29)
    return { from: iso(s), to: iso(today) }
  }
  if (preset === "year") {
    return { from: iso(new Date(today.getFullYear(), 0, 1)), to: iso(today) }
  }
  return { from: "", to: "" } // all time
}

const PRESETS = [
  { id: "today",     label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "week",      label: "This week" },
  { id: "7d",        label: "Last 7 days" },
  { id: "month",     label: "This month" },
  { id: "30d",       label: "Last 30 days" },
  { id: "year",      label: "This year" },
  { id: "all",       label: "All time" },
]

function fmtDay(d) {
  if (!d) return "—"
  const dt = new Date(d + "T12:00:00")
  if (isNaN(dt)) return d
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export default function EarningsPage() {
  const [preset,   setPreset]   = useState("month")
  const [from,     setFrom]     = useState(() => presetRange("month").from)
  const [to,       setTo]       = useState(() => presetRange("month").to)
  const [data,     setData]     = useState(null)
  const [installers, setInstallers] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState("")
  const [openDay,  setOpenDay]  = useState(null)

  // Commission editing
  const [editId,   setEditId]   = useState(null)
  const [cType,    setCType]    = useState("percent")
  const [cValue,   setCValue]   = useState("")
  const [savingC,  setSavingC]  = useState(false)
  const [cErr,     setCErr]     = useState("")

  useEffect(() => { loadInstallers() }, [])
  useEffect(() => { load() }, [from, to])

  async function loadInstallers() {
    try {
      const res = await fetch("/api/installers")
      const d = await res.json()
      if (d.ok) setInstallers(d.installers)
    } catch {}
  }

  async function load() {
    setLoading(true); setError("")
    try {
      const qs = new URLSearchParams()
      if (from) qs.set("from", from)
      if (to)   qs.set("to", to)
      const res = await fetch(`/api/earnings?${qs}`)
      const d = await res.json()
      if (d.ok) setData(d)
      else setError(d.error || "Could not load earnings.")
    } catch {
      setError("Could not load earnings.")
    } finally {
      setLoading(false)
    }
  }

  function applyPreset(id) {
    setPreset(id)
    const r = presetRange(id === "all" ? "all" : id)
    setFrom(r.from); setTo(r.to)
  }

  function onCustom(which, value) {
    setPreset("custom")
    which === "from" ? setFrom(value) : setTo(value)
  }

  const commissionFor = id => installers.find(i => i.id === id)

  async function saveCommission(installerId) {
    setSavingC(true); setCErr("")
    try {
      const res = await fetch("/api/installers", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: installerId, commissionType: cType, commissionValue: cValue }),
      })
      const d = await res.json()
      if (!d.ok) { setCErr(d.error || "Could not save."); return }
      setInstallers(prev => prev.map(i => i.id === installerId ? d.installer : i))
      setEditId(null)
    } catch {
      setCErr("Could not save.")
    } finally {
      setSavingC(false)
    }
  }

  const t = data?.totals
  const rangeLabel = useMemo(() => {
    if (!from && !to) return "All time"
    if (from === to) return fmtDay(from)
    return `${fmtDay(from)} → ${fmtDay(to)}`
  }, [from, to])

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">Earnings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          What each installer earned and what the company kept, from completed jobs.
        </p>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm mb-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => applyPreset(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                preset === p.id ? "bg-[#E50914] text-white" : "bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">From</label>
            <input type="date" value={from} onChange={e => onCustom("from", e.target.value)}
              className="mt-1 block rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-300" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">To</label>
            <input type="date" value={to} onChange={e => onCustom("to", e.target.value)}
              className="mt-1 block rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-300" />
          </div>
          <span className="ml-auto text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
            {rangeLabel}
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-400">Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : !t || t.jobs === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-400 text-sm">No completed jobs in this range.</p>
        </div>
      ) : (
        <>
          {/* ── Totals ──────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            <Stat label="Revenue"        value={money(t.revenue)}       bg="bg-blue-50"    color="text-blue-700" hint={`${t.jobs} job${t.jobs !== 1 ? "s" : ""}`} />
            <Stat label="Materials"      value={money(t.materials)}     bg="bg-orange-50"  color="text-orange-600" />
            <Stat label="Installer pay"  value={money(t.installerPay)}  bg="bg-amber-50"   color="text-amber-700" hint="Paid to workers" />
            <Stat label="Company profit" value={money(t.companyProfit)} bg="bg-emerald-50" color="text-emerald-600" />
            <Stat label="Margin"         value={t.margin == null ? "—" : `${t.margin.toFixed(1)}%`} bg="bg-purple-50" color="text-purple-700" hint="Profit ÷ revenue" />
          </div>

          {/* ── Per installer ───────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm mb-6 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">By installer</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                The split is what each installer earns after materials. The company keeps the rest.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {data.installers.map(i => {
                const inst    = commissionFor(i.installerId)
                const editing = editId && editId === i.installerId
                const share   = t.installerPay > 0 ? (i.installerPay / t.installerPay) * 100 : 0
                return (
                  <div key={i.key} className="px-5 py-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center justify-center size-9 rounded-full bg-gray-100 text-xs font-extrabold text-gray-500 flex-none">
                        {i.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 truncate">{i.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {i.jobs} job{i.jobs !== 1 ? "s" : ""} · {money(i.revenue)} revenue · avg {money2(i.avgPerJob)}/job
                        </p>
                      </div>

                      <div className="text-right flex-none">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Earned</p>
                        <p className="text-lg font-extrabold text-amber-700">{money(i.installerPay)}</p>
                      </div>

                      <div className="text-right flex-none hidden sm:block">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Company</p>
                        <p className="text-sm font-bold text-emerald-600">{money(i.companyProfit)}</p>
                      </div>
                    </div>

                    {/* Split bar */}
                    <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden flex">
                      <div className="h-full bg-amber-400" style={{ width: `${Math.max(0, Math.min(100, share))}%` }} />
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400">{share.toFixed(0)}% of all installer pay in this range</p>

                    {/* Default split */}
                    {i.installerId && (
                      <div className="mt-3 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5">
                        {editing ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <select value={cType} onChange={e => setCType(e.target.value)}
                              className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs">
                              <option value="percent">% of job</option>
                              <option value="fixed">Fixed $</option>
                            </select>
                            <input type="number" min="0" step="0.01" value={cValue}
                              onChange={e => setCValue(e.target.value)}
                              className="w-24 rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-300" />
                            <span className="text-xs text-gray-500">
                              {cType === "percent"
                                ? `installer ${cValue || 0}% · company ${(100 - (Number(cValue) || 0)).toFixed(0)}%`
                                : "per job, company keeps the rest"}
                            </span>
                            <button onClick={() => saveCommission(i.installerId)} disabled={savingC}
                              className="ml-auto rounded-lg bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 hover:bg-emerald-600 transition disabled:opacity-40">
                              {savingC ? "…" : "Save"}
                            </button>
                            <button onClick={() => { setEditId(null); setCErr("") }}
                              className="rounded-lg border border-gray-200 text-gray-500 text-xs px-2.5 py-1.5 hover:bg-gray-100 transition">
                              Cancel
                            </button>
                            {cErr && <p className="w-full text-[11px] font-medium text-red-500">{cErr}</p>}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Default split</span>
                            {inst ? (
                              <span className="text-xs font-semibold text-gray-700">
                                {inst.commissionType === "fixed"
                                  ? `${money2(inst.commissionValue)} per job`
                                  : `Installer ${inst.commissionValue}% · Company ${(100 - Number(inst.commissionValue)).toFixed(0)}%`}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">not set</span>
                            )}
                            <button
                              onClick={() => {
                                setEditId(i.installerId)
                                setCType(inst?.commissionType || "percent")
                                setCValue(String(inst?.commissionValue ?? 65))
                                setCErr("")
                              }}
                              className="ml-auto text-[10px] text-gray-400 hover:text-[#E50914] border border-gray-200 rounded px-1.5 py-0.5 hover:border-[#E50914]/30 transition">
                              edit
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Daily ───────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                Day by day <span className="text-gray-400 font-normal">({data.days.length})</span>
              </h2>
              <span className="text-xs text-gray-400">Tap a day for its jobs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500">
                    <th className="text-left font-semibold px-5 py-2.5">Day</th>
                    <th className="text-right font-semibold px-3 py-2.5">Jobs</th>
                    <th className="text-right font-semibold px-3 py-2.5">Revenue</th>
                    <th className="text-right font-semibold px-3 py-2.5">Materials</th>
                    <th className="text-right font-semibold px-3 py-2.5">Installers</th>
                    <th className="text-right font-semibold px-5 py-2.5">Company</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.days.map(d => (
                    <>
                      <tr key={d.date}
                        onClick={() => setOpenDay(openDay === d.date ? null : d.date)}
                        className="cursor-pointer hover:bg-gray-50 transition">
                        <td className="px-5 py-2.5 font-semibold text-gray-800 whitespace-nowrap">
                          <span className="text-gray-300 mr-1.5">{openDay === d.date ? "▾" : "▸"}</span>
                          {fmtDay(d.date)}
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray-600">{d.jobs}</td>
                        <td className="px-3 py-2.5 text-right text-gray-700">{money(d.revenue)}</td>
                        <td className="px-3 py-2.5 text-right text-orange-600">{d.materials ? money(d.materials) : "—"}</td>
                        <td className="px-3 py-2.5 text-right font-semibold text-amber-700">{money(d.installerPay)}</td>
                        <td className="px-5 py-2.5 text-right font-extrabold text-emerald-600">{money(d.companyProfit)}</td>
                      </tr>

                      {openDay === d.date && (
                        <tr key={`${d.date}-open`} className="bg-gray-50">
                          <td colSpan={6} className="px-5 py-3">
                            <div className="space-y-1.5">
                              {data.jobs.filter(j => j.date === d.date).map(j => (
                                <div key={j.id} className="flex items-center gap-3 text-xs">
                                  <span className="font-semibold text-gray-700 min-w-0 truncate flex-1">
                                    {j.customer || "—"}
                                    {j.city ? <span className="text-gray-400"> · {j.city}</span> : null}
                                  </span>
                                  <span className="text-gray-500 flex-none">{j.installerName}</span>
                                  <span className="text-gray-600 flex-none w-16 text-right">{money2(j.revenue)}</span>
                                  <span className="text-amber-700 font-semibold flex-none w-16 text-right">{money2(j.installerPay)}</span>
                                  <span className="text-emerald-600 font-bold flex-none w-16 text-right">{money2(j.companyProfit)}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-bold text-gray-800">
                    <td className="px-5 py-3">Total</td>
                    <td className="px-3 py-3 text-right">{t.jobs}</td>
                    <td className="px-3 py-3 text-right">{money(t.revenue)}</td>
                    <td className="px-3 py-3 text-right text-orange-600">{money(t.materials)}</td>
                    <td className="px-3 py-3 text-right text-amber-700">{money(t.installerPay)}</td>
                    <td className="px-5 py-3 text-right text-emerald-600">{money(t.companyProfit)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Stat({ label, value, bg, color, hint }) {
  return (
    <div className={`${bg} rounded-2xl border border-gray-200 p-4 shadow-sm`}>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-xl sm:text-2xl font-extrabold mt-1 ${color}`}>{value}</p>
      {hint && <p className="text-[10px] text-gray-400 mt-1 leading-tight">{hint}</p>}
    </div>
  )
}
