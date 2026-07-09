"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

const NAV = [
  { href: "/admin/bookings",   label: "Bookings",   icon: "📅" },
  { href: "/admin/installers", label: "Installers", icon: "🔧" },
  { href: "/admin/dashboard",  label: "Leads",      icon: "📋" },
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
      <header className="bg-[#111] text-white flex items-center gap-4 px-6 py-3 shadow-lg">
        <span className="font-extrabold text-lg tracking-tight">
          <span className="text-[#E50914]">Prime</span>TV
          <span className="ml-2 text-xs font-normal text-white/40 uppercase tracking-widest">Admin</span>
        </span>

        <nav className="flex-1 flex gap-1 ml-6">
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                path.startsWith(n.href)
                  ? "bg-[#E50914] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{n.icon}</span> {n.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="text-xs text-white/40 hover:text-white transition px-3 py-1.5 rounded-full hover:bg-white/10"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
