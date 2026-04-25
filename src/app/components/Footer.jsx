import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react"

const serviceLinks = [
  { label: "TV Wall Mounting", href: "/services/tv-mounting" },
  { label: "Home Theater Setup", href: "/services/home-theater" },
  { label: "Soundbar Installation", href: "/soundbar-installation-nashville" },
  { label: "Pricing", href: "/pricing" },
]

const areaLinks = [
  { label: "Nashville", href: "/tv-mounting-nashville" },
  { label: "Brentwood", href: "/tv-mounting-brentwood" },
  { label: "Franklin", href: "/tv-mounting-franklin" },
  { label: "Murfreesboro", href: "/tv-mounting-murfreesboro" },
  { label: "Hendersonville", href: "/tv-mounting-hendersonville" },
  { label: "Mount Juliet", href: "/tv-mounting-mount-juliet" },
  { label: "Smyrna", href: "/tv-mounting-smyrna" },
  { label: "Gallatin", href: "/tv-mounting-gallatin" },
]

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Book Installation", href: "/book" },
]

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookies Policy", href: "/cookies-policy" },
]

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">

      {/* ── TOP CTA BAND ── */}
      <div className="border-b border-white/5 bg-[#E50914]/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-lg font-black text-white">Ready to mount your TV?</p>
            <p className="text-sm text-white/50 mt-0.5">Same-day availability across Greater Nashville.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+16152087089"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition"
            >
              <Phone size={14} />
              (615) 208-7089
            </a>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-[#E50914] px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-lg shadow-red-500/20 transition"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

        {/* COL 1 — Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex items-center justify-center size-9 rounded-xl bg-[#E50914] shadow-lg shadow-red-500/30">
              <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="14" rx="2" />
                <path d="M8 20h8M12 18v2" />
              </svg>
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">
              PrimeTv<span className="text-[#E50914]">Nashville</span>
            </span>
          </Link>

          <p className="mt-4 text-sm text-white/45 leading-relaxed max-w-xs">
            Professional TV mounting and home theater installation across Nashville and all surrounding cities in Tennessee.
          </p>

          {/* Contact info */}
          <div className="mt-6 space-y-2.5">
            <a href="tel:+16152087089" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition">
              <Phone size={13} className="text-[#E50914] shrink-0" />
              (615) 208-7089
            </a>
            <a href="mailto:info@primetvnashville.com" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition">
              <Mail size={13} className="text-[#E50914] shrink-0" />
              info@primetvnashville.com
            </a>
            <span className="flex items-center gap-2.5 text-sm text-white/60">
              <MapPin size={13} className="text-[#E50914] shrink-0" />
              Nashville, Tennessee
            </span>
          </div>

          {/* Social */}
          <div className="mt-6 flex items-center gap-2">
            <a
              href="https://www.facebook.com/primetvnashville"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center size-9 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://www.instagram.com/primetvnashville"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center size-9 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition"
            >
              <Instagram size={15} />
            </a>
          </div>
        </div>

        {/* COL 2 — Services */}
        <div>
          <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Services</h3>
          <ul className="space-y-2.5">
            {serviceLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/55 hover:text-white transition flex items-center gap-2 group">
                  <span className="size-1 rounded-full bg-[#E50914] shrink-0 opacity-0 group-hover:opacity-100 transition" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mt-8 mb-4">Company</h3>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/55 hover:text-white transition flex items-center gap-2 group">
                  <span className="size-1 rounded-full bg-[#E50914] shrink-0 opacity-0 group-hover:opacity-100 transition" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COL 3 — Areas */}
        <div>
          <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Areas We Serve</h3>
          <ul className="space-y-2.5">
            {areaLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/55 hover:text-white transition flex items-center gap-2 group">
                  <span className="size-1 rounded-full bg-[#E50914] shrink-0 opacity-0 group-hover:opacity-100 transition" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/services" className="mt-4 inline-flex items-center text-xs text-[#E50914] hover:text-red-400 transition font-semibold gap-1">
            View all areas →
          </Link>
        </div>

        {/* COL 4 — Hours + Trust */}
        <div>
          <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Business Hours</h3>
          <div className="space-y-1.5 text-sm text-white/55">
            <div className="flex justify-between gap-4">
              <span>Mon – Fri</span>
              <span className="text-white/80 font-medium">8 AM – 6 PM</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Saturday</span>
              <span className="text-white/80 font-medium">8 AM – 6 PM</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Sunday</span>
              <span className="text-white/40">Closed</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 space-y-2.5">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
              <span className="flex items-center justify-center size-7 rounded-lg bg-yellow-400/15 shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 text-yellow-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
              </span>
              <div>
                <p className="text-xs font-bold text-white">4.9 / 5 Stars</p>
                <p className="text-[10px] text-white/40">120+ Google Reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
              <span className="flex items-center justify-center size-7 rounded-lg bg-[#E50914]/15 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5 text-[#E50914]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </span>
              <div>
                <p className="text-xs font-bold text-white">Licensed & Insured</p>
                <p className="text-[10px] text-white/40">Fully certified technicians</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} PrimeTvNashville. All rights reserved.</p>

          <div className="flex items-center gap-4">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white/60 transition">
                {l.label}
              </Link>
            ))}
          </div>

          <p>
            Built by{" "}
            <a
              href="https://www.boostori.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E50914] hover:text-red-400 font-medium transition"
            >
              Boostori
            </a>
          </p>
        </div>
      </div>

    </footer>
  )
}
