"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

const NAV = [
  { href: "/admin/bookings",   label: "Bookings",   icon: "📅" },
  { href: "/admin/installers", label: "Installers", icon: "🔧" },
  { href: "/admin/insights",   label: "Insights",   icon: "💰" },
  { href: "/admin/dashboard",  label: "Leads",      icon: "📋" },
  { href: "/admin/crm-leads",  label: "CRM",        icon: "🚀" },
]

export default function AdminLayout({ children }) {
  const router  = useRouter()
  const path    = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (path === "/admin/login") { setReady(true); return }
    const isAuth = localStorage.getItem("admin-auth") || document.cookie.includes("admin-auth")
    if (!isAuth) {
      router.push("/admin/login")
    } else {
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

  function logout() {
    localStorage.removeItem("admin-auth")
    document.cookie = "admin-auth=; path=/; max-age=0"
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
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                path.startsWith(n.href)
                  ? "bg-[#E50914] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{n.icon}</span> {n.label}
            </Link>
          ))}
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

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/10 flex z-40">
        {NAV.map(n => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition ${
              path.startsWith(n.href) ? "text-[#E50914]" : "text-white/40"
            }`}
          >
            <span className="text-xl leading-none">{n.icon}</span>
            <span className="text-[10px] font-semibold tracking-tight leading-tight">{n.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
