"use client"
// Search everything at once — bookings, customers, website leads and CRM
// leads — from any admin page. Opens with Ctrl+K / ⌘K or "/", or the 🔍
// button. Each result opens the record (a booking opens on its own card; the
// others open their page with the search filled in).
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

const digits = v => String(v || "").replace(/\D/g, "")
const fmtDay = iso => /^\d{4}-\d{2}-\d{2}$/.test(iso || "")
  ? new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  : ""

// Loaded once per open and kept for a minute, so typing never waits on the
// network after the first keystroke.
async function loadAll() {
  const get = url => fetch(url).then(r => r.json()).catch(() => null)
  const [b, c, l, crm] = await Promise.all([
    get("/api/bookings"), get("/api/customers"), get("/api/quote-leads"), get("/api/crm-leads"),
  ])
  return {
    bookings:  b?.ok ? b.bookings : [],
    customers: c?.ok ? c.customers : [],
    leads:     l?.success ? l.leads : [],
    crm:       crm?.success ? crm.leads : [],
  }
}

function matches(q, qDigits, fields, phone) {
  if (qDigits.length >= 3 && digits(phone).includes(qDigits)) return true
  return fields.some(f => String(f || "").toLowerCase().includes(q))
}

export default function AdminSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [data, setData] = useState(null)
  const [loadedAt, setLoadedAt] = useState(0)
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const show = useCallback(() => { setOpen(true); setActive(0) }, [])

  useEffect(() => {
    const onKey = e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName) || e.target?.isContentEditable
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); show() }
      else if (e.key === "/" && !typing) { e.preventDefault(); show() }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [show])

  useEffect(() => {
    if (!open) return
    setTimeout(() => inputRef.current?.focus(), 0)
    if (!data || Date.now() - loadedAt > 60_000) {
      loadAll().then(d => { setData(d); setLoadedAt(Date.now()) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!data || term.length < 2) return []
    const qd = digits(term)
    const out = []
    const take = (list, n) => list.slice(0, n)

    take(data.bookings.filter(b => matches(term, qd,
      [`${b.firstName} ${b.lastName}`, b.email, b.address?.city, b.address?.street], b.phone))
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))), 6)
      .forEach(b => out.push({
        group: "Bookings", id: `b-${b._id}`, icon: "📅",
        title: `${b.firstName || ""} ${b.lastName || ""}`.trim() || "Booking",
        sub: [fmtDay(b.date), b.timePreference, b.address?.city, b.status].filter(Boolean).join(" · "),
        href: `/admin/bookings?open=${b._id}`,
      }))

    take(data.customers.filter(c => matches(term, qd, [c.name, c.email, c.city], c.phone)), 5)
      .forEach(c => out.push({
        group: "Customers", id: `c-${c.key}`, icon: "👥",
        title: c.name || c.email || c.phone,
        sub: [c.phone, c.email, `${c.jobCount} job${c.jobCount !== 1 ? "s" : ""}`].filter(Boolean).join(" · "),
        href: `/admin/customers?q=${encodeURIComponent(c.email || c.phone || c.name)}`,
      }))

    take(data.leads.filter(l => matches(term, qd, [l.name, l.email, l.zip, l.service, l.address], l.phone)), 5)
      .forEach(l => out.push({
        group: "Website leads", id: `l-${l.id}`, icon: "📋",
        title: l.name || l.email || l.phone || "Lead",
        sub: [l.service, l.zip, l.status, l.createdAt && fmtDay(String(l.createdAt).slice(0, 10))].filter(Boolean).join(" · "),
        href: `/admin/dashboard?q=${encodeURIComponent(l.phone || l.email || l.name || "")}`,
      }))

    take(data.crm.filter(l => matches(term, qd, [l.fullName, l.email], l.phone)), 4)
      .forEach(l => out.push({
        group: "CRM", id: `r-${l.id}`, icon: "🚀",
        title: l.fullName || l.email || l.phone || "Lead",
        sub: [l.phone, l.email, l.status].filter(Boolean).join(" · "),
        href: `/admin/crm-leads?q=${encodeURIComponent(l.email || l.phone || l.fullName || "")}`,
      }))
    return out
  }, [q, data])

  useEffect(() => { setActive(0) }, [q])

  function close() { setOpen(false); setQ("") }
  function go(r) {
    close()
    // Same-page links (a booking while already on Bookings) need a full
    // navigation for the page to read the new ?open=.
    if (window.location.pathname === r.href.split("?")[0]) window.location.href = r.href
    else router.push(r.href)
  }

  function onKeyDown(e) {
    if (e.key === "Escape") { e.preventDefault(); close() }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]) }
  }

  useEffect(() => {
    document.getElementById(`search-opt-${active}`)?.scrollIntoView({ block: "nearest" })
  }, [active])

  return (
    <>
      <button type="button" onClick={show} aria-label="Search everything (Ctrl+K)"
        className="flex flex-none items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 transition">
        <span aria-hidden="true">🔍</span>
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline rounded border border-white/20 px-1.5 text-[10px] font-semibold text-white/50">Ctrl K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm px-3 pt-[10vh]"
          onMouseDown={e => { if (e.target === e.currentTarget) close() }}>
          <div role="dialog" aria-modal="true" aria-label="Search"
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4">
              <span aria-hidden="true" className="text-lg">🔍</span>
              <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKeyDown}
                type="search" placeholder="Name, phone, email, city…" autoComplete="off" spellCheck={false}
                role="combobox" aria-expanded={results.length > 0} aria-controls="search-results"
                aria-activedescendant={results[active] ? `search-opt-${active}` : undefined}
                className="min-w-0 flex-1 bg-transparent py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none" />
              <button type="button" onClick={close} className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-50">
                Esc
              </button>
            </div>

            <div id="search-results" role="listbox" aria-label="Results" className="max-h-[60vh] overflow-y-auto py-2">
              {!data ? (
                <p className="px-4 py-6 text-center text-sm text-gray-400">Loading…</p>
              ) : q.trim().length < 2 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-400">Type at least 2 letters or 3 digits of a phone number.</p>
              ) : results.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-400">Nothing matches “{q.trim()}”.</p>
              ) : results.map((r, i) => (
                <div key={r.id}>
                  {(i === 0 || results[i - 1].group !== r.group) && (
                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{r.group}</p>
                  )}
                  <div id={`search-opt-${i}`} role="option" aria-selected={i === active}
                    onMouseEnter={() => setActive(i)} onClick={() => go(r)}
                    className={`mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ${i === active ? "bg-red-50" : ""}`}>
                    <span aria-hidden="true" className="text-base">{r.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-gray-900">{r.title}</span>
                      {r.sub && <span className="block truncate text-xs text-gray-500">{r.sub}</span>}
                    </span>
                    {i === active && <span aria-hidden="true" className="text-xs text-gray-400">↵</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
