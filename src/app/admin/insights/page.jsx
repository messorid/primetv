"use client"
import { useState, useEffect, useMemo } from "react"

const PERIODS = ["Today", "This Week", "This Month", "All Time"]
const EXP_CATEGORIES = ["marketing", "tools", "fuel", "supplies", "other"]

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
  return new Date(0)
}

export default function InsightsPage() {
  const [bookings,  setBookings]  = useState([])
  const [expenses,  setExpenses]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [period,    setPeriod]    = useState("This Month")
  const [expForm,   setExpForm]   = useState({ category: "marketing", description: "", amount: "", date: todayStr() })
  const [addingExp, setAddingExp] = useState(false)
  const [expErr,    setExpErr]    = useState("")

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [bRes, eRes] = await Promise.all([fetch("/api/bookings"), fetch("/api/expenses")])
    const [bData, eData] = await Promise.all([bRes.json(), eRes.json()])
    if (bData.ok) setBookings(bData.bookings.filter(b => b.status === "completed" && b.amountCharged != null))
    if (eData.ok) setExpenses(eData.expenses)
    setLoading(false)
  }

  const start = useMemo(() => periodStart(period), [period])

  const filteredBookings = useMemo(() =>
    bookings.filter(b => new Date(b.completedAt || b.createdAt) >= start),
    [bookings, start]
  )

  const filteredExpenses = useMemo(() => {
    const startISO = start.toISOString().split("T")[0]
    return expenses.filter(e => {
      const d = typeof e.date === "string" ? e.date.split("T")[0] : ""
      return d >= startISO
    })
  }, [expenses, start])

  const totalRevenue    = filteredBookings.reduce((s, b) => s + Number(b.amountCharged    || 0), 0)
  const totalWorkers    = filteredBookings.reduce((s, b) => s + Number(b.amountPaidWorkers || 0), 0)
  const totalProfit     = filteredBookings.reduce((s, b) => s + Number(b.companyProfit    || 0), 0)
  const totalExpenses   = filteredExpenses.reduce((s, e) => s + Number(e.amount           || 0), 0)
  const netProfit       = totalProfit - totalExpenses

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Insights</h1>
          <p className="text-sm text-gray-500 mt-0.5">Revenue, expenses & profit overview</p>
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm self-start sm:self-auto overflow-x-auto max-w-full">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex-none ${
                period === p ? "bg-[#E50914] text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-400">Loading…</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
            <StatCard label="Revenue"      value={`$${totalRevenue.toFixed(2)}`}  bg="bg-blue-50"    color="text-blue-700" />
            <StatCard label="Worker Costs" value={`$${totalWorkers.toFixed(2)}`}  bg="bg-amber-50"   color="text-amber-700" />
            <StatCard label="Gross Profit" value={`$${totalProfit.toFixed(2)}`}   bg="bg-emerald-50" color="text-emerald-600" />
            <StatCard label="Expenses"     value={`$${totalExpenses.toFixed(2)}`} bg="bg-red-50"     color="text-red-600" />
            <div className="col-span-2 lg:col-span-1">
              <StatCard
                label="Net Profit"
                value={`$${netProfit.toFixed(2)}`}
                bg={netProfit >= 0 ? "bg-emerald-50" : "bg-red-50"}
                color={netProfit >= 0 ? "text-emerald-600" : "text-red-500"}
                large
              />
            </div>
          </div>

          {/* Completed Jobs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                Completed Jobs <span className="text-gray-400 font-normal">({filteredBookings.length})</span>
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{period}</span>
            </div>
            {filteredBookings.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm">No completed jobs for this period.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredBookings.map(b => (
                  <div key={b._id} className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{b.firstName} {b.lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {b.date || "No date"}
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
                    </div>
                    <div className="text-right flex-none">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Profit</p>
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
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{period}</span>
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
                          {new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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

function StatCard({ label, value, bg, color, large }) {
  return (
    <div className={`${bg} rounded-2xl border border-gray-200 p-4 shadow-sm`}>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`font-extrabold mt-1 ${color || "text-gray-900"} ${large ? "text-3xl" : "text-2xl"}`}>
        {value}
      </p>
    </div>
  )
}
