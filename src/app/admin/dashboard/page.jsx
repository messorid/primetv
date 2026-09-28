"use client"

// Leads = every quote request the website takes: the Quick Quote form, the
// Home Installation form and the contact form. They are stored in Postgres
// alongside the bookings, so a missed email no longer means a lost lead.

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx"

const SOURCES = [
  { value: "all",                label: "All" },
  { value: "quick_quote",        label: "Quick Quote" },
  { value: "installation_quote", label: "Home Installation" },
  { value: "contact_form",       label: "Contact Form" },
]

const STATUSES = [
  { value: "new",       label: "New",       cls: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "contacted", label: "Contacted", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "quoted",    label: "Quoted",    cls: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "won",       label: "Won",       cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "lost",      label: "Lost",      cls: "bg-gray-100 text-gray-500 border-gray-200" },
]

const statusOf = v => STATUSES.find(s => s.value === v) || STATUSES[0]

const SOURCE_STYLE = {
  quick_quote:        { emoji: "📺", cls: "bg-red-50 text-[#E50914] border-red-200" },
  installation_quote: { emoji: "🔧", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  contact_form:       { emoji: "✉️", cls: "bg-gray-50 text-gray-600 border-gray-200" },
}

function when(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  const mins = Math.round((Date.now() - d.getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  if (mins < 60 * 24) return `${Math.round(mins / 60)}h ago`
  if (mins < 60 * 24 * 7) return `${Math.round(mins / (60 * 24))}d ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const fullDate = iso =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : ""

const digits = v => String(v || "").replace(/\D/g, "")

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads]   = useState([])
  const [loading, setLoad]  = useState(true)
  const [err, setErr]       = useState("")
  const [search, setSearch] = useState("")
  const [source, setSource] = useState("all")
  const [status, setStatus] = useState("all")
  const [open, setOpen]     = useState(null)
  const [saving, setSaving] = useState(null)

  async function load() {
    setLoad(true)
    try {
      const res = await fetch("/api/quote-leads")
      const data = await res.json()
      if (data.success) { setLeads(data.leads); setErr("") }
      else setErr(data.error || "Could not load leads")
    } catch {
      setErr("Could not reach the server")
    } finally {
      setLoad(false)
    }
  }

  useEffect(() => { load() }, [])

  async function setLeadStatus(id, next) {
    setSaving(id)
    try {
      const res = await fetch("/api/quote-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      })
      const data = await res.json()
      if (data.success) setLeads(ls => ls.map(l => (l.id === id ? data.lead : l)))
    } finally {
      setSaving(null)
    }
  }

  async function remove(id) {
    if (!confirm("Delete this lead?")) return
    const res = await fetch(`/api/quote-leads?id=${id}`, { method: "DELETE" })
    if ((await res.json()).success) setLeads(ls => ls.filter(l => l.id !== id))
  }

  // Sends the lead straight into the booking form, pre-filled, so a lead that
  // converts never has to be retyped.
  function book(l) {
    const parts = String(l.name || "").trim().split(/\s+/)
    const params = new URLSearchParams({
      firstName: parts[0] || "",
      lastName:  parts.slice(1).join(" "),
      email:     l.email || "",
      phone:     l.phone || "",
      street:    l.address || "",
      zip:       l.zip || "",
    })
    router.push(`/admin/bookings?new=1&${params.toString()}`)
  }

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter(l => {
      if (source !== "all" && l.source !== source) return false
      if (status !== "all" && l.status !== status) return false
      if (!q) return true
      return [l.name, l.email, l.phone, l.service, l.zip, l.address, l.notes]
        .some(v => String(v || "").toLowerCase().includes(q))
    })
  }, [leads, search, source, status])

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return {
      total: leads.length,
      fresh: leads.filter(l => l.status === "new").length,
      week:  leads.filter(l => new Date(l.createdAt).getTime() >= weekAgo).length,
      won:   leads.filter(l => l.status === "won").length,
    }
  }, [leads])

  function exportToExcel() {
    const sheet = XLSX.utils.json_to_sheet(shown.map(l => ({
      Date: fullDate(l.createdAt),
      Source: l.sourceLabel,
      Status: statusOf(l.status).label,
      Name: l.name, Phone: l.phone, Email: l.email,
      Service: l.service, "TV size": l.tvSize, Mount: l.mountType,
      ZIP: l.zip, Address: l.address,
      "Preferred date": l.preferredDate, "Preferred time": l.preferredTime,
      Notes: l.notes,
    })))
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, "Leads")
    XLSX.writeFile(book, "leads-primetv.xlsx")
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Leads</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Quote requests from the website. Not bookings yet — someone still has to call them.
          </p>
        </div>
        <button onClick={exportToExcel} disabled={!shown.length}
          className="self-start sm:self-auto bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition disabled:opacity-40">
          Export to Excel
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { k: "New to call", v: stats.fresh, tone: "text-blue-600" },
          { k: "Last 7 days", v: stats.week,  tone: "text-gray-900" },
          { k: "Won",         v: stats.won,   tone: "text-emerald-600" },
          { k: "All time",    v: stats.total, tone: "text-gray-900" },
        ].map(s => (
          <div key={s.k} className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{s.k}</p>
            <p className={`text-2xl font-extrabold mt-0.5 ${s.tone}`}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {SOURCES.map(s => (
          <button key={s.value} onClick={() => setSource(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              source === s.value ? "bg-[#E50914] text-white border-[#E50914]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}>
            {s.label}
            {s.value !== "all" && (
              <span className="ml-1.5 opacity-60">{leads.filter(l => l.source === s.value).length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search name, phone, email, ZIP…"
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200">
          <option value="all">Any status</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 mb-4 text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{err}</span>
          <button onClick={load} className="font-bold underline shrink-0">Retry</button>
        </div>
      )}

      {loading ? (
        <p className="text-center py-20 text-gray-400">Loading leads…</p>
      ) : !shown.length ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-400">
            {leads.length
              ? "No leads match these filters."
              : "No leads yet. New quote requests from the website will land here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          {shown.map(l => {
            const st  = statusOf(l.status)
            const src = SOURCE_STYLE[l.source] || SOURCE_STYLE.contact_form
            const isOpen = open === l.id

            return (
              <div key={l.id} className={l.status === "new" ? "bg-blue-50/30" : ""}>
                <button onClick={() => setOpen(isOpen ? null : l.id)}
                  className="w-full text-left px-4 py-3.5 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-none mt-0.5">{src.emoji}</span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900 truncate">{l.name || "No name"}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.cls}`}>{st.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {[l.service, l.zip || l.address].filter(Boolean).join(" · ") || l.sourceLabel}
                      </p>
                    </div>

                    <div className="text-right flex-none">
                      <p className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${src.cls}`}>{l.sourceLabel}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{when(l.createdAt)}</p>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 bg-gray-50/70 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {l.phone && (
                        <>
                          <a href={`tel:+1${digits(l.phone)}`}
                            className="px-3 py-1.5 rounded-xl bg-[#E50914] text-white text-xs font-bold hover:bg-red-700 transition">
                            Call {l.phone}
                          </a>
                          <a href={`sms:+1${digits(l.phone)}`}
                            className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-700 transition">
                            Text
                          </a>
                        </>
                      )}
                      {l.email && (
                        <a href={`mailto:${l.email}`}
                          className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-gray-300 transition">
                          {l.email}
                        </a>
                      )}
                      <button onClick={() => book(l)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition">
                        Turn into booking
                      </button>
                    </div>

                    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs mb-3">
                      {[
                        ["Received",       fullDate(l.createdAt)],
                        ["Source",         l.sourceLabel],
                        ["Service",        l.service],
                        ["TV size",        l.tvSize],
                        ["Mount",          l.mountType],
                        ["ZIP",            l.zip],
                        ["Address",        l.address],
                        ["Preferred date", l.preferredDate],
                        ["Preferred time", l.preferredTime],
                      ].filter(([, v]) => v).map(([k, v]) => (
                        <div key={k} className="min-w-0">
                          <dt className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{k}</dt>
                          <dd className="text-gray-800 font-medium break-words">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    {l.notes && (
                      <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-1">What they wrote</p>
                        <p className="text-xs text-gray-700 whitespace-pre-wrap bg-white rounded-xl border border-gray-200 px-3 py-2">{l.notes}</p>
                      </div>
                    )}

                    {/* The Home Installation form asks a different set of questions
                        per service, so its answers are kept as they came in. */}
                    {l.details?.answers && Object.entries(l.details.answers).filter(([, v]) => v).length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-1">Project details</p>
                        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                          {Object.entries(l.details.answers).filter(([, v]) => v).map(([k, v]) => (
                            <div key={k} className="min-w-0">
                              <dt className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{k.replace(/_/g, " ")}</dt>
                              <dd className="text-gray-800 font-medium break-words">{String(v)}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}

                    <div className="flex items-end justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-1">Status</p>
                        <div className="flex flex-wrap gap-1.5">
                          {STATUSES.map(s => (
                            <button key={s.value} disabled={saving === l.id}
                              onClick={() => setLeadStatus(l.id, s.value)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition disabled:opacity-40 ${
                                l.status === s.value ? s.cls : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                              }`}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button onClick={() => remove(l.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold transition">
                        Delete
                      </button>
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
