"use client"
import { useEffect, useState, useMemo } from "react"

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700 border-amber-200"   },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200"      },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500 border-gray-200"      },
}

const STATUS_FLOW = ["pending", "confirmed", "completed", "cancelled"]

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState("")
  const [filter,   setFilter]   = useState("all")
  const [expanded, setExpanded] = useState(null)
  const [noteEdit, setNoteEdit] = useState({}) // id → text

  useEffect(() => { loadBookings() }, [])

  async function loadBookings() {
    setLoading(true)
    try {
      const res  = await fetch("/api/bookings")
      const data = await res.json()
      if (data.ok) setBookings(data.bookings)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id, status) {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b))
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
  }

  async function saveNote(id) {
    const notes = noteEdit[id] ?? ""
    setBookings(prev => prev.map(b => b._id === id ? { ...b, notes } : b))
    setNoteEdit(prev => { const n = {...prev}; delete n[id]; return n })
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, notes }),
    })
  }

  async function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return
    setBookings(prev => prev.filter(b => b._id !== id))
    if (expanded === id) setExpanded(null)
    await fetch(`/api/bookings?id=${id}`, { method: "DELETE" })
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return bookings.filter(b => {
      const matchFilter = filter === "all" || b.status === filter
      const matchSearch = !q ||
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        b.address?.city?.toLowerCase().includes(q)
      return matchFilter && matchSearch
    })
  }, [bookings, search, filter])

  const stats = useMemo(() => ({
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
  }), [bookings])

  // Week range
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const thisWeek = bookings.filter(b => new Date(b.createdAt) >= weekStart).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">All customer reservation requests</p>
        </div>
        <button onClick={loadBookings}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm transition">
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",     value: stats.total,     bg: "bg-white"           },
          { label: "Pending",   value: stats.pending,   bg: "bg-amber-50"        },
          { label: "Confirmed", value: stats.confirmed, bg: "bg-blue-50"         },
          { label: "This week", value: thisWeek,        bg: "bg-emerald-50"      },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-200 p-4 shadow-sm`}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone or city…"
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <div className="flex gap-2">
          {["all", ...STATUS_FLOW].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize border transition ${
                filter === s
                  ? "bg-[#E50914] text-white border-[#E50914]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}>
              {s === "all" ? "All" : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading bookings…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No bookings found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <BookingCard
              key={b._id}
              booking={b}
              expanded={expanded === b._id}
              noteValue={noteEdit[b._id] ?? b.notes ?? ""}
              onToggle={() => setExpanded(e => e === b._id ? null : b._id)}
              onStatus={s => updateStatus(b._id, s)}
              onNoteChange={v => setNoteEdit(prev => ({ ...prev, [b._id]: v }))}
              onNoteSave={() => saveNote(b._id)}
              onDelete={() => deleteBooking(b._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking: b, expanded, noteValue, onToggle, onStatus, onNoteChange, onNoteSave, onDelete }) {
  const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
  const fullName = `${b.firstName} ${b.lastName}`
  const fullAddress = [b.address?.street, b.address?.apt, b.address?.city, b.address?.state, b.address?.zip]
    .filter(Boolean).join(", ")
  const createdDate = new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const createdTime = new Date(b.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Card header — always visible */}
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition" onClick={onToggle}>

        {/* Status dot */}
        <div className={`w-2.5 h-2.5 rounded-full flex-none ${
          b.status === "pending"   ? "bg-amber-400" :
          b.status === "confirmed" ? "bg-blue-500"  :
          b.status === "completed" ? "bg-emerald-500" : "bg-gray-300"
        }`} />

        {/* Name + date */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{fullName}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {b.date ? `📅 ${b.date}` : "No date set"}
            {b.timePreference && ` · ${b.timePreference}`}
          </p>
        </div>

        {/* Promo / TV count */}
        <div className="hidden sm:block text-right flex-none">
          {b.selectedPromo ? (
            <span className="text-xs font-semibold text-[#E50914]">
              {b.selectedPromo.includes("55") ? "$199 Promo" : "$260 Promo"}
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              {b.tvs?.length || 0} TV{b.tvs?.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Status badge */}
        <span className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.color}`}>
          {sc.label}
        </span>

        {/* Submitted */}
        <div className="text-right flex-none hidden md:block">
          <p className="text-xs text-gray-400">{createdDate}</p>
          <p className="text-xs text-gray-400">{createdTime}</p>
        </div>

        <span className="text-gray-400 text-xs flex-none">{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Column 1 — Customer */}
            <section>
              <SectionTitle>Customer</SectionTitle>
              <InfoRow icon="👤" value={fullName} />
              <InfoRow icon="✉️" value={<a href={`mailto:${b.email}`} className="text-blue-600 hover:underline">{b.email}</a>} />
              <InfoRow icon="📞" value={<a href={`tel:${b.phone}`} className="text-blue-600 hover:underline">{b.phone}</a>} />
              <InfoRow icon="📍" value={fullAddress || "—"} />
              <InfoRow icon="💬" value={b.referral || "—"} label="Referral" />
              <InfoRow icon="💳" value={b.payment || "—"} label="Payment" />
            </section>

            {/* Column 2 — Service */}
            <section>
              <SectionTitle>Service Details</SectionTitle>
              <InfoRow icon="📅" value={b.date || "—"} label="Date" />
              <InfoRow icon="🕐" value={b.timePreference || "—"} label="Time" />

              {b.selectedPromo ? (
                <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-3">
                  <p className="text-xs font-bold text-[#E50914] uppercase tracking-wide mb-1">Promo Package</p>
                  <p className="text-sm font-semibold text-gray-800">{b.selectedPromo}</p>
                  <p className="text-lg font-extrabold text-[#E50914] mt-1">
                    {b.selectedPromo.includes("55") ? "$199" : "$260"}
                  </p>
                </div>
              ) : b.tvs?.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {b.tvs.map((tv, i) => (
                    <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <p className="text-xs font-bold text-gray-500 mb-1">TV #{i + 1}</p>
                      <p className="text-sm font-semibold">{tv.size}{tv.exactSize ? ` (${tv.exactSize}")` : ""}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{tv.wallType}</p>
                      {tv.comments && <p className="text-xs text-gray-400 mt-0.5 italic">"{tv.comments}"</p>}
                    </div>
                  ))}
                </div>
              ) : null}

              {b.couponCode && (
                <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">
                    Coupon — {b.couponCode}
                  </p>
                  <p className="text-sm text-emerald-800">{b.appliedCouponLabel}</p>
                  {b.couponComment && (
                    <p className="mt-2 text-sm text-emerald-700 italic border-t border-emerald-200 pt-2">
                      "{b.couponComment}"
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Column 3 — Status & Notes */}
            <section>
              <SectionTitle>Status & Notes</SectionTitle>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {STATUS_FLOW.map(s => {
                  const cfg = STATUS_CONFIG[s]
                  return (
                    <button
                      key={s}
                      onClick={() => onStatus(s)}
                      className={`rounded-xl border py-2 text-xs font-semibold transition ${
                        b.status === s
                          ? cfg.color + " shadow-sm"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  )
                })}
              </div>

              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Internal Notes</label>
              <textarea
                rows={4}
                value={noteValue}
                onChange={e => onNoteChange(e.target.value)}
                placeholder="Add notes about this booking…"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={onNoteSave}
                  className="flex-1 rounded-xl bg-gray-900 text-white text-xs font-semibold py-2 hover:bg-black transition">
                  Save Note
                </button>
                <button onClick={onDelete}
                  className="rounded-xl border border-red-200 text-red-500 text-xs font-semibold px-4 py-2 hover:bg-red-50 transition">
                  Delete
                </button>
              </div>
            </section>

          </div>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{children}</p>
}

function InfoRow({ icon, value, label }) {
  return (
    <div className="flex items-start gap-2 mb-2">
      <span className="text-sm flex-none w-5">{icon}</span>
      <div className="min-w-0">
        {label && <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{label}</p>}
        <p className="text-sm text-gray-700 break-words">{value}</p>
      </div>
    </div>
  )
}
