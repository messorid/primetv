"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

// Bookings and the report stand alone; the rest sit in small groups so the
// mobile bar stays at five readable entries instead of eight squeezed ones.
const MENU = [
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { key: "people", label: "People", icon: "👥", items: [
    { href: "/admin/customers",  label: "Customers",  icon: "👥", desc: "Everyone who has booked" },
    { href: "/admin/installers", label: "Installers", icon: "🔧", desc: "Your crew and their jobs" },
  ] },
  { key: "money", label: "Money", icon: "💵", items: [
    { href: "/admin/earnings", label: "Earnings", icon: "💵", desc: "What each job paid and who got what" },
    { href: "/admin/insights", label: "Insights", icon: "💰", desc: "Trends, services and sources" },
  ] },
  { href: "/admin/reporte", label: "Reporte", icon: "📊" },
  // People who have not booked yet.
  { key: "leads", label: "Leads", icon: "📋", items: [
    { href: "/admin/dashboard", label: "Website Leads", icon: "📋", desc: "Quote requests from the site" },
    { href: "/admin/crm-leads", label: "CRM",           icon: "🚀", desc: "Pipeline and follow-ups" },
  ] },
]

export default function AdminLayout({ children }) {
  const router  = useRouter()
  const path    = usePathname()
  const [ready, setReady] = useState(false)
  const [openGroup, setOpenGroup] = useState(null) // a group's key, or null

  const isOn    = href => path.startsWith(href)
  const toggle  = key => setOpenGroup(k => (k === key ? null : key))
  const sheet   = MENU.find(m => m.key && m.key === openGroup)

  // Close the submenu on an outside click, on Escape, and whenever the route
  // changes — otherwise it stays open over the page you just navigated to.
  // Anything marked data-navgroup (the menus and their buttons, desktop and
  // mobile) counts as inside, so tapping a link in the sheet still navigates.
  useEffect(() => { setOpenGroup(null) }, [path])
  useEffect(() => {
    if (!openGroup) return
    const onClick = e => { if (!e.target.closest?.("[data-navgroup]")) setOpenGroup(null) }
    const onKey = e => { if (e.key === "Escape") setOpenGroup(null) }
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
    // The cookie is httpOnly, so only the server can clear it.
    await fetch("/api/logout", { method: "POST" }).catch(() => {})
    router.push("/admin/login")
  }

  if (!ready) return null
  if (path === "/admin/login") return <>{children}</>

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col">
      {/* Top bar */}
      <header className="bg-[#111] text-white flex items-center gap-3 px-4 md:px-6 py-3 shadow-lg sticky top-0 z-30">
        <span className="font-extrabold text-lg tracking-tight flex-none">
          <span className="text-[#E50914]">Prime</span>TV
          <span className="ml-2 text-xs font-normal text-white/40 uppercase tracking-widest hidden sm:inline">Admin</span>
        </span>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-1 gap-1 ml-4">
          {MENU.map(m => {
            const pill = on => `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
              on ? "bg-[#E50914] text-white" : "text-white/60 hover:text-white hover:bg-white/10"
            }`
            if (!m.items) {
              return (
                <Link key={m.href} href={m.href} className={pill(isOn(m.href))}>
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
                  onClick={() => toggle(m.key)}
                  aria-expanded={open}
                  aria-haspopup="true"
                  className={pill(!!current)}
                >
                  <span>{current ? current.icon : m.icon}</span> {current ? current.label : m.label}
                  <span className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
                </button>

                {open && (
                  <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden z-50">
                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{m.label}</p>
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

        <button
          onClick={logout}
          className="text-xs text-white/40 hover:text-white transition px-3 py-1.5 rounded-full hover:bg-white/10 flex-none"
        >
          Logout
        </button>
      </header>

      {/* Main content — extra bottom padding on mobile for bottom nav */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile: the open group's sheet, above the bottom bar */}
      {sheet && (
        <>
          <button
            type="button"
            aria-label={`Close ${sheet.label} menu`}
            onClick={() => setOpenGroup(null)}
            className="md:hidden fixed inset-0 bg-black/40 z-40"
          />
          <div data-navgroup className="md:hidden fixed bottom-16 left-3 right-3 rounded-2xl bg-white shadow-2xl overflow-hidden z-50">
            <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{sheet.label}</p>
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/10 flex z-40">
        {MENU.map(m => {
          const cls = on => `flex-1 min-w-0 flex flex-col items-center justify-center py-2 gap-0.5 transition ${
            on ? "text-[#E50914]" : "text-white/40"
          }`
          const inner = (icon, label) => (
            <>
              <span className="text-xl leading-none">{icon}</span>
              <span className="text-[10px] font-semibold tracking-tight leading-tight truncate max-w-full px-0.5">{label}</span>
            </>
          )
          if (!m.items) {
            return <Link key={m.href} href={m.href} className={cls(isOn(m.href))}>{inner(m.icon, m.label)}</Link>
          }
          const current = m.items.find(n => isOn(n.href))
          return (
            <button
              key={m.key}
              type="button"
              data-navgroup
              onClick={() => toggle(m.key)}
              aria-expanded={openGroup === m.key}
              aria-haspopup="true"
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
