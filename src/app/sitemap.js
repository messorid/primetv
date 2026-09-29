import { getAllPosts } from "./lib/blog"
import { PLAYSETS } from "./lib/playsets"
import { GAZEBOS } from "./lib/gazebos"
import { BRANDS, SIZES } from "./lib/tvModels"

const BASE = "https://www.primetvnashville.com"

const CITIES = [
  "brentwood", "franklin", "gallatin", "goodlettsville",
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

  // Home installation services
  { path: "/home-installation-services-nashville",     priority: 0.85, freq: "monthly", date: "2026-09-10" },
  { path: "/playset-installation-nashville",           priority: 0.85, freq: "monthly", date: "2026-09-10" },
  { path: "/playground-installation-nashville",         priority: 0.85, freq: "monthly", date: "2026-09-10" },
  { path: "/furniture-assembly-nashville",             priority: 0.80, freq: "monthly", date: "2026-09-10" },
  { path: "/picture-mirror-hanging-nashville",         priority: 0.80, freq: "monthly", date: "2026-09-10" },
  { path: "/wall-installation-services-nashville",     priority: 0.80, freq: "monthly", date: "2026-09-10" },
  { path: "/gazebo-installation-nashville",            priority: 0.80, freq: "monthly", date: "2026-09-10" },

  // Specialty TV pages
  { path: "/oled-tv-mounting",                         priority: 0.80, freq: "monthly", date: "2026-09-29" },
]

export default function sitemap() {
  const staticEntries = STATIC_PAGES.map(({ path, priority, freq, date }) => ({
    url: `${BASE}${path}`,
    lastModified: date,
    changeFrequency: freq,
    priority,
  }))

  // Brand and size pages are generated from the same list the pages read, so a
  // new brand or size can never be added to the site and missed in the sitemap.
  const brandEntries = BRANDS.map(b => ({
    url: `${BASE}${b.path}`,
    lastModified: "2026-09-29",
    changeFrequency: "monthly",
    priority: 0.85,
  }))

  const sizeEntries = SIZES.map(s => ({
    url: `${BASE}${s.path}`,
    lastModified: "2026-09-29",
    changeFrequency: "monthly",
    priority: 0.85,
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

  const gazeboEntries = GAZEBOS.map(g => ({
    url: `${BASE}/gazebo-installation-nashville/${g.slug}`,
    lastModified: "2026-09-11",
    changeFrequency: "monthly",
    priority: 0.70,
  }))

  const playsetEntries = PLAYSETS.map(p => ({
    url: `${BASE}/playset-installation-nashville/${p.slug}`,
    lastModified: "2026-09-10",
    changeFrequency: "monthly",
    priority: 0.70,
  }))

  return [
    ...staticEntries,
    ...brandEntries,
    ...sizeEntries,
    ...cityEntries,
    ...playsetEntries,
    ...gazeboEntries,
    ...blogEntries,
  ]
}
