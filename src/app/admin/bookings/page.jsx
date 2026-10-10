"use client"
import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { MiniCalendar, TimeSlots } from "@/app/components/DateTimePicker"

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const MONTHS_LONG  = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DOW          = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const TV_SIZES   = ['Under 32"', '32" – 42"', '43" – 55"', '56" – 65"', '66" – 75"', '75"+']
const WALL_TYPES = ["Drywall (standard)", "Concrete / Brick", "Tile", "Above fireplace"]
const PAYMENTS   = ["Cash", "Zelle", "PayPal", "Venmo", "Other"] // no cards, no checks

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
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700 border-amber-200",     dot: "bg-amber-400"   },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200",        dot: "bg-blue-500"    },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500 border-gray-200",        dot: "bg-gray-300"    },
}

const STATUS_FLOW = ["pending", "confirmed", "completed", "cancelled"]

// Keyed by the exact promo label the booking form sends. Matching on a substring
// mislabels the mixed package, which contains both sizes.
const PROMO_PRICES = {
  '2 TVs up to 55"':                  "From $199",
  '2 TVs up to 70"':                  "From $250",
  '1 TV up to 55" + 1 TV up to 70"': "From $230",
}

const HOME_INSTALL_LABELS = {
  furniture:      "Furniture Assembly",
  mirror_picture: "Picture / Mirror Hanging",
  shelves_wall:   "Shelves & Wall Installation",
  gazebo:         "Gazebo / Pergola Assembly",
  playset:        "Playground / Playset Installation",
  other:          "Other Installation",
}

function pad(n) { return String(n).padStart(2, "0") }
function isoDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}
function addDays(iso, n) {
  const d = new Date(iso + "T12:00:00")
  d.setDate(d.getDate() + n)
  return isoDate(d)
}
function fmtDay(iso, opts = { month: "short", day: "numeric" }) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", opts)
}

// Date ranges the stats and the list can be narrowed to. Dates are compared as
// "YYYY-MM-DD" strings in the office's local time, so "today" is never off by
// one in the evening the way a UTC date would be.
const PERIODS = [
  { key: "all",       label: "All dates"   },
  { key: "today",     label: "Today"       },
  { key: "tomorrow",  label: "Tomorrow"    },
  { key: "week",      label: "This week"   },
  { key: "next7",     label: "Next 7 days" },
  { key: "month",     label: "This month"  },
  { key: "lastMonth", label: "Last month"  },
  { key: "custom",    label: "Custom"      },
]

function periodBounds(key, today) {
  const t = new Date(today + "T12:00:00")
  const y = t.getFullYear(), m = t.getMonth()
  switch (key) {
    case "today":     return { from: today, to: today }
    case "tomorrow":  { const d = addDays(today, 1); return { from: d, to: d } }
    case "week":      { const from = addDays(today, -t.getDay()); return { from, to: addDays(from, 6) } }
    case "next7":     return { from: today, to: addDays(today, 6) }
    case "month":     return { from: isoDate(new Date(y, m, 1)),     to: isoDate(new Date(y, m + 1, 0)) }
    case "lastMonth": return { from: isoDate(new Date(y, m - 1, 1)), to: isoDate(new Date(y, m, 0)) }
    default:          return { from: "", to: "" }
  }
}

function periodLabel(range) {
  if (!range) return "All dates"
  if (range.from === range.to) return fmtDay(range.from, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  const sameYear = range.from.slice(0, 4) === range.to.slice(0, 4)
  return `${fmtDay(range.from, sameYear ? undefined : { month: "short", day: "numeric", year: "numeric" })} – ${fmtDay(range.to, { month: "short", day: "numeric", year: "numeric" })}`
}

export default function BookingsPage() {
  const [bookings,       setBookings]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [search,         setSearch]         = useState("")
  const [filter,         setFilter]         = useState("all")
  const [expanded,       setExpanded]       = useState(null)
  const [noteEdit,       setNoteEdit]       = useState({})
  const [installers,     setInstallers]     = useState([])

  // Calendar state
  const [calYear,        setCalYear]        = useState(() => new Date().getFullYear())
  const [calMonth,       setCalMonth]       = useState(() => new Date().getMonth())
  // Date filter. A day clicked on the calendar is a one-day period ("day").
  const [period,         setPeriod]         = useState({ key: "all", from: "", to: "" })

  // Modals
  const [completeModal,  setCompleteModal]  = useState(null)
  const [completeForm,   setCompleteForm]   = useState({ amountCharged: "", materialsCost: "", profitType: "percent", profitValue: "" })
  const [completing,     setCompleting]     = useState(false)
  const [crewSplit,      setCrewSplit]      = useState([])   // [{installerId, installerName, sharePct}]

  const [newModal,       setNewModal]       = useState(false)
  const [newForm,        setNewForm]        = useState(BLANK_FORM)
  const [newErr,         setNewErr]         = useState("")
  const [creating,       setCreating]       = useState(false)

  const [schedModal,     setSchedModal]     = useState(null) // { id, name }
  const [schedDate,      setSchedDate]      = useState("")
  const [schedTime,      setSchedTime]      = useState("")
  const [savingSched,    setSavingSched]    = useState(false)

  // Arriving from Customers with ?new=1&firstName=… opens the form already
  // filled in, so a repeat job is never retyped.
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.get("new") !== "1") return
    const g = k => searchParams.get(k) || ""
    setNewForm(f => ({
      ...BLANK_FORM,
      firstName: g("firstName"), lastName: g("lastName"),
      email:     g("email"),     phone:    g("phone"),
      street:    g("street"),    city:     g("city") || "Nashville",
      state:     g("state") || "TN", zip:   g("zip"),
      referral:  g("referral"),
      payment:   g("payment") || BLANK_FORM.payment,
    }))
    setNewErr("")
    setNewModal(true)
    window.history.replaceState(null, "", "/admin/bookings")
  }, [searchParams])

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
    } finally { setLoading(false) }
  }

  // ── New booking ──────────────────────────────────────────────────────────────
  function addTv() {
    setNewForm(f => ({ ...f, tvs: [...f.tvs, { size: '43" – 55"', wallType: "Drywall (standard)", exactSize: "", comments: "" }] }))
  }
  function removeTv(idx) { setNewForm(f => ({ ...f, tvs: f.tvs.filter((_, i) => i !== idx) })) }
  function updateTv(idx, field, val) {
    setNewForm(f => ({ ...f, tvs: f.tvs.map((tv, i) => i === idx ? { ...tv, [field]: val } : tv) }))
  }

  async function handleCreate() {
    if (!newForm.firstName.trim() || !newForm.lastName.trim()) { setNewErr("First and last name are required"); return }
    setNewErr(""); setCreating(true)
    const promo =
      newForm.serviceType === "promo199" ? '2 TVs Up To 55" — $199 Package' :
      newForm.serviceType === "promo260" ? '2 TVs Up To 65" — $260 Package' : null
    const body = {
      firstName: newForm.firstName, lastName: newForm.lastName,
      email: newForm.email, phone: newForm.phone,
      date: newForm.date, timePref: newForm.timePref,
      address: { street: newForm.street, city: newForm.city, state: newForm.state, zip: newForm.zip },
      payment: newForm.payment, referral: newForm.referral, promo,
      tvs: newForm.serviceType === "tvs" ? newForm.tvs : [],
      moreTvs: newForm.serviceType === "moreTvs", moreTvsComment: newForm.moreTvsComment,
      notes: newForm.notes, status: newForm.status,
    }
    const res  = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.ok) { setBookings(prev => [data.booking, ...prev]); setNewModal(false); setNewForm(BLANK_FORM) }
    else setNewErr("Error creating booking — try again")
    setCreating(false)
  }

  // ── Status / notes ───────────────────────────────────────────────────────────
  async function updateStatus(id, status) {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b))
    await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) })
  }

  async function saveNote(id) {
    const notes = noteEdit[id] ?? ""
    setBookings(prev => prev.map(b => b._id === id ? { ...b, notes } : b))
    setNoteEdit(prev => { const n = { ...prev }; delete n[id]; return n })
    await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, notes }) })
  }

  // Assign one or more installers. The pay split comes from each person's
  // weight, so it does not have to be decided here.
  async function assignCrew(bookingId, installerIds) {
    const res  = await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, crew: installerIds }),
    })
    const data = await res.json()
    if (data.ok) await loadBookings()
    return data
  }

  async function assignInstaller(bookingId, installer) {
    setBookings(prev => prev.map(b => b._id === bookingId
      ? { ...b, installerId: installer.id, installerName: installer.name, installerEmail: installer.email } : b
    ))
    await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, installerId: installer.id, installerName: installer.name, installerEmail: installer.email }),
    })
  }

  async function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return
    setBookings(prev => prev.filter(b => b._id !== id))
    if (expanded === id) setExpanded(null)
    await fetch(`/api/bookings?id=${id}`, { method: "DELETE" })
  }

  // ── Complete ─────────────────────────────────────────────────────────────────
  // Prefill the split from the assigned installer's default so it is agreed once
  // per person instead of retyped on every job. profitValue is the COMPANY's
  // share, so an installer on 65% means the company keeps 35.
  function openCompleteModal(id, name) {
    const booking = bookings.find(b => b._id === id)
    const inst    = installers.find(i => i.id === booking?.installerId)

    let profitType = "percent", profitValue = ""
    if (inst) {
      if (inst.commissionType === "fixed") {
        // A fixed installer fee is not a fixed company profit, so it cannot be
        // prefilled into this field. Left blank rather than guessed wrong.
        profitType = "percent"
      } else if (inst.commissionValue != null) {
        profitValue = String(100 - Number(inst.commissionValue))
      }
    }

    setCompleteModal({ id, name, installerName: booking?.installerName || "", installer: inst || null })
    setCompleteForm({ amountCharged: "", materialsCost: "", profitType, profitValue })

    // Seed the split from the crew already on the job so it only needs touching
    // when this particular job was shared differently than usual.
    const crew = Array.isArray(booking?.crew) ? booking.crew : []
    setCrewSplit(crew.map(m => ({
      installerId:    m.installerId,
      installerName:  m.installerName,
      installerEmail: m.installerEmail,
      sharePct:       m.sharePct == null ? 0 : Number(m.sharePct),
    })))
  }

  async function handleComplete() {
    if (!completeModal) return
    setCompleting(true)
    const charged     = parseFloat(completeForm.amountCharged) || 0
    const materials    = parseFloat(completeForm.materialsCost) || 0
    const profitType  = completeForm.profitType
    const profitValue = parseFloat(completeForm.profitValue) || 0
    const res  = await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: completeModal.id, status: "completed",
        amountCharged: charged, materialsCost: materials, profitType, profitValue,
        crewShares: crewSplit.length ? crewSplit : undefined,
      }),
    })
    const data = await res.json()
    if (data.ok) {
      setCompleteModal(null)
      // Reload so the stored per-person amounts come back from the server
      // rather than being guessed here.
      await loadBookings()
    } else {
      alert(data.error || "Could not complete this job.")
    }
    setCompleting(false)
  }

  // ── Update materials cost / profit target ────────────────────────────────────
  function updateMaterials(id, materialsCost, companyProfit, amountPaidWorkers) {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, materialsCost, companyProfit, amountPaidWorkers } : b))
  }

  function updateProfit(id, profitType, profitValue, companyProfit, amountPaidWorkers) {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, profitType, profitValue, companyProfit, amountPaidWorkers } : b))
  }

  // ── Resend installer email ───────────────────────────────────────────────────
  async function resendInstallerEmail(bookingId) {
    await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, resendInstaller: true }),
    })
  }

  // ── Resend the confirmation to the customer ─────────────────────────────────
  async function resendClientEmail(bookingId) {
    const res  = await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, resendClientEmail: true }),
    })
    return res.json()
  }

  // ── Ask the customer for a Google review ────────────────────────────────────
  async function sendReviewRequest(bookingId) {
    try {
      const res  = await fetch("/api/bookings", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, sendReviewRequest: true }),
      })
      const data = await res.json()
      if (data.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId
          ? { ...b, reviewRequestedAt: data.reviewRequestedAt, reviewRequestCount: data.reviewRequestCount } : b))
      }
      return data
    } catch {
      return { ok: false, error: "No connection" }
    }
  }

  // Keeps the list's signed badge in step with what the closeout panel loads.
  function updateCloseout(bookingId, fields) {
    setBookings(prev => prev.map(b => b._id === bookingId &&
      (b.closeoutSignedAt !== fields.closeoutSignedAt || b.closeoutTip !== fields.closeoutTip)
      ? { ...b, ...fields } : b))
  }

  // ── Correct a customer's name, email or phone ───────────────────────────────
  async function saveCustomer(bookingId, fields) {
    const res  = await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, updateCustomer: true, ...fields }),
    })
    const data = await res.json()
    if (data.ok && data.booking) {
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, ...data.booking } : b))
    }
    return data
  }

  // ── Edit schedule ────────────────────────────────────────────────────────────
  function openSchedModal(b) {
    setSchedModal({ id: b._id, name: `${b.firstName} ${b.lastName}` })
    setSchedDate(b.date || "")
    setSchedTime(b.timePreference || "")
  }

  async function saveSchedule() {
    if (!schedModal) return
    setSavingSched(true)
    const res  = await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: schedModal.id, updateSchedule: true, date: schedDate, timePref: schedTime }),
    })
    const data = await res.json()
    if (data.ok) {
      setBookings(prev => prev.map(b => b._id === schedModal.id
        ? { ...b, date: schedDate, timePreference: schedTime } : b
      ))
      setSchedModal(null)
    }
    setSavingSched(false)
  }

  // ── Calendar helpers ─────────────────────────────────────────────────────────
  function calPrev() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  function calNext() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  // ── Derived data ─────────────────────────────────────────────────────────────
  const statusFiltered = useMemo(() =>
    bookings.filter(b => filter === "all" || b.status === filter),
    [bookings, filter]
  )

  // The active date range, or null for all dates. A custom range typed back to
  // front still works, and an open end means "from this day on" / "up to it".
  const range = useMemo(() => {
    if (period.key === "all" || (!period.from && !period.to)) return null
    let from = period.from || "0000-01-01", to = period.to || "9999-12-31"
    if (from > to) [from, to] = [to, from]
    return { from, to }
  }, [period])
  const selectedDay = range && range.from === range.to ? range.from : null

  // Everything in the period that matches the search, whatever its status.
  // The stat cards count this, so they always answer "in these dates".
  const inPeriod = useMemo(() => {
    const q = search.toLowerCase()
    return bookings.filter(b => {
      const matchSearch = !q ||
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) || b.phone?.includes(q) ||
        b.address?.city?.toLowerCase().includes(q)
      const matchDate = !range || (!!b.date && b.date >= range.from && b.date <= range.to)
      return matchSearch && matchDate
    })
  }, [bookings, search, range])

  // With a date range the list reads in calendar order, soonest first.
  const filtered = useMemo(() => {
    const list = inPeriod.filter(b => filter === "all" || b.status === filter)
    return range ? [...list].sort((a, b) => (a.date || "").localeCompare(b.date || "")) : list
  }, [inPeriod, filter, range])

  // Bookings in the current calendar month (used to paint the calendar)
  const calBookings = useMemo(() => {
    const prefix = `${calYear}-${pad(calMonth + 1)}`
    return statusFiltered.filter(b => b.date?.startsWith(prefix))
  }, [statusFiltered, calYear, calMonth])

  // Map day → array of bookings
  const byDay = useMemo(() => {
    const map = {}
    calBookings.forEach(b => {
      const d = parseInt(b.date?.split("-")[2])
      if (!d) return
      if (!map[d]) map[d] = []
      map[d].push(b)
    })
    return map
  }, [calBookings])

  const stats = useMemo(() => {
    const count = s => inPeriod.filter(b => b.status === s).length
    return {
      all:       inPeriod.length,
      pending:   count("pending"),
      confirmed: count("confirmed"),
      completed: count("completed"),
      cancelled: count("cancelled"),
    }
  }, [inPeriod])

  const todayISO  = isoDate(new Date())

  function choosePeriod(key) {
    if (key === "custom") {
      setPeriod(p => ({ key: "custom", from: p.from || todayISO, to: p.to || todayISO }))
      return
    }
    const b = periodBounds(key, todayISO)
    setPeriod({ key, ...b })
    // Bring the calendar to the start of the period so it shows the same dates.
    if (b.from) {
      const d = new Date(b.from + "T12:00:00")
      setCalYear(d.getFullYear()); setCalMonth(d.getMonth())
    }
  }
  function pickDay(iso) {
    setPeriod(selectedDay === iso ? { key: "all", from: "", to: "" } : { key: "day", from: iso, to: iso })
  }
  const ccCharged   = parseFloat(completeForm.amountCharged) || 0
  const ccMaterials = parseFloat(completeForm.materialsCost) || 0
  const ccSubtotal  = ccCharged - ccMaterials
  const ccProfitVal = parseFloat(completeForm.profitValue) || 0
  const ccProfit    = completeForm.profitType === "fixed" ? ccProfitVal : ccSubtotal * (ccProfitVal / 100)
  const ccWorkerPay = ccSubtotal - ccProfit
  const showPreview = completeForm.amountCharged || completeForm.materialsCost || completeForm.profitValue
  const crewTotal   = crewSplit.reduce((t, m) => t + (Number(m.sharePct) || 0), 0)
  const crewValid   = crewSplit.length === 0 || Math.abs(crewTotal - 100) < 0.5

  // Calendar grid
  const firstDow    = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const calCells    = []
  for (let i = 0; i < firstDow; i++) calCells.push(null)
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
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
            + New
          </button>
        </div>
      </div>

      {/* Period — narrows the stats and the list to a set of dates */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4 mb-4">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Dates</p>
          <p className="text-sm font-semibold text-gray-700 truncate" aria-live="polite">{periodLabel(range)}</p>
        </div>
        <div role="group" aria-label="Show bookings for"
          className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PERIODS.map(p => {
            const on = period.key === p.key
            return (
              <button key={p.key} type="button" aria-pressed={on} onClick={e => { choosePeriod(p.key); e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" }) }}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold border transition ${
                  on ? "bg-[#E50914] text-white border-[#E50914] shadow-sm"
                     : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                {p.label}
              </button>
            )
          })}
          {period.key === "day" && (
            <button type="button" aria-pressed="true" onClick={() => choosePeriod("all")}
              className="shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold border bg-[#E50914] text-white border-[#E50914] shadow-sm">
              {fmtDay(period.from)} ×
            </button>
          )}
        </div>
        {period.key === "custom" && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <label className="block">
              <span className="block text-xs font-semibold text-gray-500 mb-1">From</span>
              <input type="date" value={period.from} max={period.to || undefined}
                onChange={e => setPeriod(p => ({ ...p, from: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-gray-500 mb-1">To</span>
              <input type="date" value={period.to} min={period.from || undefined}
                onChange={e => setPeriod(p => ({ ...p, to: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </label>
          </div>
        )}
      </div>

      {/* Stats — each card also filters the list by that status */}
      <div role="group" aria-label="Filter by status" className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {[
          { key: "all",       label: "Total",     bg: "bg-white",      ring: "ring-gray-900"   },
          { key: "pending",   label: "Pending",   bg: "bg-amber-50",   ring: "ring-amber-500"  },
          { key: "confirmed", label: "Confirmed", bg: "bg-blue-50",    ring: "ring-blue-500"   },
          { key: "completed", label: "Completed", bg: "bg-emerald-50", ring: "ring-emerald-500" },
          { key: "cancelled", label: "Cancelled", bg: "bg-gray-50",    ring: "ring-gray-400"   },
        ].map(s => {
          const on = filter === s.key
          return (
            <button key={s.key} type="button" aria-pressed={on}
              onClick={() => setFilter(on && s.key !== "all" ? "all" : s.key)}
              className={`${s.bg} ${s.key === "all" ? "col-span-2 md:col-span-1" : ""} text-left rounded-2xl border p-3 sm:p-4 shadow-sm transition hover:shadow-md ${
                on ? `border-transparent ring-2 ${s.ring}` : "border-gray-200"
              }`}>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                {s.key !== "all" && <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s.key].dot}`} />}
                {s.label}
              </span>
              <span className="block text-2xl sm:text-3xl font-extrabold text-gray-900 mt-0.5 sm:mt-1">{stats[s.key]}</span>
            </button>
          )
        })}
      </div>

      {/* ── Admin Calendar ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-5 mb-5">
        {/* Cal header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={calPrev}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 text-xl font-bold transition">
              ‹
            </button>
            <h2 className="text-base font-extrabold text-gray-900 min-w-[130px] text-center sm:text-left">
              {MONTHS_LONG[calMonth]} {calYear}
            </h2>
            <button onClick={calNext}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 text-xl font-bold transition">
              ›
            </button>
            <button onClick={() => { setCalYear(new Date().getFullYear()); setCalMonth(new Date().getMonth()) }}
              className="text-xs font-semibold text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 transition">
              Today
            </button>
          </div>

          {range && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">
                {selectedDay ? fmtDay(selectedDay, { weekday: "short", month: "short", day: "numeric" }) : periodLabel(range)}
                {" — "}{filtered.length} booking{filtered.length !== 1 ? "s" : ""}
              </span>
              <button onClick={() => choosePeriod("all")}
                className="text-xs text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-red-50 transition">
                Clear ×
              </button>
            </div>
          )}
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1 sm:mb-2">
          {DOW.map(d => (
            <div key={d} className="text-center text-[10px] sm:text-xs font-semibold text-gray-400 py-1">
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {calCells.map((d, i) => {
            if (!d) return <div key={`e${i}`} />
            const iso    = `${calYear}-${pad(calMonth+1)}-${pad(d)}`
            const dayBs  = byDay[d] || []
            const isToday = iso === todayISO
            const isSel  = iso === selectedDay
            const inRange = !!range && !selectedDay && iso >= range.from && iso <= range.to
            const hasBks = dayBs.length > 0

            return (
              <button
                key={iso}
                onClick={() => pickDay(iso)}
                aria-pressed={isSel}
                aria-label={`${fmtDay(iso, { weekday: "long", month: "long", day: "numeric" })}, ${dayBs.length} booking${dayBs.length !== 1 ? "s" : ""}`}
                className={`relative flex flex-col p-1 sm:p-1.5 rounded-lg sm:rounded-xl border text-left transition min-h-[36px] sm:min-h-[70px] ${
                  isSel    ? "bg-[#E50914] border-[#E50914] shadow-md" :
                  isToday  ? "border-[#E50914]/40 bg-red-50" :
                  inRange  ? "border-red-100 bg-red-50/50 hover:border-[#E50914]/40" :
                  hasBks   ? "border-gray-200 bg-white hover:border-[#E50914]/40 hover:shadow-sm" :
                             "border-transparent bg-gray-50/50 hover:bg-gray-100"
                }`}
              >
                <span className={`text-[10px] sm:text-xs font-bold ${isSel ? "text-white" : isToday ? "text-[#E50914]" : "text-gray-600"}`}>
                  {d}
                </span>

                {/* Mobile: colored dots */}
                {hasBks && (
                  <div className="flex flex-wrap gap-0.5 mt-0.5 sm:hidden">
                    {dayBs.slice(0, 3).map(b => (
                      <div key={b._id} className={`w-1.5 h-1.5 rounded-full ${
                        isSel              ? "bg-white" :
                        b.status === "confirmed" ? "bg-blue-500" :
                        b.status === "completed" ? "bg-emerald-500" :
                        b.status === "cancelled" ? "bg-gray-400" :
                        "bg-amber-400"
                      }`} />
                    ))}
                    {dayBs.length > 3 && (
                      <span className={`text-[7px] font-bold leading-tight ${isSel ? "text-white/70" : "text-gray-400"}`}>
                        +{dayBs.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Desktop: name pills */}
                {dayBs.slice(0, 2).map(b => (
                  <span key={b._id} className={`hidden sm:block text-[10px] font-medium truncate w-full leading-tight py-0.5 px-1 rounded mb-0.5 ${
                    isSel ? "bg-white/20 text-white" :
                    b.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                    b.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                    b.status === "cancelled" ? "bg-gray-100 text-gray-500" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {b.firstName} {b.lastName?.charAt(0)}.
                  </span>
                ))}
                {dayBs.length > 2 && (
                  <span className={`hidden sm:block text-[10px] font-semibold ${isSel ? "text-white/70" : "text-gray-400"}`}>
                    +{dayBs.length - 2} more
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          {STATUS_FLOW.map(s => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
              <span className="text-xs text-gray-500">{STATUS_CONFIG[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone or city…"
          type="search"
          aria-label="Search bookings"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
        />
      </div>

      {/* Booking list */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading bookings…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {selectedDay
            ? `No ${filter === "all" ? "" : STATUS_CONFIG[filter].label.toLowerCase() + " "}bookings on ${fmtDay(selectedDay, { weekday: "long", month: "long", day: "numeric" })}`
            : range
            ? `No ${filter === "all" ? "" : STATUS_CONFIG[filter].label.toLowerCase() + " "}bookings for ${periodLabel(range)}`
            : "No bookings found."}
        </div>
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
              onAssignCrew={ids => assignCrew(b._id, ids)}
              onEditSchedule={() => openSchedModal(b)}
              onResend={() => resendInstallerEmail(b._id)}
              onResendClient={() => resendClientEmail(b._id)}
              onReviewRequest={() => sendReviewRequest(b._id)}
              onCloseoutChange={fields => updateCloseout(b._id, fields)}
              onSaveCustomer={fields => saveCustomer(b._id, fields)}
              onMaterialsUpdate={updateMaterials}
              onProfitUpdate={updateProfit}
            />
          ))}
        </div>
      )}

      {/* ── New Booking Modal ─────────────────────────────────────────────────── */}
      {newModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4 py-0 sm:py-8 overflow-y-auto">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg sm:my-auto">
            <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-gray-900">New Booking</h2>
              <button onClick={() => setNewModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>

            <div className="px-5 sm:px-6 py-5 space-y-5 overflow-y-auto max-h-[75vh] sm:max-h-none">
              {/* Customer */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Customer</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Date</label>
                    <input type="date" value={newForm.date} onChange={e => setNewForm(f => ({ ...f, date: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Time</label>
                    <input type="text" value={newForm.timePref} onChange={e => setNewForm(f => ({ ...f, timePref: e.target.value }))}
                      placeholder="e.g. 10:00 AM"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Address</p>
                <div className="space-y-2">
                  <Field label="Street" value={newForm.street} onChange={v => setNewForm(f => ({ ...f, street: v }))} placeholder="123 Main St" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="col-span-2 sm:col-span-1">
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
                    { val: "tvs",      label: "Individual TVs" },
                    { val: "promo199", label: "$199 Promo"     },
                    { val: "promo260", label: "$260 Promo"     },
                    { val: "moreTvs",  label: "3+ TVs"         },
                  ].map(opt => (
                    <button key={opt.val} type="button" onClick={() => setNewForm(f => ({ ...f, serviceType: opt.val }))}
                      className={`rounded-xl border py-2 text-xs font-semibold transition ${
                        newForm.serviceType === opt.val
                          ? "bg-[#E50914] text-white border-[#E50914]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}>
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
                            <button type="button" onClick={() => removeTv(idx)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
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
                  <textarea rows={2} value={newForm.moreTvsComment} onChange={e => setNewForm(f => ({ ...f, moreTvsComment: e.target.value }))}
                    placeholder="Details (e.g. 4 TVs, pricing TBD)…"
                    className="w-full rounded-xl border border-gray-200 bg-amber-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300" />
                )}
              </div>

              {/* Status + Notes */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Status & Notes</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {STATUS_FLOW.map(s => (
                    <button key={s} type="button" onClick={() => setNewForm(f => ({ ...f, status: s }))}
                      className={`rounded-xl border py-2 text-xs font-semibold transition ${
                        newForm.status === s ? STATUS_CONFIG[s].color + " shadow-sm" : "border-gray-200 text-gray-500 hover:bg-gray-50"
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

            <div className="flex gap-3 px-5 sm:px-6 pb-6 pt-2">
              <button onClick={() => setNewModal(false)}
                className="flex-1 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold py-3 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={creating}
                className="flex-1 rounded-xl bg-[#E50914] text-white text-sm font-bold py-3 hover:bg-red-700 transition disabled:opacity-50">
                {creating ? "Creating…" : "Create Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Complete Modal ────────────────────────────────────────────────────── */}
      {completeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-0.5">Complete Booking</h2>
            <p className="text-sm text-gray-500 mb-5">{completeModal.name}</p>
            <div className="space-y-4">
              <AmountField label="Amount Charged to Customer" value={completeForm.amountCharged}
                onChange={v => setCompleteForm(f => ({ ...f, amountCharged: v }))} />
              <AmountField label="Materials & Tools Used" value={completeForm.materialsCost}
                onChange={v => setCompleteForm(f => ({ ...f, materialsCost: v }))}
                hint="Mounts, cables, hardware, etc. — subtracted from the total first" />

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Company Profit</label>
                <p className="text-[10px] text-gray-400 mt-0.5">The rest goes to the worker(s)</p>
                <div className="flex gap-2 mt-1.5">
                  <div className="flex rounded-xl border border-gray-200 overflow-hidden flex-none">
                    {["percent", "fixed"].map(t => (
                      <button key={t} type="button" onClick={() => setCompleteForm(f => ({ ...f, profitType: t }))}
                        className={`px-3 py-2.5 text-sm font-bold transition ${
                          completeForm.profitType === t ? "bg-[#E50914] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}>
                        {t === "percent" ? "%" : "$"}
                      </button>
                    ))}
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                      {completeForm.profitType === "fixed" ? "$" : "%"}
                    </span>
                    <input type="number" step="0.01" value={completeForm.profitValue}
                      onChange={e => setCompleteForm(f => ({ ...f, profitValue: e.target.value }))}
                      placeholder={completeForm.profitType === "fixed" ? "0.00" : "35"}
                      className="w-full rounded-xl border border-gray-200 pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                  </div>
                </div>
              </div>

              {crewSplit.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Worker pay split
                    </p>
                    <span className={`text-[11px] font-bold ${
                      Math.abs(crewTotal - 100) < 0.5 ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {crewTotal.toFixed(0)}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    {crewSplit.map((m, idx) => (
                      <div key={(m.installerId || m.installerName) + idx} className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700 flex-1 truncate">
                          {m.installerName}
                        </span>
                        <div className="relative flex-none">
                          <input type="number" min="0" max="100" step="1" value={m.sharePct}
                            onChange={e => {
                              const v = e.target.value
                              setCrewSplit(prev => prev.map((x, i) =>
                                i === idx ? { ...x, sharePct: v === "" ? "" : Number(v) } : x))
                            }}
                            className="w-20 rounded-lg border border-gray-200 pl-2 pr-6 py-1.5 text-xs text-right focus:outline-none focus:ring-2 focus:ring-red-300" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">%</span>
                        </div>
                        <span className="text-xs font-bold text-amber-700 w-20 text-right flex-none">
                          ${((ccWorkerPay * (Number(m.sharePct) || 0)) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {Math.abs(crewTotal - 100) >= 0.5 && (
                    <p className="mt-2 text-[11px] font-medium text-red-500">
                      The split has to add up to 100%.
                    </p>
                  )}
                  {crewSplit.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const even = Math.round((100 / crewSplit.length) * 100) / 100
                        setCrewSplit(prev => prev.map((x, i) => ({
                          ...x,
                          sharePct: i === 0
                            ? Math.round((100 - even * (prev.length - 1)) * 100) / 100
                            : even,
                        })))
                      }}
                      className="mt-2 text-[10px] text-gray-400 hover:text-[#E50914] underline underline-offset-2"
                    >
                      split evenly
                    </button>
                  )}
                </div>
              )}

              {showPreview && (
                <div className={`rounded-xl border p-4 space-y-1.5 ${ccProfit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal (Charged − Materials)</span>
                    <span className="font-semibold text-gray-700">${ccSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Worker Pay</span>
                    <span className="font-semibold text-gray-700">${ccWorkerPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-emerald-200 pt-1.5 mt-0.5">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${ccProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}>Company Profit</p>
                    <p className={`text-2xl font-extrabold ${ccProfit >= 0 ? "text-emerald-600" : "text-red-500"}`}>${ccProfit.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setCompleteModal(null)}
                className="flex-1 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleComplete} disabled={completing || !crewValid}
                className="flex-1 rounded-xl bg-emerald-500 text-white text-sm font-bold py-2.5 hover:bg-emerald-600 transition disabled:opacity-50">
                {completing ? "Saving…" : "Mark Complete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Schedule Modal ───────────────────────────────────────────────── */}
      {schedModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4 py-0 sm:py-8 overflow-y-auto">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg sm:my-auto">
            <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Edit Schedule</h2>
                <p className="text-sm text-gray-500">{schedModal.name}</p>
              </div>
              <button onClick={() => setSchedModal(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>

            <div className="px-5 sm:px-6 py-5 space-y-5 overflow-y-auto max-h-[75vh] sm:max-h-none">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Select Date</p>
                <MiniCalendar selectedDate={schedDate} onChange={d => { setSchedDate(d); setSchedTime("") }} />
              </div>

              {schedDate && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {new Date(schedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    {schedTime && <span className="text-[#E50914] ml-2 font-bold">· {schedTime}</span>}
                  </p>
                  <TimeSlots selected={schedTime} onChange={setSchedTime} />
                </div>
              )}
            </div>

            <div className="flex gap-3 px-5 sm:px-6 pb-6 pt-2">
              <button onClick={() => setSchedModal(null)}
                className="flex-1 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold py-3 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={saveSchedule} disabled={savingSched || !schedDate || !schedTime}
                className="flex-1 rounded-xl bg-[#E50914] text-white text-sm font-bold py-3 hover:bg-red-700 transition disabled:opacity-50">
                {savingSched ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── BookingCard ──────────────────────────────────────────────────────────────── */

function BookingCard({ booking: b, expanded, noteValue, onToggle, onStatus, onNoteChange, onNoteSave, onDelete, installers, onAssign, onEditSchedule, onResend, onResendClient, onReviewRequest, onCloseoutChange, onSaveCustomer, onAssignCrew, onMaterialsUpdate, onProfitUpdate }) {
  const [selectedInstaller, setSelectedInstaller] = useState("")
  const [crewPick,          setCrewPick]          = useState([])
  const [savingCrew,        setSavingCrew]        = useState(false)
  const [crewErr,           setCrewErr]           = useState("")

  const crew = Array.isArray(b.crew) ? b.crew : []

  // Start the picker from the crew already on the job, so adding a second
  // installer is one click rather than re-selecting everyone. Re-syncs whenever
  // the saved crew changes, which also resets the boxes after a save.
  const crewIds = crew.map(m => m.installerId).filter(Boolean).join(",")
  useEffect(() => {
    setCrewPick(crewIds ? crewIds.split(",") : [])
  }, [crewIds, expanded])

  function toggleCrew(id) {
    setCrewPick(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleAssignCrew() {
    setSavingCrew(true); setCrewErr("")
    const data = await onAssignCrew(crewPick)
    if (!data?.ok) setCrewErr(data?.error || "Could not assign.")
    setSavingCrew(false)
  }
  const [assigning,         setAssigning]         = useState(false)
  const [resending,         setResending]         = useState(false)
  const [resendOk,          setResendOk]          = useState(false)
  const [editMaterials,     setEditMaterials]     = useState(false)
  const [materialsVal,      setMaterialsVal]      = useState("")
  const [savingMat,         setSavingMat]         = useState(false)
  const [editProfit,        setEditProfit]        = useState(false)
  const [profitTypeVal,     setProfitTypeVal]     = useState("percent")
  const [profitValueVal,    setProfitValueVal]    = useState("")
  const [savingProfit,      setSavingProfit]      = useState(false)
  const [editCustomer,      setEditCustomer]      = useState(false)
  const [custForm,          setCustForm]          = useState({ firstName: "", lastName: "", email: "", phone: "" })
  const [savingCust,        setSavingCust]        = useState(false)
  const [custErr,           setCustErr]           = useState("")
  const [resendingClient,   setResendingClient]   = useState(false)
  const [clientResendState, setClientResendState] = useState("idle") // idle | ok | error
  const [clientResendMsg,   setClientResendMsg]   = useState("")
  const [reviewState,       setReviewState]       = useState("idle") // idle | sending | ok | error
  const [reviewMsg,         setReviewMsg]         = useState("")

  async function handleReviewRequest() {
    if (b.reviewRequestedAt) {
      const when = new Date(b.reviewRequestedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (!confirm(`A review request already went to ${b.email} on ${when}. Send it again?`)) return
    }
    setReviewState("sending"); setReviewMsg("")
    const data = await onReviewRequest()
    if (data?.ok) setReviewState("ok")
    else { setReviewState("error"); setReviewMsg(data?.error || "Could not send") }
    setTimeout(() => setReviewState("idle"), 5000)
  }

  async function handleSaveCustomer() {
    setSavingCust(true); setCustErr("")
    const data = await onSaveCustomer(custForm)
    if (data?.ok) setEditCustomer(false)
    else setCustErr(data?.error || "Could not save.")
    setSavingCust(false)
  }

  async function handleResendClient() {
    setResendingClient(true); setClientResendState("idle"); setClientResendMsg("")
    const data = await onResendClient()
    setResendingClient(false)
    if (data?.ok) {
      setClientResendState("ok")
    } else {
      setClientResendState("error")
      setClientResendMsg(data?.error || "Could not send")
    }
    setTimeout(() => setClientResendState("idle"), 5000)
  }

  async function handleResend() {
    setResending(true); setResendOk(false)
    await onResend()
    setResending(false); setResendOk(true)
    setTimeout(() => setResendOk(false), 3000)
  }

  async function handleSaveMaterials() {
    setSavingMat(true)
    const val = parseFloat(materialsVal) || 0
    const res  = await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b._id, updateMaterials: true, materialsCost: val }),
    })
    const data = await res.json()
    if (data.ok) {
      onMaterialsUpdate(b._id, val, data.profit, data.amountPaidWorkers)
      setEditMaterials(false)
    }
    setSavingMat(false)
  }

  async function handleSaveProfit() {
    setSavingProfit(true)
    const val = parseFloat(profitValueVal) || 0
    const res  = await fetch("/api/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b._id, updateProfit: true, profitType: profitTypeVal, profitValue: val }),
    })
    const data = await res.json()
    if (data.ok) {
      onProfitUpdate(b._id, profitTypeVal, val, data.profit, data.amountPaidWorkers)
      setEditProfit(false)
    }
    setSavingProfit(false)
  }

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
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 cursor-pointer hover:bg-gray-50 transition" onClick={onToggle}>
        <div className={`w-2.5 h-2.5 rounded-full flex-none ${sc.dot}`} />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate text-sm sm:text-base">{fullName}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {b.date
              ? `📅 ${new Date(b.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
              : "No date"}
            {b.timePreference && ` · ${b.timePreference}`}
          </p>
        </div>

        {b.status === "completed" && b.companyProfit != null && (
          <span className="text-xs font-semibold text-emerald-600 flex-none">+${Number(b.companyProfit).toFixed(0)}</span>
        )}

        {b.closeoutSignedAt && (
          <span title="Signed off by the customer" aria-label="Signed off by the customer"
            className="flex-none text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
            ✍️<span className="hidden sm:inline"> Signed</span>
          </span>
        )}
        {b.reviewRequestedAt && (
          <span title="Google review requested" aria-label="Google review requested" className="flex-none text-sm">⭐</span>
        )}

        <span className={`inline-flex text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-full border flex-none ${sc.color}`}>{sc.label}</span>

        <div className="text-right flex-none hidden md:block">
          <p className="text-xs text-gray-400">{createdDate}</p>
          <p className="text-xs text-gray-400">{createdTime}</p>
        </div>

        <span className="text-gray-400 text-xs flex-none">{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Col 1 — Customer */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <SectionTitleRaw>Customer</SectionTitleRaw>
                {!editCustomer && (
                  <button
                    onClick={() => {
                      setCustForm({
                        firstName: b.firstName || "", lastName: b.lastName || "",
                        email: b.email || "", phone: b.phone || "",
                      })
                      setCustErr("")
                      setEditCustomer(true)
                    }}
                    className="text-[10px] text-gray-400 hover:text-[#E50914] border border-gray-200 rounded px-1.5 py-0.5 hover:border-[#E50914]/30 transition"
                  >
                    edit
                  </button>
                )}
              </div>

              {editCustomer ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={custForm.firstName} placeholder="First name"
                      onChange={e => setCustForm(f => ({ ...f, firstName: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                    <input value={custForm.lastName} placeholder="Last name"
                      onChange={e => setCustForm(f => ({ ...f, lastName: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                  </div>
                  <input type="email" value={custForm.email} placeholder="Email"
                    onChange={e => setCustForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                  <input value={custForm.phone} placeholder="Phone"
                    onChange={e => setCustForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />

                  {custErr && <p className="text-[11px] font-medium text-red-500">{custErr}</p>}

                  <div className="flex gap-2">
                    <button onClick={handleSaveCustomer} disabled={savingCust}
                      className="flex-1 rounded-lg bg-emerald-500 text-white text-xs font-bold py-2 hover:bg-emerald-600 transition disabled:opacity-40">
                      {savingCust ? "Saving…" : "Save"}
                    </button>
                    <button onClick={() => { setEditCustomer(false); setCustErr("") }}
                      className="rounded-lg border border-gray-200 text-gray-500 text-xs px-3 py-2 hover:bg-gray-100 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <InfoRow icon="👤" value={fullName} />
                  <InfoRow icon="✉️" value={b.email
                    ? <a href={`mailto:${b.email}`} className="text-blue-600 hover:underline">{b.email}</a>
                    : <span className="text-gray-400">no email</span>} />
                  <InfoRow icon="📞" value={b.phone
                    ? <a href={`tel:${b.phone}`} className="text-blue-600 hover:underline">{b.phone}</a>
                    : <span className="text-gray-400">no phone</span>} />
                  <InfoRow icon="📍" value={fullAddress || "—"} />
                  <InfoRow icon="💬" value={b.referral || "—"} label="Referral" />
                  <InfoRow icon="💳" value={b.payment || "—"} label="Payment" />

                  {/* Resend the confirmation — for one that bounced, landed in
                      spam, or went out before the address was corrected. */}
                  <button
                    onClick={handleResendClient}
                    disabled={resendingClient || !b.email}
                    className={`mt-3 w-full rounded-xl border text-xs font-semibold py-2 transition disabled:opacity-40 ${
                      clientResendState === "ok"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : clientResendState === "error"
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-gray-200 text-gray-600 hover:border-[#E50914]/40 hover:text-[#E50914]"
                    }`}
                  >
                    {resendingClient
                      ? "Sending…"
                      : clientResendState === "ok"
                      ? "✓ Confirmation sent"
                      : clientResendState === "error"
                      ? (clientResendMsg || "Could not send")
                      : "✉️ Resend confirmation to customer"}
                  </button>
                  {!b.email && (
                    <p className="mt-1 text-[10px] text-gray-400">
                      Add an email above to enable this.
                    </p>
                  )}

                  {/* Google review request — sent only when you press it */}
                  <button
                    onClick={handleReviewRequest}
                    disabled={reviewState === "sending" || !b.email}
                    className={`mt-2 w-full rounded-xl border text-xs font-bold py-2 transition disabled:opacity-40 ${
                      reviewState === "ok"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : reviewState === "error"
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                    }`}
                  >
                    {reviewState === "sending"
                      ? "Sending…"
                      : reviewState === "ok"
                      ? "✓ Review request sent"
                      : reviewState === "error"
                      ? (reviewMsg || "Could not send")
                      : b.reviewRequestedAt ? "⭐ Ask for a Google review again" : "⭐ Ask for a Google review"}
                  </button>
                  {b.reviewRequestedAt && (
                    <p className="mt-1 text-[10px] text-gray-400">
                      Sent {new Date(b.reviewRequestedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {b.reviewRequestCount > 1 ? ` · ${b.reviewRequestCount} times` : ""}
                    </p>
                  )}
                </>
              )}
            </section>

            {/* Col 2 — Service */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <SectionTitleRaw>Service Details</SectionTitleRaw>
                <button onClick={e => { e.stopPropagation(); onEditSchedule() }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#E50914] hover:bg-red-50 border border-[#E50914]/30 rounded-lg px-2.5 py-1 transition">
                  ✏️ Edit Schedule
                </button>
              </div>

              {/* Date / Time — editable */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Appointment</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {b.date
                        ? new Date(b.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                        : <span className="text-gray-400 italic">No date set</span>}
                    </p>
                    {b.timePreference && (
                      <p className="text-sm text-[#E50914] font-bold mt-0.5">{b.timePreference}</p>
                    )}
                  </div>
                </div>
              </div>

              {b.bookingMode === "homeinstall" && (
                <div className="mt-2 rounded-xl bg-blue-50 border border-blue-200 p-3">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
                    🔧 Home Installation — Quote Based
                  </p>
                  <p className="text-sm font-semibold text-blue-900">
                    {HOME_INSTALL_LABELS[b.homeInstallService] || b.homeInstallService || "Installation"}
                  </p>
                  {b.comboDetails && (
                    <p className="mt-1 text-sm text-blue-800 whitespace-pre-line">{b.comboDetails}</p>
                  )}
                </div>
              )}
              {b.bookingMode === "bundle" && b.comboDetails && (
                <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Bundle — Job Description</p>
                  <p className="text-sm text-amber-900 whitespace-pre-line">{b.comboDetails}</p>
                </div>
              )}
              {b.selectedPromo && (
                <div className="mt-2 rounded-xl bg-red-50 border border-red-100 p-3">
                  <p className="text-xs font-bold text-[#E50914] uppercase tracking-wide mb-1">Promo Package</p>
                  <p className="text-sm font-semibold text-gray-800">{b.selectedPromo}</p>
                  <p className="text-lg font-extrabold text-[#E50914] mt-1">{PROMO_PRICES[b.selectedPromo] || "See quote"}</p>
                </div>
              )}
              {b.moreTvs && (
                <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">3+ TVs — Custom Quote</p>
                  {b.moreTvsComment && <p className="text-sm text-amber-800 italic">&quot;{b.moreTvsComment}&quot;</p>}
                </div>
              )}
              {!b.selectedPromo && !b.moreTvs && b.tvs?.length > 0 && (
                <div className="mt-2 space-y-2">
                  {b.tvs.map((tv, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${
                      tv.model === "frame" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold text-gray-500">TV #{i + 1}</p>
                        {tv.model === "frame" && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#E50914] bg-white border border-red-200 rounded-full px-2 py-0.5">
                            🖼️ Frame TV — quote
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold">
                        {tv.size ? `${tv.size}"` : "Size n/a"}{tv.exactSize ? ` (${tv.exactSize}")` : ""}
                      </p>
                      {tv.measurements && (
                        <p className="text-xs font-medium text-[#E50914] mt-0.5">📐 {tv.measurements}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">{tv.wallType}</p>
                      {tv.comments && <p className="text-xs text-gray-400 mt-0.5 italic">&quot;{tv.comments}&quot;</p>}
                    </div>
                  ))}
                </div>
              )}
              {b.couponCode && (
                <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Coupon — {b.couponCode}</p>
                  <p className="text-sm text-emerald-800">{b.appliedCouponLabel}</p>
                  {b.couponComment && <p className="mt-1 text-sm text-emerald-700 italic">&ldquo;{b.couponComment}&rdquo;</p>}
                </div>
              )}
              {b.customQuote && (
                <div className="mt-2 rounded-xl bg-red-50 border border-red-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#E50914] uppercase tracking-wide">
                      Custom Quote{b.customMode === "sized" ? " — TV Size & Qty" : " — Comment Only"}
                    </p>
                    {b.customPrice != null && (
                      <p className="text-lg font-extrabold text-[#E50914]">${Number(b.customPrice).toFixed(2)}</p>
                    )}
                  </div>
                  {b.customMode === "sized" && b.customTvSize && (
                    <p className="text-sm text-gray-800 mt-1">{b.customTvSize}{b.customTvQty ? ` × ${b.customTvQty}` : ""}</p>
                  )}
                </div>
              )}
            </section>

            {/* Col 3 — Installer + Status + Notes */}
            <section>
              <SectionTitle>Crew</SectionTitle>

              {crew.length > 0 ? (
                <div className="mb-3 space-y-2">
                  {crew.map((m, idx) => (
                    <div key={(m.installerId || m.installerName) + idx}
                      className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#E50914]/10 flex items-center justify-center flex-none">
                          <span className="text-[#E50914] font-bold text-xs">
                            {(m.installerName || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 truncate">{m.installerName}</p>
                          <p className="text-xs text-gray-500 truncate">{m.installerEmail || ""}</p>
                        </div>
                        <div className="text-right flex-none">
                          <p className="text-sm font-extrabold text-blue-700">
                            {m.sharePct == null ? "—" : `${m.sharePct}%`}
                          </p>
                          {m.amount != null && (
                            <p className="text-[11px] font-semibold text-amber-700">${Number(m.amount).toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {crew.length > 1 && (
                    <p className="text-[10px] text-gray-400">
                      Worker pay is divided between them by these percentages.
                    </p>
                  )}

                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className={`w-full rounded-xl border text-xs font-semibold py-1.5 transition ${
                      resendOk
                        ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                        : "border-blue-200 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {resendOk ? "✓ Email sent!" : resending ? "Sending…" : "↻ Resend Installer Email"}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-3">No crew assigned yet</p>
              )}

              {installers.length > 0 && (
                <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Assign crew
                  </p>
                  <div className="space-y-1.5 mb-2">
                    {installers.map(i => {
                      const on = crewPick.includes(i.id)
                      return (
                        <button key={i.id} type="button" onClick={() => toggleCrew(i.id)}
                          className={`w-full flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                            on ? "bg-[#E50914] text-white border-[#E50914]" : "bg-white border-gray-200 hover:bg-gray-100"
                          }`}>
                          <span className={`size-4 rounded border flex items-center justify-center text-[10px] flex-none ${
                            on ? "bg-white text-[#E50914] border-white" : "border-gray-300"
                          }`}>
                            {on ? "✓" : ""}
                          </span>
                          <span className="text-xs font-semibold flex-1 truncate">{i.name}</span>
                          <span className={`text-[10px] flex-none ${on ? "text-white/70" : "text-gray-400"}`}>
                            weight {i.crewShare ?? 50}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {crewPick.length > 1 && (
                    <p className="text-[11px] text-gray-500 mb-2">
                      Split:{" "}
                      {(() => {
                        const picked = crewPick.map(id => installers.find(i => i.id === id)).filter(Boolean)
                        const total  = picked.reduce((t, p) => t + (Number(p.crewShare) || 50), 0)
                        return picked
                          .map(p => `${p.name.split(" ")[0]} ${Math.round(((Number(p.crewShare) || 50) / total) * 100)}%`)
                          .join(" · ")
                      })()}
                    </p>
                  )}

                  {crewErr && <p className="text-[11px] font-medium text-red-500 mb-2">{crewErr}</p>}

                  {(() => {
                    const saved   = crewIds ? crewIds.split(",") : []
                    const changed = saved.length !== crewPick.length ||
                                    crewPick.some(id => !saved.includes(id))
                    const added   = crewPick.filter(id => !saved.includes(id)).length
                    const removed = saved.filter(id => !crewPick.includes(id)).length

                    return (
                      <>
                        {changed && (added > 0 || removed > 0) && (
                          <p className="text-[11px] text-gray-500 mb-2">
                            {added > 0 && <span className="text-emerald-600 font-semibold">+{added} added</span>}
                            {added > 0 && removed > 0 && " · "}
                            {removed > 0 && <span className="text-red-500 font-semibold">-{removed} removed</span>}
                          </p>
                        )}

                        <button onClick={handleAssignCrew}
                          disabled={savingCrew || !changed}
                          className="w-full rounded-xl bg-[#E50914] text-white text-xs font-bold py-2 hover:bg-red-700 transition disabled:opacity-40">
                          {savingCrew
                            ? "…"
                            : !changed
                            ? (saved.length ? "Crew is up to date" : "Pick an installer")
                            : crewPick.length === 0
                            ? "Remove everyone"
                            : saved.length
                            ? `Update crew (${crewPick.length})`
                            : crewPick.length > 1
                            ? `Assign ${crewPick.length} installers`
                            : "Assign"}
                        </button>
                      </>
                    )
                  })()}
                </div>
              )}

              <SectionTitle>Status & Notes</SectionTitle>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {STATUS_FLOW.map(s => (
                  <button key={s} onClick={() => onStatus(s)}
                    className={`rounded-xl border py-2 text-xs font-semibold transition ${
                      b.status === s ? STATUS_CONFIG[s].color + " shadow-sm" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}>
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>

              {b.status === "completed" && b.amountCharged != null && (
                <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Financials</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Charged</span>
                      <span className="font-semibold">${Number(b.amountCharged).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paid Workers</span>
                      <span className="font-semibold text-red-500">−${Number(b.amountPaidWorkers).toFixed(2)}</span>
                    </div>

                    {/* Materials — inline editable */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Materials & Tools</span>
                      {editMaterials ? (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400 text-xs">$</span>
                          <input
                            type="number" step="0.01" min="0"
                            value={materialsVal}
                            onChange={e => setMaterialsVal(e.target.value)}
                            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-300"
                            autoFocus
                          />
                          <button onClick={handleSaveMaterials} disabled={savingMat}
                            className="rounded-lg bg-emerald-500 text-white text-xs font-bold px-2 py-1 hover:bg-emerald-600 transition disabled:opacity-40">
                            {savingMat ? "…" : "✓"}
                          </button>
                          <button onClick={() => setEditMaterials(false)}
                            className="rounded-lg border border-gray-200 text-gray-400 text-xs px-2 py-1 hover:bg-gray-100 transition">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-red-500">
                            −${Number(b.materialsCost || 0).toFixed(2)}
                          </span>
                          <button
                            onClick={() => { setMaterialsVal(String(b.materialsCost || "")); setEditMaterials(true) }}
                            className="text-[10px] text-gray-400 hover:text-[#E50914] border border-gray-200 rounded px-1.5 py-0.5 hover:border-[#E50914]/30 transition">
                            edit
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm border-t border-emerald-200 pt-1.5 mt-0.5">
                      <span className="font-bold text-emerald-700">
                        Profit{b.profitType && b.profitValue != null
                          ? ` (${b.profitType === "fixed" ? `$${Number(b.profitValue).toFixed(0)}` : `${Number(b.profitValue).toFixed(0)}%`})`
                          : ""}
                      </span>
                      {editProfit ? (
                        <div className="flex items-center gap-1">
                          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                            {["percent", "fixed"].map(t => (
                              <button key={t} onClick={() => setProfitTypeVal(t)}
                                className={`px-1.5 py-1 text-[10px] font-bold transition ${
                                  profitTypeVal === t ? "bg-[#E50914] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                                }`}>
                                {t === "percent" ? "%" : "$"}
                              </button>
                            ))}
                          </div>
                          <input
                            type="number" step="0.01" min="0"
                            value={profitValueVal}
                            onChange={e => setProfitValueVal(e.target.value)}
                            className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-300"
                            autoFocus
                          />
                          <button onClick={handleSaveProfit} disabled={savingProfit}
                            className="rounded-lg bg-emerald-500 text-white text-xs font-bold px-2 py-1 hover:bg-emerald-600 transition disabled:opacity-40">
                            {savingProfit ? "…" : "✓"}
                          </button>
                          <button onClick={() => setEditProfit(false)}
                            className="rounded-lg border border-gray-200 text-gray-400 text-xs px-2 py-1 hover:bg-gray-100 transition">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-emerald-700">${Number(b.companyProfit).toFixed(2)}</span>
                          <button
                            onClick={() => { setProfitTypeVal(b.profitType || "percent"); setProfitValueVal(String(b.profitValue ?? "")); setEditProfit(true) }}
                            className="text-[10px] text-gray-400 hover:text-[#E50914] border border-gray-200 rounded px-1.5 py-0.5 hover:border-[#E50914]/30 transition">
                            edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <JobCloseout bookingId={b._id} active={expanded} hasCrew={crew.some(m => m.installerEmail)}
                onChange={onCloseoutChange} />

              <JobPhotos bookingId={b._id} active={expanded} />

              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Internal Notes</label>
              <textarea rows={3} value={noteValue} onChange={e => onNoteChange(e.target.value)}
                placeholder="Add notes about this booking…"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300" />
              <div className="flex gap-2 mt-2">
                <button onClick={onNoteSave} className="flex-1 rounded-xl bg-gray-900 text-white text-xs font-semibold py-2 hover:bg-black transition">
                  Save Note
                </button>
                <button onClick={onDelete} className="rounded-xl border border-red-200 text-red-500 text-xs font-semibold px-4 py-2 hover:bg-red-50 transition">
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

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function SectionTitle({ children }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{children}</p>
}
function SectionTitleRaw({ children }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{children}</p>
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
function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
    </div>
  )
}
function AmountField({ label, value, onChange, hint }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
      <div className="relative mt-1.5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
        <input type="number" step="0.01" value={value} onChange={e => onChange(e.target.value)} placeholder="0.00"
          className="w-full rounded-xl border border-gray-200 pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
      </div>
    </div>
  )
}

/* ── Job photos ─────────────────────────────────────────────────────────────── */

// Phone photos come off the camera at 4–8 MB, which would never survive being
// stored and emailed as base64. Resize and re-encode in the browser first.
function compressImage(file, maxDim = 1600, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height)
        width  = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      canvas.getContext("2d").drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Unreadable image")) }
    img.src = url
  })
}

// The customer's end-of-job sign-off: its link (to open, copy, share or email
// to the crew), and once signed, who signed, the tip, the photos and the
// signature.
function JobCloseout({ bookingId, active, hasCrew, onChange }) {
  const [info,    setInfo]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState("")
  const [flash,   setFlash]   = useState("")
  const [busy,    setBusy]    = useState("")

  function apply(data) {
    if (!data?.ok) { setErr(data?.error || "Could not load the closeout."); return }
    setInfo(data)
    const s = data.view.signed
    onChange?.({
      closeoutSignedAt: s ? s.at : null,
      closeoutTip: s ? s.tip : null,
      closeoutTipMethod: s ? s.tipMethod : null,
    })
  }

  useEffect(() => {
    if (!active || info) return
    let cancelled = false
    setLoading(true)
    fetch(`/api/bookings/closeout?bookingId=${bookingId}`)
      .then(r => r.json())
      .then(d => { if (!cancelled) apply(d) })
      .catch(() => { if (!cancelled) setErr("Could not load the closeout.") })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, bookingId])

  function say(msg) { setFlash(msg); setTimeout(() => setFlash(""), 4000) }

  async function copy() {
    try { await navigator.clipboard.writeText(info.url); say("✓ Link copied") }
    catch { window.prompt("Copy this link:", info.url) }
  }

  async function share() {
    try { await navigator.share({ title: "Job closeout", url: info.url }) } catch {}
  }

  async function post(action) {
    setBusy(action); setErr("")
    try {
      const res  = await fetch("/api/bookings/closeout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action }),
      })
      const data = await res.json()
      if (action === "sendToCrew") {
        if (data.ok) say(`✓ Sent to ${data.sentTo.join(", ")}${data.failed?.length ? ` (failed: ${data.failed.join(", ")})` : ""}`)
        else setErr(data.error || "Could not send.")
      } else {
        apply(data)
        if (data.ok) say("✓ Reopened — it can be signed again")
      }
    } catch {
      setErr("No connection.")
    } finally {
      setBusy("")
    }
  }

  async function reopen() {
    if (!confirm("Clear the customer's signature, tip and notes so the job can be signed again? Photos are kept.")) return
    post("reopen")
  }

  const v = info?.view
  const s = v?.signed
  const canShare = typeof navigator !== "undefined" && !!navigator.share

  return (
    <div className="mb-5 rounded-xl border border-gray-200 p-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">✍️ Job closeout</p>
        {loading ? <span className="text-[10px] text-gray-400">Loading…</span>
          : v && (s
            ? <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">Signed</span>
            : <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">Not signed</span>)}
      </div>

      {v && s && (
        <div className="mb-3 space-y-1 text-xs text-gray-700">
          <p><span className="text-gray-400">Signed by</span> <strong>{s.name}</strong>
            {" · "}{new Date(s.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
          <p><span className="text-gray-400">Tip</span> <strong className={s.tip > 0 ? "text-emerald-700" : ""}>
            {s.tip > 0 ? `$${Number(s.tip).toFixed(2)}${s.tipMethod ? ` · ${s.tipMethod}` : ""}` : "No tip"}</strong></p>
          {s.notes && <p className="whitespace-pre-line"><span className="text-gray-400">Notes</span> {s.notes}</p>}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${s.signatureUrl}?t=${encodeURIComponent(s.at)}`} alt={`Signature of ${s.name}`}
            className="mt-1.5 h-16 w-auto rounded-lg border border-gray-200 bg-white" />
        </div>
      )}

      {v && v.photos.length > 0 && (
        <div className="mb-3 grid grid-cols-4 gap-1.5">
          {v.photos.map((p, i) => (
            <a key={p.id} href={p.url} target="_blank" rel="noreferrer"
              className="block aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`Finished work ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
            </a>
          ))}
        </div>
      )}
      {v && !s && v.photos.length === 0 && (
        <p className="mb-3 text-[11px] text-gray-400">The installer opens this at the end of the job, adds photos, and the customer tips and signs.</p>
      )}

      {v && (
        <div className="grid grid-cols-2 gap-1.5">
          <a href={info.path} target="_blank" rel="noreferrer"
            className="rounded-lg border border-gray-200 py-2 text-center text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
            Open ↗
          </a>
          <button type="button" onClick={canShare ? share : copy}
            className="rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
            {canShare ? "Share link" : "Copy link"}
          </button>
          <button type="button" onClick={() => post("sendToCrew")} disabled={!!busy || !hasCrew}
            title={hasCrew ? "" : "Assign an installer with an email first"}
            className="col-span-2 rounded-lg bg-gray-900 py-2 text-xs font-bold text-white hover:bg-black transition disabled:opacity-40">
            {busy === "sendToCrew" ? "Sending…" : "✉️ Email link to crew"}
          </button>
          {canShare && (
            <button type="button" onClick={copy}
              className="col-span-2 text-[11px] font-semibold text-gray-400 hover:text-gray-700">
              Copy link
            </button>
          )}
          {s && (
            <a href={`/api${info.path}/pdf`}
              className="col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 py-2 text-center text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition">
              📄 Download PDF
            </a>
          )}
          {s && (
            <button type="button" onClick={reopen} disabled={!!busy}
              className="col-span-2 text-[11px] font-semibold text-gray-400 hover:text-red-500 disabled:opacity-40">
              {busy === "reopen" ? "Reopening…" : "Reopen for a new signature"}
            </button>
          )}
        </div>
      )}

      {flash && <p role="status" className="mt-2 text-[11px] font-semibold text-emerald-600">{flash}</p>}
      {err && <p role="alert" className="mt-2 text-[11px] font-medium text-red-500">{err}</p>}
    </div>
  )
}

function JobPhotos({ bookingId, active }) {
  const [photos,    setPhotos]    = useState([])
  const [loaded,    setLoaded]    = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err,       setErr]       = useState("")
  const [preview,   setPreview]   = useState(null)

  useEffect(() => {
    if (!active || loaded) return
    let cancelled = false
    setLoading(true)
    fetch(`/api/bookings/photos?bookingId=${bookingId}`)
      .then(r => r.json())
      .then(d => { if (!cancelled && d.ok) { setPhotos(d.photos); setLoaded(true) } })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [active, loaded, bookingId])

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = ""
    if (!files.length) return
    setErr("")
    setUploading(true)
    try {
      const encoded = []
      for (const f of files) {
        if (!f.type.startsWith("image/")) continue
        encoded.push({ filename: f.name, mime: "image/jpeg", dataUrl: await compressImage(f) })
      }
      if (!encoded.length) { setErr("Select image files only."); return }
      const res  = await fetch("/api/bookings/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, photos: encoded }),
      })
      const data = await res.json()
      if (data.ok) setPhotos(prev => [...prev, ...data.photos])
      else setErr(data.error || "Upload failed.")
    } catch {
      setErr("Could not process those images.")
    } finally {
      setUploading(false)
    }
  }

  async function removePhoto(id) {
    if (!confirm("Delete this photo?")) return
    setPhotos(prev => prev.filter(p => p.id !== id))
    await fetch(`/api/bookings/photos?id=${id}`, { method: "DELETE" })
  }

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Job Photos {photos.length > 0 && <span className="text-gray-400">({photos.length})</span>}
        </label>
        {loading && <span className="text-[10px] text-gray-400">Loading…</span>}
      </div>

      <p className="text-[11px] text-gray-400 mb-2 leading-snug">
        Photos are attached to the installer&apos;s job email. Upload before assigning, or
        re-send the email after adding them.
      </p>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {photos.map(p => (
            <div key={p.id} className="relative group aspect-square">
              <img
                src={p.dataUrl}
                alt={p.filename || "Job photo"}
                onClick={() => setPreview(p.dataUrl)}
                className="w-full h-full object-cover rounded-lg border border-gray-200 cursor-zoom-in"
              />
              <button
                onClick={() => removePhoto(p.id)}
                aria-label="Delete photo"
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs leading-none opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className={`flex items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 py-3 text-xs font-semibold transition cursor-pointer ${
        uploading
          ? "border-gray-200 text-gray-400 cursor-wait"
          : "border-gray-300 text-gray-600 hover:border-[#E50914] hover:text-[#E50914]"
      }`}>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={handleFiles}
          className="hidden"
        />
        {uploading ? "Uploading…" : "📷 Add Photos"}
      </label>

      {err && <p className="mt-1.5 text-[11px] font-medium text-red-500">{err}</p>}

      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 cursor-zoom-out"
        >
          <img src={preview} alt="Job photo" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}
    </div>
  )
}
