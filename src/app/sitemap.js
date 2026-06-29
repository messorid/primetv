const BASE = "https://primetvnashville.com"

const CITIES = [
  "nashville", "brentwood", "franklin", "gallatin", "goodlettsville",
  "hendersonville", "la-vergne", "lebanon", "mount-juliet", "murfreesboro",
  "nolensville", "smyrna", "spring-hill",
]

const STATIC_PAGES = [
  { path: "",                          priority: 1.0,  freq: "weekly"  },
  { path: "/book",                     priority: 0.95, freq: "monthly" },
  { path: "/services/tv-mounting",     priority: 0.85, freq: "monthly" },
  { path: "/services/home-theater",    priority: 0.80, freq: "monthly" },
  { path: "/services",                 priority: 0.75, freq: "monthly" },
  { path: "/pricing",                  priority: 0.75, freq: "monthly" },
  { path: "/contact",                  priority: 0.70, freq: "monthly" },
  { path: "/about",                    priority: 0.65, freq: "monthly" },
  { path: "/blog",                     priority: 0.70, freq: "weekly"  },
  { path: "/soundbar-installation-nashville",             priority: 0.75, freq: "monthly" },
  { path: "/samsung-frame-tv-installation-nashville",    priority: 0.85, freq: "monthly" },
  { path: "/tv-mounting-over-fireplace-nashville",       priority: 0.85, freq: "monthly" },
  { path: "/cable-concealment-nashville",                priority: 0.80, freq: "monthly" },
]

export default function sitemap() {
  const now = new Date()

  const staticEntries = STATIC_PAGES.map(({ path, priority, freq }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }))

  const cityEntries = CITIES.map(city => ({
    url: `${BASE}/tv-mounting-${city}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.80,
  }))

  return [...staticEntries, ...cityEntries]
}
