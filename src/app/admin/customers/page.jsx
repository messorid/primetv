"use client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

const STATUS_DOT = {
  pending:   "bg-amber-400",
  confirmed: "bg-blue-500",
  completed: "bg-emerald-500",
  cancelled: "bg-gray-300",
}

function fmtDate(d) {
  if (!d) return "—"
  const dt = typeof d === "string" && d.length === 10 ? new Date(d + "T12:00:00") : new Date(d)
  if (isNaN(dt)) return "—"
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function fullAddress(a) {
  if (!a) return ""
  return [a.street, a.apt, [a.city, a.state].filter(Boolean).join(", "), a.zip]
    .filter(Boolean).join(" · ")
}

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState([])
  const [totals,    setTotals]    = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState("")
  const [search,    setSearch]    = useState("")
  const [filter,    setFilter]    = useState("all") // all | repeat
  const [expanded,  setExpanded]  = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res  = await fetch("/api/customers")
      const data = await res.json()
      if (data.ok) { setCustomers(data.customers); setTotals(data.totals) }
      else setError(data.error || "Could not load customers.")
    } catch {
      setError("Could not load customers.")
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return customers.filter(c => {
      if (filter === "repeat" && c.jobCount < 2) return false
      if (!q) return true
      return [c.name, c.email, c.phone, c.city, fullAddress(c.address)]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    })
  }, [customers, search, filter])

  // Hands the booking page everything it needs to open its form pre-filled, so
  // a repeat job never has to be retyped.
  function bookFor(c) {
    const a = c.address || {}
    const params = new URLSearchParams({
      firstName: c.firstName || "",
      lastName:  c.lastName || "",
      email:     c.email || "",
      phone:     c.phone || "",
      street:    a.street || "",
      apt:       a.apt || "",
      city:      a.city || "",
      state:     a.state || "TN",
      zip:       a.zip || "",
      referral:  c.referral || "",
      payment:   c.payment || "",
    })
    router.push(`/admin/bookings?new=1&${params.toString()}`)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Built from your bookings, so it is always current. Open one to book again without retyping.
          </p>
        </div>
        {totals && (
          <div className="flex gap-3">
            <div className="rounded-2xl bg-white border border-gray-200 px-4 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Customers</p>
              <p className="text-xl font-extrabold text-gray-900">{totals.customers}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 border border-gray-200 px-4 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Repeat</p>
              <p className="text-xl font-extrabold text-emerald-700">{totals.repeat}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone or city…"
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm self-start">
          {[{ id: "all", label: "All" }, { id: "repeat", label: "Repeat only" }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                filter === f.id ? "bg-[#E50914] text-white" : "text-gray-500 hover:text-gray-900"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-400">Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 text-gray-400 text-sm">No customers match that search.</p>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(c => {
            const open = expanded === c.key
            return (
              <div key={c.key} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex items-center justify-center size-10 rounded-full bg-gray-100 text-sm font-extrabold text-gray-500 flex-none">
                    {(c.firstName?.[0] || "?").toUpperCase()}{(c.lastName?.[0] || "").toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 truncate">{c.name || "(no name)"}</p>
                      {c.jobCount > 1 && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                          {c.jobCount} jobs
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {c.email || "no email"}{c.phone ? ` · ${c.phone}` : ""}{c.city ? ` · ${c.city}` : ""}
                    </p>
                  </div>

                  <div className="text-right hidden sm:block flex-none">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Last job</p>
                    <p className="text-xs font-semibold text-gray-700">{fmtDate(c.lastJobDate)}</p>
                  </div>

                  {c.totalSpent > 0 && (
                    <div className="text-right flex-none">
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Spent</p>
                      <p className="text-sm font-extrabold text-emerald-600">${c.totalSpent.toFixed(0)}</p>
                    </div>
                  )}

                  <button
                    onClick={() => bookFor(c)}
                    className="flex-none rounded-full bg-[#E50914] text-white text-xs font-bold px-4 py-2 hover:bg-red-700 transition"
                  >
                    Book again
                  </button>
                  <button
                    onClick={() => setExpanded(open ? null : c.key)}
                    className="flex-none w-8 h-8 rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition"
                    aria-label={open ? "Collapse" : "Expand"}
                  >
                    {open ? "▴" : "▾"}
                  </button>
                </div>

                {open && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact</p>
                          {editing !== c.key && (
                            <button onClick={() => startEdit(c)}
                              className="text-[10px] text-gray-400 hover:text-[#E50914] border border-gray-200 rounded px-1.5 py-0.5 hover:border-[#E50914]/30 transition">
                              edit
                            </button>
                          )}
                        </div>

                        {editing === c.key ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <input value={form.firstName} placeholder="First name"
                                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                              <input value={form.lastName} placeholder="Last name"
                                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                            </div>
                            <input type="email" value={form.email} placeholder="Email"
                              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                            <input value={form.phone} placeholder="Phone"
                              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                              className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />

                            {formErr && <p className="text-[11px] font-medium text-red-500">{formErr}</p>}

                            {c.jobCount > 1 && (
                              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                                This updates all {c.jobCount} of their bookings.
                              </p>
                            )}

                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(c)} disabled={saving}
                                className="flex-1 rounded-lg bg-emerald-500 text-white text-xs font-bold py-2 hover:bg-emerald-600 transition disabled:opacity-40">
                                {saving ? "Saving…" : "Save"}
                              </button>
                              <button onClick={() => { setEditing(null); setFormErr("") }}
                                className="rounded-lg border border-gray-200 text-gray-500 text-xs px-3 py-2 hover:bg-gray-100 transition">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <dl className="text-sm space-y-1">
                              <div className="flex gap-2">
                                <dt className="text-gray-400 w-16 flex-none">Email</dt>
                                <dd className="text-gray-800 break-all">
                                  {c.email
                                    ? <a href={`mailto:${c.email}`} className="text-[#E50914] hover:underline">{c.email}</a>
                                    : <span className="text-gray-400">no email</span>}
                                </dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-gray-400 w-16 flex-none">Phone</dt>
                                <dd className="text-gray-800">
                                  {c.phone
                                    ? <a href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`} className="text-[#E50914] hover:underline">{c.phone}</a>
                                    : <span className="text-gray-400">no phone</span>}
                                </dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-gray-400 w-16 flex-none">Address</dt>
                                <dd className="text-gray-800">{fullAddress(c.address) || "—"}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-gray-400 w-16 flex-none">Source</dt>
                                <dd className="text-gray-800">{c.referral || "—"}</dd>
                              </div>
                            </dl>
                            {savedKey === c.key && (
                              <p className="mt-2 text-[11px] font-semibold text-emerald-600">✓ Saved</p>
                            )}
                            <p className="mt-3 text-[11px] text-gray-400">
                              The address belongs to each booking and is edited there, under Bookings.
                            </p>
                          </>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Bookings ({c.bookings.length})
                        </p>
                        <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {[...c.bookings].reverse().map(b => (
                            <li key={b.id} className="flex items-center gap-2 text-sm">
                              <span className={`size-2 rounded-full flex-none ${STATUS_DOT[b.status] || "bg-gray-300"}`} />
                              <span className="text-gray-700">{fmtDate(b.date)}</span>
                              <span className="text-gray-400 text-xs capitalize">{b.status}</span>
                              {b.amountCharged != null && (
                                <span className="ml-auto font-semibold text-gray-700">
                                  ${Number(b.amountCharged).toFixed(0)}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
