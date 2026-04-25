"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, Phone, X } from "lucide-react"

const services = [
  { label: "TV Wall Mounting", href: "/services/tv-mounting", desc: "Secure mounting for any wall type" },
  { label: "Home Theater Setup", href: "/services/home-theater", desc: "Full AV system installation" },
  { label: "Soundbar Installation", href: "/soundbar-installation-nashville", desc: "Mounting & calibration" },
  { label: "All Services", href: "/services", desc: "View everything we offer" },
]

const navLinks = [
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 w-full z-[60] bg-[#E50914] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center justify-center gap-3 text-white text-xs sm:text-sm font-medium">
                <span className="hidden sm:flex items-center gap-1.5">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-white" />
                  </span>
                  Same-Day & Next-Day Availability in Nashville
                </span>
                <span className="sm:hidden">Same-Day Availability</span>
                <span className="hidden sm:block text-white/60">·</span>
                <a href="tel:+16152087089" className="flex items-center gap-1 font-bold underline-offset-2 hover:underline">
                  <Phone size={12} />
                  (615) 208-7089
                </a>
              </div>
              <button
                onClick={() => setAnnouncementVisible(false)}
                aria-label="Close announcement"
                className="text-white/80 hover:text-white transition shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN NAV ── */}
      <header
        className={`fixed left-0 w-full z-50 transition-all duration-300 ${
          announcementVisible ? "top-[36px]" : "top-0"
        } ${
          scrolled
            ? "bg-black/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)] shadow-lg"
            : "bg-black"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex items-center justify-center size-8 rounded-lg bg-[#E50914] shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow">
              <svg viewBox="0 0 24 24" fill="none" className="size-4.5 text-white" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="14" rx="2" />
                <path d="M8 20h8M12 18v2" />
              </svg>
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">
              PrimeTv<span className="text-[#E50914]">Nashville</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith("/services")
                        ? "text-[#E50914]"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden"
                      >
                        {services.map((s, i) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            className={`flex flex-col px-4 py-3 hover:bg-white/5 transition-colors ${
                              i < services.length - 1 ? "border-b border-white/5" : ""
                            }`}
                          >
                            <span className="text-sm font-semibold text-white">{s.label}</span>
                            <span className="text-xs text-white/50 mt-0.5">{s.desc}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-[#E50914]"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="tel:+16152087089"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition font-medium"
            >
              <Phone size={14} />
              (615) 208-7089
            </a>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-[#E50914] px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
            >
              Book Now
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-[#0a0a0a] border-t border-white/5"
            >
              <div className="px-4 py-6 space-y-1">
                {navLinks.map((link) =>
                  link.hasDropdown ? (
                    <div key={link.href}>
                      <p className="px-3 py-2 text-xs font-bold text-white/30 uppercase tracking-widest mt-3 mb-1">
                        Services
                      </p>
                      {services.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <span className="size-1.5 rounded-full bg-[#E50914] shrink-0" />
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? "text-[#E50914] bg-red-500/10"
                          : "text-white/80 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}

                {/* Mobile CTAs */}
                <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
                  <a
                    href="tel:+16152087089"
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 py-3 text-sm font-semibold text-white hover:bg-white/5 transition"
                  >
                    <Phone size={14} />
                    (615) 208-7089
                  </a>
                  <Link
                    href="/book"
                    className="flex items-center justify-center w-full rounded-xl bg-[#E50914] py-3 text-sm font-bold text-white hover:bg-red-700 transition shadow-lg shadow-red-500/20"
                  >
                    Book Installation
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer so content doesn't hide under nav */}
      <div className={`${announcementVisible ? "h-[calc(36px+64px)]" : "h-16"}`} aria-hidden="true" />
    </>
  )
}
