import { getAllPosts } from "./lib/blog"

const BASE = "https://www.primetvnashville.com"

const CITIES = [
  "nashville", "brentwood", "franklin", "gallatin", "goodlettsville",
  "hendersonville", "la-vergne", "lebanon", "mount-juliet", "murfreesboro",
  "nolensville", "smyrna", "spring-hill",
]

const STATIC_PAGES = [
  { path: "",                          priority: 1.0,  freq: "weekly",  date: "2026-06-20" },
  { path: "/book",                     priority: 0.95, freq: "monthly", date: "2026-05-01" },
  { path: "/services/tv-mounting",     priority: 0.85, freq: "monthly", date: "2026-05-01" },
  { path: "/services/home-theater",    priority: 0.80, freq: "monthly", date: "2026-05-01" },
  { path: "/services",                 priority: 0.75, freq: "monthly", date: "2026-05-01" },
  { path: "/pricing",                  priority: 0.75, freq: "monthly", date: "2026-05-01" },
  { path: "/contact",                  priority: 0.70, freq: "monthly", date: "2026-05-01" },
  { path: "/about",                    priority: 0.65, freq: "monthly", date: "2026-05-01" },
  { path: "/blog",                     priority: 0.70, freq: "weekly",  date: "2026-06-20" },
  { path: "/soundbar-installation-nashville",          priority: 0.75, freq: "monthly", date: "2026-05-01" },
  { path: "/samsung-frame-tv-installation-nashville",  priority: 0.85, freq: "monthly", date: "2026-05-01" },
  { path: "/tv-mounting-over-fireplace-nashville",     priority: 0.85, freq: "monthly", date: "2026-05-01" },
  { path: "/cable-concealment-nashville",              priority: 0.80, freq: "monthly", date: "2026-05-01" },
]

export default function sitemap() {
  const staticEntries = STATIC_PAGES.map(({ path, priority, freq, date }) => ({
    url: `${BASE}${path}`,
    lastModified: date,
    changeFrequency: freq,
    priority,
  }))

  const cityEntries = CITIES.map(city => ({
    url: `${BASE}/tv-mounting-${city}`,
    lastModified: "2026-05-01",
    changeFrequency: "monthly",
    priority: 0.80,
  }))

  const blogEntries = getAllPosts().map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.65,
  }))

  return [...staticEntries, ...cityEntries, ...blogEntries]
}
