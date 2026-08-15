"use client"
import { useState, useEffect, useMemo } from "react"

const PERIODS = ["Today", "This Week", "This Month", "This Year", "All Time"]
const EXP_CATEGORIES = ["marketing", "tools", "fuel", "supplies", "other"]
const SORTS = [
  { value: "date_desc",    label: "Newest first" },
  { value: "date_asc",     label: "Oldest first" },
  { value: "profit_desc",  label: "Highest profit" },
  { value: "profit_asc",   label: "Lowest profit" },
  { value: "revenue_desc", label: "Highest revenue" },
]

function todayStr() {
  return new Date().toISOString().split("T")[0]
}

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

function fmtDate(d) {
  if (!d) return "No date"
  const dt = typeof d === "string" && d.length === 10 ? new Date(d + "T12:00:00") : new Date(d)
  if (isNaN(dt)) return "No date"
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
}

export default function InsightsPage() {
  const [bookings,       setBookings]       = useState([])
  const [expenses,       setExpenses]       = useState([])
  const [installers,     setInstallers]     = useState([])
  const [loading,        setLoading]        = useState(true)
  const [period,         setPeriod]         = useState("This Month")
  const [customFrom,     setCustomFrom]     = useState("")
  const [customTo,       setCustomTo]       = useState("")
  const [installerFilter,setInstallerFilter]= useState("all")
  const [sortBy,         setSortBy]         = useState("date_desc")
  const [expForm,        setExpForm]        = useState({ category: "marketing", description: "", amount: "", date: todayStr() })
  const [addingExp,      setAddingExp]      = useState(false)
  const [expErr,         setExpErr]         = useState("")

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [bRes, eRes, iRes] = await Promise.all([fetch("/api/bookings"), fetch("/api/expenses"), fetch("/api/installers")])
    const [bData, eData, iData] = await Promise.all([bRes.json(), eRes.json(), iRes.json()])
    if (bData.ok) setBookings(bData.bookings.filter(b => b.status === "completed" && b.amountCharged != null))
    if (eData.ok) setExpenses(eData.expenses)
    if (iData.ok) setInstallers(iData.installers)
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

  const installerNames = useMemo(
    () => Array.from(new Set(bookings.map(b => b.installerName).filter(Boolean))).sort(),
    [bookings]
  )

  const filteredBookings = useMemo(() => bookings.filter(b => {
    const d = new Date(b.completedAt || b.createdAt)
    const inRange = d >= range.start && d <= range.end
    const matchInstaller = installerFilter === "all" || b.installerName === installerFilter
    return inRange && matchInstaller
  }), [bookings, range, installerFilter])

  const sortedBookings = useMemo(() => {
    const arr = [...filteredBookings]
    arr.sort((a, b) => {
      if (sortBy === "date_desc")    return new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt)
      if (sortBy === "date_asc")     return new Date(a.completedAt || a.createdAt) - new Date(b.completedAt || b.createdAt)
      if (sortBy === "profit_desc")  return Number(b.companyProfit || 0) - Number(a.companyProfit || 0)
      if (sortBy === "profit_asc")   return Number(a.companyProfit || 0) - Number(b.companyProfit || 0)
      if (sortBy === "revenue_desc") return Number(b.amountCharged || 0) - Number(a.amountCharged || 0)
      return 0
    })
    return arr
  }, [filteredBookings, sortBy])

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const dateStr = typeof e.date === "string" ? e.date.split("T")[0] : ""
      if (!dateStr) return false
      const d = new Date(dateStr + "T12:00:00")
      return d >= range.start && d <= range.end
    })
  }, [expenses, range])

  const totalRevenue    = filteredBookings.reduce((s, b) => s + Number(b.amountCharged    || 0), 0)
  const totalWorkers    = filteredBookings.reduce((s, b) => s + Number(b.amountPaidWorkers || 0), 0)
  const totalMaterials  = filteredBookings.reduce((s, b) => s + Number(b.materialsCost    || 0), 0)
  const totalProfit     = filteredBookings.reduce((s, b) => s + Number(b.companyProfit    || 0), 0)
  const totalExpenses   = filteredExpenses.reduce((s, e) => s + Number(e.amount           || 0), 0)
  const netProfit       = totalProfit - totalExpenses
  const marginPct       = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : null

  const rangeLabel = usingCustomRange
    ? `${customFrom ? fmtDate(customFrom) : "…"} → ${customTo ? fmtDate(customTo) : "…"}`
    : period

  async function addExpense(e) {
    e.preventDefault()
    if (!expForm.amount || isNaN(parseFloat(expForm.amount))) { setExpErr("Enter a valid amount"); return }
    setExpErr(""); setAddingExp(true)
    const res  = await fetch("/api/expenses", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...expForm, amount: parseFloat(expForm.amount) }),
    })
    const data = await res.json()
    if (data.ok) {
      setExpenses(prev => [data.expense, ...prev])
      setExpForm({ category: "marketing", description: "", amount: "", date: todayStr() })
    }
    setAddingExp(false)
  }

  async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return
    setExpenses(prev => prev.filter(e => e.id !== id))
    await fetch(`/api/expenses?id=${id}`, { method: "DELETE" })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Insights</h1>
            <p className="text-sm text-gray-500 mt-0.5">Revenue, expenses & profit overview</p>
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

        {/* Filters row: custom date range + installer */}
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

          <div className="ml-auto flex items-end gap-3">
            {installerNames.length > 0 && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Installer</label>
                <select value={installerFilter} onChange={e => setInstallerFilter(e.target.value)}
                  className="mt-1 block rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-300">
                  <option value="all">All installers</option>
                  {installerNames.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Sort</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="mt-1 block rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-300">
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-400">Loading…</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
            <StatCard label="Revenue"      value={`$${totalRevenue.toFixed(2)}`}   bg="bg-blue-50"    color="text-blue-700" />
            <StatCard label="Workers"      value={`$${totalWorkers.toFixed(2)}`}   bg="bg-amber-50"   color="text-amber-700" />
            <StatCard label="Materials"    value={`$${totalMaterials.toFixed(2)}`} bg="bg-orange-50"  color="text-orange-600" />
            <StatCard label="Expenses"     value={`$${totalExpenses.toFixed(2)}`}  bg="bg-red-50"     color="text-red-600" />
            <StatCard
              label="Margin"
              value={marginPct === null ? "—" : `${marginPct.toFixed(1)}%`}
              bg="bg-purple-50" color="text-purple-700"
              hint="Company profit ÷ revenue"
            />
            <StatCard
              label="Net Profit"
              value={`$${netProfit.toFixed(2)}`}
              bg={netProfit >= 0 ? "bg-emerald-50" : "bg-red-50"}
              color={netProfit >= 0 ? "text-emerald-600" : "text-red-500"}
              hint="After workers, materials & expenses"
            />
          </div>

          {/* Completed Jobs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                Completed Jobs <span className="text-gray-400 font-normal">({sortedBookings.length})</span>
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{rangeLabel}</span>
            </div>
            {sortedBookings.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm">No completed jobs for this period.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {sortedBookings.map(b => (
                  <div key={b._id} className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{b.firstName} {b.lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {fmtDate(b.completedAt || b.createdAt)}
                        {b.installerName ? ` · ${b.installerName}` : ""}
                      </p>
                    </div>
                    <div className="text-right hidden sm:block flex-none">
                      <p className="text-xs text-gray-400">
                        Charged <span className="font-semibold text-gray-700 ml-1">${Number(b.amountCharged).toFixed(2)}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Workers <span className="font-semibold text-gray-700 ml-1">${Number(b.amountPaidWorkers).toFixed(2)}</span>
                      </p>
                      {Number(b.materialsCost) > 0 && (
                        <p className="text-xs text-gray-400">
                          Materials <span className="font-semibold text-orange-600 ml-1">${Number(b.materialsCost).toFixed(2)}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-none">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                        Profit{b.profitType && b.profitValue != null
                          ? ` · ${b.profitType === "fixed" ? `$${Number(b.profitValue).toFixed(0)}` : `${Number(b.profitValue).toFixed(0)}%`}`
                          : ""}
                      </p>
                      <p className={`text-base sm:text-lg font-extrabold ${Number(b.companyProfit) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        ${Number(b.companyProfit).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expenses Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Add Expense Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-1">Add Expense</h2>
              <p className="text-xs text-gray-400 mb-4">Marketing, fuel, tools, supplies…</p>
              <form onSubmit={addExpense} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Category</label>
                    <select
                      value={expForm.category}
                      onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      {EXP_CATEGORIES.map(c => (
                        <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Date</label>
                    <input
                      type="date"
                      value={expForm.date}
                      onChange={e => setExpForm(f => ({ ...f, date: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Description</label>
                  <input
                    value={expForm.description}
                    onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Facebook Ads, gas refill, etc."
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Amount</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={expForm.amount}
                      onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-gray-200 pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                  </div>
                </div>

                {expErr && <p className="text-xs text-red-500 font-medium">{expErr}</p>}

                <button
                  type="submit"
                  disabled={addingExp || !expForm.amount}
                  className="w-full rounded-xl bg-[#E50914] text-white text-sm font-bold py-2.5 hover:bg-red-700 transition disabled:opacity-50"
                >
                  {addingExp ? "Adding…" : "Add Expense"}
                </button>
              </form>
            </div>

            {/* Expense List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800">
                  Expenses <span className="text-gray-400 font-normal">({filteredExpenses.length})</span>
                </h2>
                <div className="flex items-center gap-2">
                  {filteredExpenses.length > 0 && (
                    <span className="text-sm font-bold text-red-600">
                      -${totalExpenses.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{rangeLabel}</span>
                </div>
              </div>

              {filteredExpenses.length === 0 ? (
                <p className="text-center py-10 text-gray-400 text-sm">No expenses for this period.</p>
              ) : (
                <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {filteredExpenses.map(e => (
                    <li key={e.id} className="flex items-center gap-3 px-6 py-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-none">
                        <span className="text-base">
                          {e.category === "marketing" ? "📣" :
                           e.category === "fuel"      ? "⛽" :
                           e.category === "tools"     ? "🔧" :
                           e.category === "supplies"  ? "📦" : "💸"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {e.description || (e.category.charAt(0).toUpperCase() + e.category.slice(1))}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          <span className="capitalize">{e.category}</span>
                          {" · "}
                          {fmtDate(e.date)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-red-600 flex-none">
                        -${Number(e.amount).toFixed(2)}
                      </p>
                      <button
                        onClick={() => deleteExpense(e.id)}
                        className="text-gray-300 hover:text-red-500 transition flex-none text-lg leading-none"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, bg, color, large, hint }) {
  return (
    <div className={`${bg} rounded-2xl border border-gray-200 p-4 shadow-sm h-full`}>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`font-extrabold mt-1 ${color || "text-gray-900"} ${large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
        {value}
      </p>
      {hint && <p className="text-[10px] text-gray-400 mt-1 leading-tight">{hint}</p>}
    </div>
  )
}
