// ─────────────────────────────────────────────────────────────────────────────
// PLAYSET MODELS — one landing page is generated per entry.
//
// Descriptions stay at the level we can stand behind: the kind of structure it
// is and what our crew does to install it. We deliberately do not publish part
// counts, dimensions or weights, because those change between model years and a
// wrong spec on our own site is worse than no spec at all. Customers should
// always check the manual that ships with their kit.
//
// To add a model: append an entry here. The hub page, the dynamic route and the
// sitemap all read from this list.
// ─────────────────────────────────────────────────────────────────────────────

// Rough on-site assembly windows. Always presented as approximate — the real
// figure depends on the yard, the surface and whether the kit is complete.
const TIER_TIME = {
  compact: "4–8 hours",
  mid:     "6–12 hours",
  large:   "10–20 hours, often across two days",
}

const TIER_LABEL = {
  compact: "Compact playset",
  mid:     "Mid-size playset",
  large:   "Large playset / fort",
}

export const PLAYSETS = [
  {
    slug:  "backyard-discovery-buckley-hill",
    name:  "Backyard Discovery Buckley Hill",
    brand: "Backyard Discovery",
    tier:  "compact",
    blurb: "A compact cedar swing set built for smaller yards, combining a play tower, a slide and a swing beam in a footprint that fits most suburban lots.",
  },
  {
    slug:  "backyard-discovery-canyon-creek",
    name:  "Backyard Discovery Canyon Creek",
    brand: "Backyard Discovery",
    tier:  "mid",
    blurb: "A mid-size cedar playset with a raised clubhouse deck, a slide and a swing beam — one of the most common wooden sets we assemble in Middle Tennessee backyards.",
  },
  {
    slug:  "backyard-discovery-cedar-cove",
    name:  "Backyard Discovery Cedar Cove",
    brand: "Backyard Discovery",
    tier:  "mid",
    blurb: "A cedar playset centred on a covered upper deck with a slide and swing beam, giving kids shade as well as a climbing structure.",
  },
  {
    slug:  "backyard-discovery-rosewood-falls",
    name:  "Backyard Discovery Rosewood Falls",
    brand: "Backyard Discovery",
    tier:  "mid",
    blurb: "A cedar clubhouse-style playset that pairs an enclosed play area with a slide and swings, popular with families who want a shaded play space underneath.",
  },
  {
    slug:  "backyard-discovery-montpelier",
    name:  "Backyard Discovery Montpelier",
    brand: "Backyard Discovery",
    tier:  "mid",
    blurb: "A cedar swing set with a raised play tower, a slide and a multi-position swing beam — a straightforward, sturdy set once it is anchored and squared correctly.",
  },
  {
    slug:  "backyard-discovery-beach-front",
    name:  "Backyard Discovery Beach Front",
    brand: "Backyard Discovery",
    tier:  "mid",
    blurb: "A wooden playset built around an open deck with a slide and swing beam, designed to sit comfortably in an average-sized backyard.",
  },
  {
    slug:  "backyard-discovery-skyfort-ii",
    name:  "Backyard Discovery Skyfort II",
    brand: "Backyard Discovery",
    tier:  "large",
    blurb: "One of the largest cedar forts Backyard Discovery makes — a multi-tower structure with upper decks, a tube slide and climbing features. A serious build that rewards a professional crew.",
  },
  {
    slug:  "backyard-discovery-sterling-point",
    name:  "Backyard Discovery Sterling Point",
    brand: "Backyard Discovery",
    tier:  "large",
    blurb: "A large multi-level cedar playset with several decks, a slide and climbing features. The number of components and the height of the towers make level ground and correct anchoring critical.",
  },
  {
    slug:  "backyard-discovery-atlantis",
    name:  "Backyard Discovery Atlantis",
    brand: "Backyard Discovery",
    tier:  "large",
    blurb: "A large cedar playset with multiple towers, more than one slide and a swing beam. One of the bigger weekend projects in the Backyard Discovery range.",
  },
  {
    slug:  "backyard-discovery-skyfort-tube-slide",
    name:  "Backyard Discovery Skyfort + Tube Slide",
    brand: "Backyard Discovery",
    tier:  "large",
    blurb: "The Skyfort configuration built around a tube slide. The slide sections and the elevated decks are the parts most often assembled wrong on a DIY build.",
  },
  {
    slug:  "backyard-discovery-spruce-hollow",
    name:  "Backyard Discovery Spruce Hollow",
    brand: "Backyard Discovery",
    tier:  "compact",
    blurb: "A compact cedar swing set pairing a play tower and slide with a swing beam — a good fit for smaller yards and younger children.",
  },
  {
    slug:  "backyard-discovery-white-canyon-creek",
    name:  "Backyard Discovery White Canyon Creek",
    brand: "Backyard Discovery",
    tier:  "mid",
    blurb: "The Canyon Creek layout in a white finish. The painted panels need careful handling during assembly so the finish reaches the finished set unmarked.",
  },
  {
    slug:  "backyard-discovery-tanglewood",
    name:  "Backyard Discovery Tanglewood",
    brand: "Backyard Discovery",
    tier:  "mid",
    blurb: "A cedar playset combining a raised deck, a slide and a swing beam in a mid-size footprint suited to most family backyards.",
  },
  {
    slug:  "gorilla-playsets-outing-iii",
    name:  "Gorilla Playsets Outing III",
    brand: "Gorilla Playsets",
    tier:  "mid",
    blurb: "A cedar swing set from Gorilla Playsets with a play deck, a slide and a swing beam. Gorilla kits use their own hardware conventions, which we are set up for.",
  },
  {
    slug:  "kidkraft-ainsley-wooden-playset",
    name:  "KidKraft Ainsley Wooden Playset",
    brand: "KidKraft",
    tier:  "mid",
    blurb: "A wooden KidKraft playset built around a clubhouse with a slide and swings. KidKraft panels are lighter than cedar forts but the step count is still high.",
  },
]

export const PLAYSET_BRANDS = [...new Set(PLAYSETS.map(p => p.brand))]

export function getPlayset(slug) {
  return PLAYSETS.find(p => p.slug === slug) || null
}

export function playsetTime(tier) {
  return TIER_TIME[tier] || TIER_TIME.mid
}

export function playsetTierLabel(tier) {
  return TIER_LABEL[tier] || TIER_LABEL.mid
}

// A handful of other models to cross-link from a model page, keeping every page
// reachable from every other one.
export function relatedPlaysets(slug, count = 4) {
  const current = getPlayset(slug)
  if (!current) return PLAYSETS.slice(0, count)

  const sameBrand = PLAYSETS.filter(p => p.slug !== slug && p.brand === current.brand)
  const others    = PLAYSETS.filter(p => p.slug !== slug && p.brand !== current.brand)
  return [...sameBrand, ...others].slice(0, count)
}
