"use client"
import { useEffect, useState, useMemo } from "react"

const TV_SIZES  = ['Under 32"', '32" – 42"', '43" – 55"', '56" – 65"', '66" – 75"', '75"+']
const WALL_TYPES = ["Drywall (standard)", "Concrete / Brick", "Tile", "Above fireplace"]
const TIME_PREFS = ["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)", "Flexible"]
const PAYMENTS   = ["Cash", "Zelle", "Card"]

const BLANK_FORM = {
  firstName: "", lastName: "", email: "", phone: "",
  date: "", timePref: "Flexible",
  street: "", city: "Nashville", state: "TN", zip: "",
  payment: "Cash", referral: "",
  serviceType: "tvs",
  tvs: [{ size: '43" – 55"', wallType: "Drywall (standard)", exactSize: "", comments: "" }],
  moreTvsComment: "",
  notes: "",
  status: "pending",
}

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700 border-amber-200"       },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200"          },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500 border-gray-200"          },
}

const STATUS_FLOW = ["pending", "confirmed", "completed", "cancelled"]

export default function BookingsPage() {
  const [bookings,      setBookings]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState("")
  const [filter,        setFilter]        = useState("all")
  const [expanded,      setExpanded]      = useState(null)
  const [noteEdit,      setNoteEdit]      = useState({})
  const [installers,    setInstallers]    = useState([])
  const [completeModal, setCompleteModal] = useState(null)
  const [completeForm,  setCompleteForm]  = useState({ amountCharged: "", amountPaidWorkers: "" })
  const [completing,    setCompleting]    = useState(false)
  const [newModal,      setNewModal]      = useState(false)
  const [newForm,       setNewForm]       = useState(BLANK_FORM)
  const [newErr,        setNewErr]        = useState("")
  const [creating,      setCreating]      = useState(false)

  useEffect(() => { loadBookings(); loadInstallers() }, [])

  async function loadInstallers() {
    const res  = await fetch("/api/installers")
    const data = await res.json()
    if (data.ok) setInstallers(data.installers)
  }

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

  function openCompleteModal(id, name) {
    setCompleteModal({ id, name })
    setCompleteForm({ amountCharged: "", amountPaidWorkers: "" })
  }

  async function handleComplete() {
    if (!completeModal) return
    setCompleting(true)
    const charged = parseFloat(completeForm.amountCharged) || 0
    const paid    = parseFloat(completeForm.amountPaidWorkers) || 0
    const profit  = charged - paid
    const res = await fetch("/api/bookings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: completeModal.id, status: "completed", amountCharged: charged, amountPaidWorkers: paid }),
    })
    const data = await res.json()
    if (data.ok) {
      setBookings(prev => prev.map(b => b._id === completeModal.id
        ? { ...b, status: "completed", amountCharged: charged, amountPaidWorkers: paid, companyProfit: profit, completedAt: new Date().toISOString() }
        : b
      ))
      setCompleteModal(null)
    }
    setCompleting(false)
  }

  function addTv() {
    setNewForm(f => ({ ...f, tvs: [...f.tvs, { size: '43" – 55"', wallType: "Drywall (standard)", exactSize: "", comments: "" }] }))
  }
  function removeTv(idx) {
    setNewForm(f => ({ ...f, tvs: f.tvs.filter((_, i) => i !== idx) }))
  }
  function updateTv(idx, field, val) {
    setNewForm(f => ({ ...f, tvs: f.tvs.map((tv, i) => i === idx ? { ...tv, [field]: val } : tv) }))
  }

  async function handleCreate() {
    if (!newForm.firstName.trim() || !newForm.lastName.trim()) {
      setNewErr("First and last name are required"); return
    }
    setNewErr(""); setCreating(true)
    const promo =
      newForm.serviceType === "promo199" ? '2 TVs Up To 55" — $199 Package' :
      newForm.serviceType === "promo260" ? '2 TVs Up To 65" — $260 Package' : null
    const body = {
      firstName:      newForm.firstName,
      lastName:       newForm.lastName,
      email:          newForm.email,
      phone:          newForm.phone,
      date:           newForm.date,
      timePref:       newForm.timePref,
      address:        { street: newForm.street, city: newForm.city, state: newForm.state, zip: newForm.zip },
      payment:        newForm.payment,
      referral:       newForm.referral,
      promo,
      tvs:            newForm.serviceType === "tvs" ? newForm.tvs : [],
      moreTvs:        newForm.serviceType === "moreTvs",
      moreTvsComment: newForm.moreTvsComment,
      notes:          newForm.notes,
      status:         newForm.status,
    }
    const res  = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.ok) {
      setBookings(prev => [data.booking, ...prev])
      setNewModal(false)
      setNewForm(BLANK_FORM)
    } else {
      setNewErr("Error creating booking — try again")
    }
    setCreating(false)
  }

  async function updateStatus(id, status) {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b))
    await fetch("/api/bookings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id, status }),
    })
  }

  async function saveNote(id) {
    const notes = noteEdit[id] ?? ""
    setBookings(prev => prev.map(b => b._id === id ? { ...b, notes } : b))
    setNoteEdit(prev => { const n = { ...prev }; delete n[id]; return n })
    await fetch("/api/bookings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id, notes }),
    })
  }

  async function assignInstaller(bookingId, installer) {
    setBookings(prev => prev.map(b => b._id === bookingId
      ? { ...b, installerId: installer.id, installerName: installer.name, installerEmail: installer.email }
      : b
    ))
    await fetch("/api/bookings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: bookingId, installerId: installer.id, installerName: installer.name, installerEmail: installer.email }),
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

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const thisWeek = bookings.filter(b => new Date(b.createdAt) >= weekStart).length

  const profit = completeForm.amountCharged || completeForm.amountPaidWorkers
    ? (parseFloat(completeForm.amountCharged) || 0) - (parseFloat(completeForm.amountPaidWorkers) || 0)
    : null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">All customer reservation requests</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadBookings}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm transition">
            ↻ Refresh
          </button>
          <button onClick={() => { setNewForm(BLANK_FORM); setNewErr(""); setNewModal(true) }}
            className="flex items-center gap-2 text-sm font-bold text-white bg-[#E50914] hover:bg-red-700 rounded-xl px-4 py-2 shadow-sm transition">
            + New Booking
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",     value: stats.total,     bg: "bg-white"      },
          { label: "Pending",   value: stats.pending,   bg: "bg-amber-50"   },
          { label: "Confirmed", value: stats.confirmed, bg: "bg-blue-50"    },
          { label: "This week", value: thisWeek,        bg: "bg-emerald-50" },
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
              onStatus={s => s === "completed" ? openCompleteModal(b._id, `${b.firstName} ${b.lastName}`) : updateStatus(b._id, s)}
              onNoteChange={v => setNoteEdit(prev => ({ ...prev, [b._id]: v }))}
              onNoteSave={() => saveNote(b._id)}
              onDelete={() => deleteBooking(b._id)}
              installers={installers}
              onAssign={installer => assignInstaller(b._id, installer)}
            />
          ))}
        </div>
      )}

      {/* New Booking Modal */}
      {newModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-gray-900">New Booking</h2>
              <button onClick={() => setNewModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Customer */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Customer</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name *" value={newForm.firstName} onChange={v => setNewForm(f => ({ ...f, firstName: v }))} placeholder="John" />
                  <Field label="Last Name *"  value={newForm.lastName}  onChange={v => setNewForm(f => ({ ...f, lastName: v }))}  placeholder="Smith" />
                  <Field label="Phone"        value={newForm.phone}     onChange={v => setNewForm(f => ({ ...f, phone: v }))}     placeholder="(615) 000-0000" />
                  <Field label="Email"        value={newForm.email}     onChange={v => setNewForm(f => ({ ...f, email: v }))}     placeholder="email@example.com" />
                  <Field label="Referral"     value={newForm.referral}  onChange={v => setNewForm(f => ({ ...f, referral: v }))}  placeholder="Google, friend…" />
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Payment</label>
                    <select value={newForm.payment} onChange={e => setNewForm(f => ({ ...f, payment: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300">
                      {PAYMENTS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Schedule</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Date</label>
                    <input type="date" value={newForm.date} onChange={e => setNewForm(f => ({ ...f, date: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Time</label>
                    <select value={newForm.timePref} onChange={e => setNewForm(f => ({ ...f, timePref: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300">
                      {TIME_PREFS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Address</p>
                <div className="space-y-2">
                  <Field label="Street" value={newForm.street} onChange={v => setNewForm(f => ({ ...f, street: v }))} placeholder="123 Main St" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <Field label="City"  value={newForm.city}  onChange={v => setNewForm(f => ({ ...f, city: v }))}  placeholder="Nashville" />
                    </div>
                    <Field label="State" value={newForm.state} onChange={v => setNewForm(f => ({ ...f, state: v }))} placeholder="TN" />
                    <Field label="ZIP"   value={newForm.zip}   onChange={v => setNewForm(f => ({ ...f, zip: v }))}   placeholder="37201" />
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Service</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { val: "tvs",      label: "Individual TVs"  },
                    { val: "promo199", label: "$199 Promo"      },
                    { val: "promo260", label: "$260 Promo"      },
                    { val: "moreTvs",  label: "3+ TVs"          },
                  ].map(opt => (
                    <button key={opt.val} type="button"
                      onClick={() => setNewForm(f => ({ ...f, serviceType: opt.val }))}
                      className={`rounded-xl border py-2 text-xs font-semibold transition ${
                        newForm.serviceType === opt.val
                          ? "bg-[#E50914] text-white border-[#E50914]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {newForm.serviceType === "tvs" && (
                  <div className="space-y-3">
                    {newForm.tvs.map((tv, idx) => (
                      <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-gray-500">TV #{idx + 1}</p>
                          {newForm.tvs.length > 1 && (
                            <button type="button" onClick={() => removeTv(idx)}
                              className="text-xs text-red-400 hover:text-red-600 transition">Remove</button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-semibold text-gray-500">Size</label>
                            <select value={tv.size} onChange={e => updateTv(idx, "size", e.target.value)}
                              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-300">
                              {TV_SIZES.map(s => <option key={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-500">Wall Type</label>
                            <select value={tv.wallType} onChange={e => updateTv(idx, "wallType", e.target.value)}
                              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-300">
                              {WALL_TYPES.map(w => <option key={w}>{w}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    {newForm.tvs.length < 5 && (
                      <button type="button" onClick={addTv}
                        className="w-full rounded-xl border border-dashed border-gray-300 text-xs font-semibold text-gray-400 py-2 hover:border-gray-400 hover:text-gray-600 transition">
                        + Add TV
                      </button>
                    )}
                  </div>
                )}

                {newForm.serviceType === "moreTvs" && (
                  <textarea
                    rows={2}
                    value={newForm.moreTvsComment}
                    onChange={e => setNewForm(f => ({ ...f, moreTvsComment: e.target.value }))}
                    placeholder="Details for the customer (e.g. 4 TVs, pricing TBD)…"
                    className="w-full rounded-xl border border-gray-200 bg-amber-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                )}
              </div>

              {/* Status + Notes */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Status & Notes</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {STATUS_FLOW.map(s => (
                    <button key={s} type="button" onClick={() => setNewForm(f => ({ ...f, status: s }))}
                      className={`rounded-xl border py-2 text-xs font-semibold transition ${
                        newForm.status === s
                          ? STATUS_CONFIG[s].color + " shadow-sm"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}>
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
                <textarea rows={2} value={newForm.notes} onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Internal notes…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300" />
              </div>

              {newErr && <p className="text-xs text-red-500 font-medium">{newErr}</p>}
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setNewModal(false)}
                className="flex-1 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={creating}
                className="flex-1 rounded-xl bg-[#E50914] text-white text-sm font-bold py-2.5 hover:bg-red-700 transition disabled:opacity-50">
                {creating ? "Creating…" : "Create Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Booking Modal */}
      {completeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-0.5">Complete Booking</h2>
            <p className="text-sm text-gray-500 mb-5">{completeModal.name}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount Charged to Customer</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={completeForm.amountCharged}
                    onChange={e => setCompleteForm(f => ({ ...f, amountCharged: e.target.value }))}
                    placeholder="0.00"
                    autoFocus
                    className="w-full rounded-xl border border-gray-200 pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount Paid to Workers</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={completeForm.amountPaidWorkers}
                    onChange={e => setCompleteForm(f => ({ ...f, amountPaidWorkers: e.target.value }))}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-gray-200 pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                </div>
              </div>

              {profit !== null && (
                <div className={`rounded-xl border p-4 ${profit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    Company Profit
                  </p>
                  <p className={`text-3xl font-extrabold ${profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    ${profit.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCompleteModal(null)}
                className="flex-1 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={completing}
                className="flex-1 rounded-xl bg-emerald-500 text-white text-sm font-bold py-2.5 hover:bg-emerald-600 transition disabled:opacity-50"
              >
                {completing ? "Saving…" : "Mark Complete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking: b, expanded, noteValue, onToggle, onStatus, onNoteChange, onNoteSave, onDelete, installers, onAssign }) {
  const [selectedInstaller, setSelectedInstaller] = useState("")
  const [assigning,         setAssigning]         = useState(false)

  async function handleAssign() {
    const inst = installers.find(i => i.id === selectedInstaller)
    if (!inst) return
    setAssigning(true)
    await onAssign(inst)
    setAssigning(false)
    setSelectedInstaller("")
  }

  const sc          = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
  const fullName    = `${b.firstName} ${b.lastName}`
  const fullAddress = [b.address?.street, b.address?.apt, b.address?.city, b.address?.state, b.address?.zip].filter(Boolean).join(", ")
  const createdDate = new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const createdTime = new Date(b.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header — always visible */}
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition" onClick={onToggle}>
        <div className={`w-2.5 h-2.5 rounded-full flex-none ${
          b.status === "pending"   ? "bg-amber-400"   :
          b.status === "confirmed" ? "bg-blue-500"    :
          b.status === "completed" ? "bg-emerald-500" : "bg-gray-300"
        }`} />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{fullName}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {b.date ? `📅 ${b.date}` : "No date set"}
            {b.timePreference && ` · ${b.timePreference}`}
          </p>
        </div>

        <div className="hidden sm:block text-right flex-none">
          {b.selectedPromo ? (
            <span className="text-xs font-semibold text-[#E50914]">
              {b.selectedPromo.includes("55") ? "$199 Promo" : "$260 Promo"}
            </span>
          ) : b.moreTvs ? (
            <span className="text-xs font-semibold text-amber-600">3+ TVs</span>
          ) : (
            <span className="text-xs text-gray-500">
              {b.tvs?.length || 0} TV{b.tvs?.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {b.status === "completed" && b.companyProfit != null && (
          <div className="hidden sm:block text-right flex-none">
            <span className="text-xs font-semibold text-emerald-600">+${Number(b.companyProfit).toFixed(0)}</span>
          </div>
        )}

        <span className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.color}`}>
          {sc.label}
        </span>

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

              {b.selectedPromo && (
                <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-3">
                  <p className="text-xs font-bold text-[#E50914] uppercase tracking-wide mb-1">Promo Package</p>
                  <p className="text-sm font-semibold text-gray-800">{b.selectedPromo}</p>
                  <p className="text-lg font-extrabold text-[#E50914] mt-1">
                    {b.selectedPromo.includes("55") ? "$199" : "$260"}
                  </p>
                </div>
              )}

              {b.moreTvs && (
                <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">3+ TVs — Custom Quote</p>
                  <p className="text-xs text-amber-600 mb-1">Pricing to be confirmed with customer</p>
                  {b.moreTvsComment && (
                    <p className="text-sm text-amber-800 italic border-t border-amber-200 pt-2">
                      "{b.moreTvsComment}"
                    </p>
                  )}
                </div>
              )}

              {!b.selectedPromo && !b.moreTvs && b.tvs?.length > 0 && (
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
              )}

              {!b.selectedPromo && !b.moreTvs && !b.tvs?.length && (
                <p className="mt-3 text-xs text-gray-400 italic">No service details recorded</p>
              )}

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

            {/* Column 3 — Installer, Status & Notes */}
            <section>
              <SectionTitle>Installer</SectionTitle>

              {b.installerName ? (
                <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#E50914]/10 flex items-center justify-center flex-none">
                      <span className="text-[#E50914] font-bold text-xs">
                        {b.installerName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{b.installerName}</p>
                      <p className="text-xs text-gray-500">{b.installerEmail}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Assigned {b.assignedAt ? new Date(b.assignedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : ""}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-3">No installer assigned yet</p>
              )}

              {installers.length > 0 && (
                <div className="flex gap-2 mb-5">
                  <select
                    value={selectedInstaller}
                    onChange={e => setSelectedInstaller(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <option value="">Select installer…</option>
                    {installers.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssign}
                    disabled={!selectedInstaller || assigning}
                    className="rounded-xl bg-[#E50914] text-white text-xs font-bold px-4 py-2 hover:bg-red-700 transition disabled:opacity-40"
                  >
                    {assigning ? "…" : "Assign"}
                  </button>
                </div>
              )}

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

              {/* Financial summary (completed bookings) */}
              {b.status === "completed" && b.amountCharged != null && (
                <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Financials</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Charged</span>
                      <span className="font-semibold">${Number(b.amountCharged).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paid Workers</span>
                      <span className="font-semibold">${Number(b.amountPaidWorkers).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-emerald-200 pt-1.5 mt-1.5">
                      <span className="font-bold text-emerald-700">Profit</span>
                      <span className="font-extrabold text-emerald-700">${Number(b.companyProfit).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Internal Notes</label>
              <textarea
                rows={3}
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

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
      />
    </div>
  )
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
