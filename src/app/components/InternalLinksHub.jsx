import Link from "next/link"

const SERVICES = [
  {
    href: "/samsung-frame-tv-installation-nashville",
    title: "Samsung Frame TV",
    desc: "Slim fit mount, One Connect Box routing and Art Mode setup.",
    icon: "🖼️",
  },
  {
    href: "/tv-mounting-over-fireplace-nashville",
    title: "TV Over Fireplace",
    desc: "Heat clearance verified. Brick, stone and drywall.",
    icon: "🔥",
  },
  {
    href: "/cable-concealment-nashville",
    title: "Cable Concealment",
    desc: "In-wall routing or surface raceway. $60 add-on per TV.",
    icon: "🔌",
  },
  {
    href: "/soundbar-installation-nashville",
    title: "Soundbar Installation",
    desc: "Mounted below or above the TV with clean cable management.",
    icon: "🔊",
  },
]

const CITIES = [
  { href: "/tv-mounting-brentwood",     label: "Brentwood" },
  { href: "/tv-mounting-franklin",      label: "Franklin" },
  { href: "/tv-mounting-murfreesboro",  label: "Murfreesboro" },
  { href: "/tv-mounting-hendersonville",label: "Hendersonville" },
  { href: "/tv-mounting-mount-juliet",  label: "Mount Juliet" },
  { href: "/tv-mounting-smyrna",        label: "Smyrna" },
  { href: "/tv-mounting-gallatin",      label: "Gallatin" },
  { href: "/tv-mounting-nolensville",   label: "Nolensville" },
  { href: "/tv-mounting-spring-hill",   label: "Spring Hill" },
  { href: "/tv-mounting-nashville",     label: "Nashville" },
]

export default function InternalLinksHub() {
  return (
    <section className="w-full bg-white py-16 border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto px-5 md:px-6">

        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-black">
              Explore Our Services & Areas
            </h2>
            <p className="mt-1 text-black/55 text-sm">
              Specialized TV installation services and local coverage across Nashville metro.
            </p>
          </div>
          <Link
            href="/services"
            className="self-start sm:self-auto text-sm font-semibold text-[#E50914] hover:underline underline-offset-2 whitespace-nowrap"
          >
            View all services →
          </Link>
        </div>

        {/* services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {SERVICES.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-2xl border border-black/10 bg-gray-50 p-5 hover:border-[#E50914]/40 hover:bg-red-50/30 hover:shadow-md transition-all"
            >
              <span className="text-2xl">{s.icon}</span>
              <h3 className="mt-2 font-bold text-black group-hover:text-[#E50914] transition-colors">
                {s.title}
              </h3>
              <p className="mt-1 text-xs text-black/55 leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>

        {/* divider */}
        <div className="border-t border-black/[0.06] pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">
            Service Areas Near Nashville
          </p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map(c => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-full border border-black/10 bg-gray-50 px-4 py-2 text-sm font-semibold text-black/70 hover:border-[#E50914]/50 hover:text-[#E50914] transition-all"
              >
                TV Mounting {c.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
