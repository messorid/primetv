"use client"
// TODAY — the first screen of the admin: today's and tomorrow's jobs, and a
// to-do list built from the bookings themselves (jobs with no crew, jobs not
// confirmed, sign-offs to close, reviews to ask for, new website leads), each
// with the one action it needs.
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

const pad = n => String(n).padStart(2, "0")
const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return isoDate(d) }
const fmtDay = (iso, opts = { weekday: "short", month: "short", day: "numeric" }) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", opts)

const STATUS = {
  pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmed", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  completed: { label: "Completed", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", cls: "bg-gray-100 text-gray-500 border-gray-200" },
}

// "9:00 AM", "Morning (8am – 12pm)", "Flexible" → minutes, for ordering a day.
function timeKey(t) {
  const s = String(t || "")
  const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(s)
  if (m) return ((Number(m[1]) % 12) + (/pm/i.test(m[3]) ? 12 : 0)) * 60 + Number(m[2] || 0)
  if (/morning/i.test(s)) return 8 * 60
  if (/afternoon/i.test(s)) return 12 * 60
  if (/evening/i.test(s)) return 17 * 60
  return 24 * 60
}

const fullAddress = a => [a?.street, a?.apt, a?.city, a?.state, a?.zip].filter(Boolean).join(", ")
const telHref = p => { const d = String(p || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""); return d.length === 10 ? `tel:+1${d}` : "" }
const open = (id, extra = "") => `/admin/bookings?open=${id}${extra}`
const active = b => b.status === "pending" || b.status === "confirmed"

export default function TodayPage() {
  const [bookings, setBookings] = useState([])
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(null)
  const [sent, setSent] = useState({})

  async function load() {
    setLoading(true)
    try {
      const [b, l] = await Promise.all([
        fetch("/api/bookings").then(r => r.json()),
        fetch("/api/quote-leads").then(r => r.json()).catch(() => null),
      ])
      if (b.ok) { setBookings(b.bookings); setError("") } else setError(b.error || "Could not load bookings.")
      if (l?.success) setLeads(l.leads)
    } catch {
      setError("Could not reach the server.")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const today = isoDate(new Date())
  const tomorrow = addDays(today, 1)

  const view = useMemo(() => {
    const live = bookings.filter(b => b.status !== "cancelled")
    const byTime = (a, b) => timeKey(a.timePreference) - timeKey(b.timePreference)
    const weekEnd = addDays(today, 6)
    const monthAgo = addDays(today, -30)
    const weekAgo = addDays(today, -7)

    const todo = [
      {
        key: "signed", title: "Signed off — mark as completed", tone: "emerald",
        hint: "The customer signed. Record the amounts to close the job.",
        items: live.filter(b => b.closeoutSignedAt && b.status !== "completed"),
        action: b => ({ href: open(b._id, "&complete=1"), label: "Complete" }),
      },
      {
        key: "stale", title: "Past jobs still open", tone: "red",
        hint: "The date has passed but the job is still pending or confirmed.",
        items: live.filter(b => b.date && b.date < today && active(b)).sort((a, b) => b.date.localeCompare(a.date)),
        action: b => ({ href: open(b._id), label: "Update" }),
      },
      {
        key: "nocrew", title: "No crew assigned", tone: "amber",
        hint: "Upcoming jobs nobody is going to yet.",
        items: live.filter(b => b.date && b.date >= today && active(b) && !(b.crew || []).length)
          .sort((a, b) => a.date.localeCompare(b.date) || byTime(a, b)),
        action: b => ({ href: open(b._id, "&tab=crew"), label: "Assign" }),
      },
      {
        key: "unconfirmed", title: "Not confirmed yet", tone: "amber",
        hint: "Pending jobs in the next 7 days.",
        items: live.filter(b => b.date && b.date >= today && b.date <= weekEnd && b.status === "pending")
          .sort((a, b) => a.date.localeCompare(b.date) || byTime(a, b)),
        action: b => ({ href: open(b._id), label: "Confirm" }),
      },
      {
        key: "unsigned", title: "Waiting for the customer's sign-off", tone: "blue",
        hint: "Jobs from the last 7 days with no signed closeout.",
        items: live.filter(b => b.date && b.date <= today && b.date >= weekAgo && !b.closeoutSignedAt && b.status !== "pending")
          .sort((a, b) => b.date.localeCompare(a.date)),
        action: b => ({ href: open(b._id, "&tab=photos"), label: "Closeout" }),
      },
      {
        key: "review", title: "Ask for a Google review", tone: "yellow",
        hint: "Completed in the last 30 days, with an email, not asked yet.",
        items: live.filter(b => b.status === "completed" && b.email && !b.reviewRequestedAt && !sent[b._id]
          && b.date && b.date < today && b.date >= monthAgo).sort((a, b) => b.date.localeCompare(a.date)),
        action: b => ({ review: true, label: "Send" }),
      },
    ]

    return {
      todays: live.filter(b => b.date === today).sort(byTime),
      tomorrows: live.filter(b => b.date === tomorrow).sort(byTime),
      week: live.filter(b => b.date && b.date >= today && b.date <= weekEnd).length,
      todo,
      // Only recent ones: a lead nobody answered in a month is not today's work.
      newLeads: leads.filter(l => l.status === "new" && l.createdAt && isoDate(new Date(l.createdAt)) >= monthAgo),
    }
  }, [bookings, leads, today, tomorrow, sent])

  const todoCount = view.todo.reduce((n, g) => n + g.items.length, 0) + view.newLeads.length

  async function askReview(b) {
    if (!confirm(`Email ${b.firstName} (${b.email}) the Google review request?`)) return
    setSending(b._id)
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b._id, sendReviewRequest: true }),
      })
      const data = await res.json()
      if (data.ok) setSent(s => ({ ...s, [b._id]: true }))
      else alert(data.error || "Could not send.")
    } catch {
      alert("Could not reach the server.")
    } finally {
      setSending(null)
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Today</h1>
          <p className="text-sm text-gray-500 mt-0.5">{fmtDay(today, { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <button onClick={load}
          className="text-sm font-medium text-gray-600 hover:text-black bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm transition">
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-400">Loading…</p>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Tile label="Jobs today" value={view.todays.length} tone="bg-white" />
            <Tile label="Tomorrow" value={view.tomorrows.length} tone="bg-white" />
            <Tile label="Next 7 days" value={view.week} tone="bg-white" />
            <Tile label="To do" value={todoCount} tone={todoCount ? "bg-amber-50" : "bg-emerald-50"} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Jobs */}
            <div className="min-w-0 lg:col-span-3 space-y-6">
              <section aria-labelledby="today-jobs">
                <h2 id="today-jobs" className="mb-3 text-sm font-extrabold uppercase tracking-widest text-[#E50914]">
                  Today&apos;s jobs <span className="text-gray-400">({view.todays.length})</span>
                </h2>
                {view.todays.length === 0 ? (
                  <Empty>No jobs today.</Empty>
                ) : (
                  <div className="space-y-3">{view.todays.map(b => <JobCard key={b._id} b={b} />)}</div>
                )}
              </section>

              <section aria-labelledby="tomorrow-jobs">
                <h2 id="tomorrow-jobs" className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-500">
                  Tomorrow · {fmtDay(tomorrow)} <span className="text-gray-400">({view.tomorrows.length})</span>
                </h2>
                {view.tomorrows.length === 0 ? (
                  <Empty>Nothing booked for tomorrow.</Empty>
                ) : (
                  <div className="space-y-3">{view.tomorrows.map(b => <JobCard key={b._id} b={b} compact />)}</div>
                )}
              </section>
            </div>

            {/* To do */}
            <section aria-labelledby="todo" className="min-w-0 lg:col-span-2">
              <h2 id="todo" className="mb-3 text-sm font-extrabold uppercase tracking-widest text-gray-500">
                To do <span className="text-gray-400">({todoCount})</span>
              </h2>
              {todoCount === 0 ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
                  <p className="text-lg font-extrabold text-emerald-700">✓ All caught up</p>
                  <p className="mt-1 text-sm text-emerald-800/70">Nothing needs your attention right now.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {view.newLeads.length > 0 && (
                    <TodoGroup title="New website leads" tone="purple" count={view.newLeads.length}
                      hint="Quote requests from the last 30 days still marked new.">
                      {view.newLeads.slice(0, 6).map(l => (
                        <Row key={l.id} title={l.name || l.email || l.phone || "Lead"}
                          sub={[l.service, l.zip, l.createdAt && new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })].filter(Boolean).join(" · ")}
                          action={<Link href={`/admin/dashboard?q=${encodeURIComponent(l.phone || l.email || l.name || "")}`} className={btn}>Open</Link>} />
                      ))}
                      {view.newLeads.length > 6 && <MoreLink href="/admin/dashboard" n={view.newLeads.length - 6} />}
                    </TodoGroup>
                  )}
                  {view.todo.filter(g => g.items.length).map(g => (
                    <TodoGroup key={g.key} title={g.title} tone={g.tone} count={g.items.length} hint={g.hint}>
                      {g.items.slice(0, 6).map(b => {
                        const a = g.action(b)
                        return (
                          <Row key={b._id} title={`${b.firstName || ""} ${b.lastName || ""}`.trim() || "Customer"}
                            href={open(b._id)}
                            sub={[b.date && fmtDay(b.date), b.timePreference, b.address?.city].filter(Boolean).join(" · ")}
                            action={a.review ? (
                              <button type="button" onClick={() => askReview(b)} disabled={sending === b._id} className={btn}>
                                {sending === b._id ? "…" : "⭐ Send"}
                              </button>
                            ) : (
                              <Link href={a.href} className={btn}>{a.label}</Link>
                            )} />
                        )
                      })}
                      {g.items.length > 6 && <MoreLink href="/admin/bookings" n={g.items.length - 6} />}
                    </TodoGroup>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  )
}

const btn = "inline-flex flex-none items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-800 hover:border-[#E50914]/50 hover:text-[#E50914] transition disabled:opacity-40"

function Tile({ label, value, tone }) {
  return (
    <div className={`${tone} rounded-2xl border border-gray-200 p-4 shadow-sm`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
  )
}

function Empty({ children }) {
  return <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-400">{children}</p>
}

function JobCard({ b, compact = false }) {
  const st = STATUS[b.status] || STATUS.pending
  const crew = (b.crew || []).map(m => m.installerName).filter(Boolean)
  const addr = fullAddress(b.address)
  const tel = telHref(b.phone)
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-16 flex-none">
          <p className="text-sm font-extrabold text-gray-900 leading-tight">{b.timePreference || "Flexible"}</p>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={open(b._id)} className="font-bold text-gray-900 hover:text-[#E50914] truncate">
              {`${b.firstName || ""} ${b.lastName || ""}`.trim() || "Customer"}
            </Link>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${st.cls}`}>{st.label}</span>
            {b.closeoutSignedAt
              ? <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">✍️ Signed</span>
              : !compact && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-gray-50 text-gray-500 border-gray-200">Not signed</span>}
          </div>
          {addr && <p className="mt-1 text-sm text-gray-600">{addr}</p>}
          <p className={`mt-1 text-xs ${crew.length ? "text-gray-500" : "font-bold text-amber-700"}`}>
            {crew.length ? `👷 ${crew.join(", ")}` : "⚠️ No crew assigned"}
          </p>
        </div>
      </div>
      {!compact && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {addr && <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`} target="_blank" rel="noreferrer" className={btnFull}>📍 Directions</a>}
          {tel && <a href={tel} className={btnFull}>📞 Call</a>}
          <Link href={open(b._id, "&tab=photos")} className={btnFull}>✍️ Closeout</Link>
          <Link href={open(b._id)} className={btnFull}>Open</Link>
        </div>
      )}
    </article>
  )
}
const btnFull = "flex items-center justify-center rounded-xl border border-gray-200 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"

const TONES = {
  emerald: "border-l-emerald-500", red: "border-l-red-500", amber: "border-l-amber-500",
  blue: "border-l-blue-500", yellow: "border-l-yellow-400", purple: "border-l-purple-500",
}

function TodoGroup({ title, hint, tone, count, children }) {
  return (
    <details open className={`group rounded-2xl border border-gray-200 border-l-4 ${TONES[tone]} bg-white shadow-sm`}>
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="flex-1 text-sm font-bold text-gray-900">{title}</span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">{count}</span>
        <span aria-hidden="true" className="text-xs text-gray-400 transition group-open:rotate-180">▾</span>
      </summary>
      <p className="-mt-1 px-4 pb-2 text-[11px] text-gray-400">{hint}</p>
      <ul className="divide-y divide-gray-100 border-t border-gray-100">{children}</ul>
    </details>
  )
}

function Row({ title, sub, href, action }) {
  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <div className="min-w-0 flex-1">
        {href
          ? <Link href={href} className="block truncate text-sm font-semibold text-gray-800 hover:text-[#E50914]">{title}</Link>
          : <p className="truncate text-sm font-semibold text-gray-800">{title}</p>}
        {sub && <p className="truncate text-xs text-gray-400">{sub}</p>}
      </div>
      {action}
    </li>
  )
}

function MoreLink({ href, n }) {
  return (
    <li className="px-4 py-2 text-right">
      <Link href={href} className="text-xs font-semibold text-gray-500 hover:text-[#E50914]">+{n} more →</Link>
    </li>
  )
}
