"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import AdminSearch from "./AdminSearch"
import { useMe, forgetMe } from "./useMe"
import { isOwnerOnlyPage } from "@/lib/adminSession"

// Today, Bookings and the report stand alone; the rest sit in small groups so
// the mobile bar stays at six readable entries instead of nine squeezed ones.
const FULL_MENU = [
  { href: "/admin/today",    label: "Today",    icon: "☀️" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { key: "people", label: "People", icon: "👥", items: [
    { href: "/admin/customers",  label: "Customers",  icon: "👥", desc: "Everyone who has booked" },
    { href: "/admin/installers", label: "Installers", icon: "🔧", desc: "Your crew and their jobs" },
    { href: "/admin/team",       label: "Team",       icon: "🔑", desc: "Who can sign in, and who gets alerts" },
  ] },
  { key: "money", label: "Money", icon: "💵", items: [
    { href: "/admin/earnings", label: "Earnings", icon: "💵", desc: "What each job paid and who got what" },
    { href: "/admin/insights", label: "Insights", icon: "💰", desc: "Trends, services and sources" },
  ] },
  { href: "/admin/reporte", label: "Reporte", icon: "📊" },
  // Talking to customers. Website quote requests still arrive by email; their
  // old page (/admin/dashboard) is kept but no longer in the menu.
  { key: "inbox", label: "Inbox", icon: "💬", items: [
    { href: "/admin/messages",  label: "Messages", icon: "💬", desc: "Texts and calls with customers" },
    { href: "/admin/reminders", label: "Reminders", icon: "🔔", desc: "Send appointment reminders" },
    { href: "/admin/crm-leads", label: "CRM",      icon: "🚀", desc: "Messenger and Instagram leads" },
  ] },
]

export default function AdminLayout({ children }) {
  const router  = useRouter()
  const path    = usePathname()
  const [ready, setReady] = useState(false)
  const [openGroup, setOpenGroup] = useState(null) // a group's key, or null
  const groupTrigger = useRef(null)
  const mobileLinks = useRef(null)

  // A seller's menu leaves out the owner-only pages (money, reports, pay,
  // team); a group left empty disappears. Until we know who it is, the menu
  // shows only what everyone can open.
  const me = useMe()
  const MENU = FULL_MENU
    .map(m => (m.items ? { ...m, items: m.items.filter(n => me?.role === "admin" || !isOwnerOnlyPage(n.href)) } : m))
    .filter(m => (m.items ? m.items.length > 0 : me?.role === "admin" || !isOwnerOnlyPage(m.href)))

  const isOn    = href => path.startsWith(href)
  const toggle = (event, key) => {
    groupTrigger.current = event.currentTarget
    setOpenGroup(current => current === key ? null : key)
  }
  function closeGroup() {
    setOpenGroup(null)
    groupTrigger.current?.focus()
  }
  const sheet   = MENU.find(m => m.key && m.key === openGroup)

  // Close the submenu on an outside click, on Escape, and whenever the route
  // changes — otherwise it stays open over the page you just navigated to.
  // Anything marked data-navgroup (the menus and their buttons, desktop and
  // mobile) counts as inside, so tapping a link in the sheet still navigates.
  useEffect(() => { setOpenGroup(null) }, [path])
  useEffect(() => {
    if (!openGroup) return
    if (mobileLinks.current?.getClientRects().length) mobileLinks.current.querySelector("a")?.focus()
    const onClick = e => { if (!e.target.closest?.("[data-navgroup]")) setOpenGroup(null) }
    const onKey = e => { if (e.key === "Escape") closeGroup() }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [openGroup])

  useEffect(() => {
    if (path === "/admin/login") { setReady(true); return }
    // Only a UI hint to avoid rendering the shell before redirecting — the
    // session cookie is httpOnly and unreadable here. Middleware is the gate.
    if (!localStorage.getItem("admin-auth")) {
      router.push("/admin/login")
    } else {
      // Reaching here means the current build loaded fine, so release the
      // one-shot guard that error.jsx uses to avoid a reload loop.
      try { sessionStorage.removeItem("admin-stale-reload") } catch {}
      setReady(true)
    }
  }, [router, path])

  useEffect(() => {
    // Inject manifest only while in admin — keeps PWA install prompt away from public site
    const link = document.createElement("link")
    link.rel = "manifest"
    link.href = "/admin-manifest.json"
    document.head.appendChild(link)

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/admin/sw.js").catch(() => {})
    }

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  async function logout() {
    localStorage.removeItem("admin-auth")
    forgetMe()
    // The cookie is httpOnly, so only the server can clear it.
    await fetch("/api/logout", { method: "POST" }).catch(() => {})
    router.push("/admin/login")
  }

  if (!ready) return null
  if (path === "/admin/login") return <>{children}</>

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col">
      <a href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-gray-900">
        Skip to main content
      </a>
      {/* Top bar */}
      <header className="bg-[#111] text-white flex items-center gap-3 px-4 md:px-6 py-3 shadow-lg sticky top-0 z-30">
        <span className="font-extrabold text-lg tracking-tight flex-none">
          <span className="text-brand-bright">Prime</span>TV
          <span className="ml-2 hidden text-xs font-normal uppercase tracking-widest text-white/75 sm:inline">Admin</span>
        </span>

        {/* Desktop nav */}
        <nav aria-label="Admin navigation" className="ml-4 hidden flex-1 gap-1 lg:flex">
          {MENU.map(m => {
            const pill = on => `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
              on ? "bg-[#E50914] text-white" : "text-white/60 hover:text-white hover:bg-white/10"
            }`
            if (!m.items) {
              return (
                <Link key={m.href} href={m.href} aria-current={isOn(m.href) ? "page" : undefined} className={pill(isOn(m.href))}>
                  <span>{m.icon}</span> {m.label}
                </Link>
              )
            }
            const open = openGroup === m.key
            // On one of its pages the button names that page, so you can see where you are.
            const current = m.items.find(n => isOn(n.href))
            return (
              <div key={m.key} className="relative" data-navgroup>
                <button
                  type="button"
                  onClick={event => toggle(event, m.key)}
                  aria-expanded={open}
                  className={pill(!!current)}
                >
                  <span>{current ? current.icon : m.icon}</span> {current ? current.label : m.label}
                  <span className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
                </button>

                {open && (
                  <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden z-50">
                    <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-widest text-gray-600">{m.label}</p>
                    {m.items.map(n => (
                      <Link
                        key={n.href}
                        href={n.href}
                        aria-current={isOn(n.href) ? "page" : undefined}
                        className={`block px-4 py-3 transition ${isOn(n.href) ? "bg-red-50" : "hover:bg-gray-50"}`}
                      >
                        <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <span>{n.icon}</span> {n.label}
                        </span>
                        <span className="block text-[11px] text-gray-500 mt-0.5">{n.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="flex-1 md:flex-none" />

        <AdminSearch />

        {me?.role === "seller" && me.name && (
          <span className="hidden text-xs text-white/60 sm:inline flex-none">{me.name}</span>
        )}

        <button
          onClick={logout}
          className="min-h-11 flex-none rounded-full px-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          Logout
        </button>
      </header>

      {/* Main content — extra bottom padding on mobile for bottom nav */}
      <main id="admin-main" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 p-4 pb-24 md:px-6 md:pt-6 lg:pb-6">
        {children}
      </main>

      {/* Mobile: the open group's sheet, above the bottom bar */}
      {sheet && (
        <>
          <button
            type="button"
            aria-label={`Close ${sheet.label} menu`}
            onClick={closeGroup}
            tabIndex={-1}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
          <div ref={mobileLinks} data-navgroup className="fixed bottom-16 left-3 right-3 z-50 overflow-hidden rounded-2xl bg-white shadow-2xl lg:hidden">
            <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-widest text-gray-600">{sheet.label}</p>
            {sheet.items.map(n => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isOn(n.href) ? "page" : undefined}
                className={`block px-4 py-3.5 border-b border-gray-100 last:border-0 ${isOn(n.href) ? "bg-red-50" : ""}`}
              >
                <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <span>{n.icon}</span> {n.label}
                </span>
                <span className="block text-[11px] text-gray-500 mt-0.5">{n.desc}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Mobile bottom navigation */}
      <nav aria-label="Admin navigation" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-[#111] lg:hidden">
        {MENU.map(m => {
          const cls = on => `flex-1 min-w-0 flex flex-col items-center justify-center py-2 gap-0.5 transition ${
            on ? "text-brand-bright" : "text-white/75"
          }`
          const inner = (icon, label) => (
            <>
              <span aria-hidden="true" className="text-xl leading-none">{icon}</span>
              <span className="max-w-full truncate px-0.5 text-xs font-semibold leading-tight tracking-tight">{label}</span>
            </>
          )
          if (!m.items) {
            return <Link key={m.href} href={m.href} aria-current={isOn(m.href) ? "page" : undefined} className={cls(isOn(m.href))}>{inner(m.icon, m.label)}</Link>
          }
          const current = m.items.find(n => isOn(n.href))
          return (
            <button
              key={m.key}
              type="button"
              data-navgroup
              onClick={event => toggle(event, m.key)}
              aria-expanded={openGroup === m.key}
              className={cls(!!current || openGroup === m.key)}
            >
              {inner(current ? current.icon : m.icon, current ? current.label : m.label)}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
