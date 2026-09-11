// ─────────────────────────────────────────────────────────────────────────────
// GAZEBO MODELS — one landing page is generated per entry.
//
// Descriptions stay at the level we can stand behind: the construction type,
// the roof style and the footprint printed on the box. We deliberately do not
// publish panel counts, weights or hardware specs, because those change between
// model years and a wrong spec on our own site is worse than no spec at all.
// Customers should always check the manual that ships with their kit.
//
// To add a model: append an entry here. The hub page, the dynamic route and the
// sitemap all read from this list.
// ─────────────────────────────────────────────────────────────────────────────

// Rough on-site assembly windows, driven by footprint and construction. Always
// presented as approximate — the surface and the site change the real figure.
const TIER_TIME = {
  compact: "4–7 hours",
  mid:     "6–10 hours",
  large:   "10–16 hours, often across two days",
  xlarge:  "14–20 hours, usually across two days",
}

const ROOF_LABEL = {
  hardtop: "Hardtop",
  softtop: "Soft top",
}

const MATERIAL_LABEL = {
  metal: "Aluminium / steel frame",
  wood:  "Cedar wood frame",
}

export const GAZEBOS = [
  {
    slug: "style-selections-10x10-soft-top-gazebo",
    name: "Style Selections 10' × 10' Soft Top Gazebo",
    brand: "Style Selections",
    size: "10' × 10'",
    roof: "softtop",
    material: "metal",
    tier: "compact",
    blurb: "A compact soft-top gazebo on a steel frame, with a fabric canopy rather than rigid roof panels. The canopy has to be tensioned evenly or it pools water in the first heavy Tennessee rain.",
    installNote: "Style Selections is Lowe's own label, so this is usually somebody's first gazebo rather than a replacement. Two things are worth knowing before we build. A soft top is seasonal \u2014 the canopy is a consumable that gets replaced every few years, not a permanent roof, and it should come down before winter. And at ten by ten it is the one size in this list that drops onto a standard patio slab without you having to think about it.",
  },
  {
    slug: "allen-roth-10x12-hardtop-gazebo",
    name: "allen + roth 10' × 12' Hardtop Gazebo",
    brand: "allen + roth",
    size: "10' × 12'",
    roof: "hardtop",
    material: "metal",
    tier: "mid",
    blurb: "A mid-size hardtop gazebo on a metal frame. The rigid roof panels have to seat and overlap correctly across the span — that's what decides whether water sheds or finds its way through a seam.",
    installNote: "allen + roth is Lowe's step up from the soft-top shelf, and the reason people move across is the roof: rigid panels instead of fabric, so nothing has to come down in November. That trade costs weight up top. The roof goes on over a twelve-foot span and it is not a lift to improvise with a stepladder and one helper.",
  },
  {
    slug: "backyard-discovery-arcadia-12x14",
    name: "Backyard Discovery Arcadia 12' × 14'",
    brand: "Backyard Discovery",
    size: "12' × 14'",
    roof: "hardtop",
    material: "wood",
    tier: "large",
    blurb: "A large cedar gazebo. Wood posts and beams are considerably heavier than an aluminium frame, so the build needs a crew, a level base and correct post anchoring from the first bolt.",
    installNote: "The Arcadia is a cedar structure, which puts it in a different category from the aluminium gazebos on this list. Wood arrives heavy and stays heavy \u2014 posts and beams are two-person lifts before anything is bolted. It also arrives raw. Cedar wants sealing or staining to hold up to Middle Tennessee summers, and the easiest window for that is before the roof goes on, while the timber is still reachable.",
  },
  {
    slug: "backyard-discovery-barrington-12x16",
    name: "Backyard Discovery Barrington 12' × 16'",
    brand: "Backyard Discovery",
    size: "12' × 16'",
    roof: "hardtop",
    material: "wood",
    tier: "xlarge",
    blurb: "One of the larger cedar gazebos in the range. The footprint, the beam weight and the roof span all push this well past a weekend DIY project.",
    installNote: "At twelve by sixteen the Barrington is the largest cedar gazebo we assemble, and the honest answer on timing is two days for most sites. The span is the reason. A roof that size cannot be walked into position by two people, and the beams that carry it are heavy enough that rushing the lift is how people get hurt. Worth planning the footprint carefully too \u2014 sixteen feet eats more patio than the box photo suggests.",
  },
  {
    slug: "veikous-10x13-hardtop-gazebo",
    name: "VEIKOUS 10' × 13' Hardtop Gazebo",
    brand: "VEIKOUS",
    size: "10' × 13'",
    roof: "hardtop",
    material: "metal",
    tier: "mid",
    blurb: "A mid-size hardtop on an aluminium frame. VEIKOUS kits are squared during assembly rather than after, so getting the base frame true before the roof goes on matters more than it looks like it should.",
    installNote: "Thirteen feet is the odd dimension in this range and it catches people out. A ten by twelve drops onto most standard patio slabs; a ten by thirteen often does not, and the extra foot ends up hanging over an edge or into a flower bed. Measure the slab before the kit arrives. Once the footprint is settled the build itself is a routine aluminium hardtop.",
  },
  {
    slug: "veikous-10x12-hardtop-gazebo",
    name: "VEIKOUS 10' × 12' Hardtop Gazebo",
    brand: "VEIKOUS",
    size: "10' × 12'",
    roof: "hardtop",
    material: "metal",
    tier: "mid",
    blurb: "A hardtop aluminium gazebo in the most common backyard footprint. Straightforward once the frame is square and the roof panels are seated in the right order.",
    installNote: "This is the most common gazebo footprint in Nashville backyards, and VEIKOUS sells a lot of them direct rather than through a store. That matters for one practical reason: if a part is short there is no returns desk to walk into, so we inventory the hardware before the first bolt and tell you the same day if something needs claiming from the manufacturer.",
  },
  {
    slug: "veikous-12x16-hardtop-gazebo",
    name: "VEIKOUS 12' × 16' Hardtop Gazebo",
    brand: "VEIKOUS",
    size: "12' × 16'",
    roof: "hardtop",
    material: "metal",
    tier: "large",
    blurb: "A large hardtop aluminium gazebo. The extra span means more roof panels, more alignment points and a frame that has to be genuinely level before the roof is loaded onto it.",
    installNote: "Stepping from a ten-foot to a twelve-foot frame changes the job more than the numbers suggest. There are more roof panels, more alignment points where a small error compounds, and a frame that has to be genuinely level rather than close enough before the roof is loaded onto it. A twelve by sixteen built on a base that was out by an inch will show it in the roof line.",
  },
  {
    slug: "veikous-12x20-hardtop-gazebo",
    name: "VEIKOUS 12' × 20' Hardtop Gazebo",
    brand: "VEIKOUS",
    size: "12' × 20'",
    roof: "hardtop",
    material: "metal",
    tier: "xlarge",
    blurb: "The largest footprint in the VEIKOUS range we assemble. At twenty feet the roof span and the number of panels put this firmly in two-day territory for most sites.",
    installNote: "Twenty feet is the largest footprint we assemble in this range and it is a two-day build on most sites. The roof span is the whole story \u2014 it needs enough hands to raise and seat safely, and it needs a base that is level end to end, not just level where you happened to check. Worth confirming the pad or the ground will actually take twenty feet before the kit is delivered.",
  },
  {
    slug: "joyracer-jsgz-10x10-hardtop-gazebo",
    name: "JOYRACER JSGZ 10' × 10' Hardtop Gazebo",
    brand: "JOYRACER",
    size: "10' × 10'",
    roof: "hardtop",
    material: "metal",
    tier: "compact",
    blurb: "A compact hardtop gazebo on a metal frame. Small enough for most patios, and quick to build once the base is squared and anchored to the right surface.",
    installNote: "A compact hardtop, and one of the quicker builds on this list \u2014 a single day comfortably, provided the surface underneath is already level. That caveat does most of the work. Ten by ten fits nearly any patio, so the question is almost never space; it is whether the slab or the ground has settled, because a small frame shows a slope just as clearly as a large one.",
  },
  {
    slug: "aoxun-10x12-hardtop-gazebo",
    name: "AOXUN 10' × 12' Hardtop Gazebo",
    brand: "AOXUN",
    size: "10' × 12'",
    roof: "hardtop",
    material: "metal",
    tier: "mid",
    blurb: "A hardtop metal gazebo in a standard backyard footprint. Panel seating and frame squareness are the two things that decide how it holds up over a few Tennessee seasons.",
    installNote: "AOXUN sells mostly through Amazon and similar channels, which means the kit often turns up in several boxes on different days. Have all of them on site before we schedule \u2014 a build stopped halfway because box three is still in transit costs you a return visit. Beyond that it is a standard ten by twelve aluminium hardtop and a straightforward day.",
  },
  {
    slug: "backyard-discovery-arlington-12x12",
    name: "Backyard Discovery Arlington 12' × 12'",
    brand: "Backyard Discovery",
    size: "12' × 12'",
    roof: "hardtop",
    material: "wood",
    tier: "large",
    blurb: "A square cedar gazebo. Like the rest of the Backyard Discovery wood range, the posts and beams are heavy and the base has to be level and correctly anchored before anything goes vertical.",
    installNote: "The Arlington is square rather than rectangular, which sounds like a detail and is not. A twelve by twelve cedar frame has to be true on the diagonal, and unlike a rectangle there is no long axis to sight down and catch a mistake \u2014 an out-of-square base shows up in the roof, by which point it is expensive to fix. We check the diagonals before anything goes vertical.",
  },
  {
    slug: "elevate-outdoors-solora-10x12",
    name: "ELEVATE OUTDOORS Solora 10' × 12'",
    brand: "ELEVATE OUTDOORS",
    size: "10' × 12'",
    roof: "hardtop",
    material: "metal",
    tier: "mid",
    blurb: "A hardtop gazebo on a metal frame in the common 10 by 12 footprint. A mid-size build that goes smoothly when the base is square and the roof panels go on in sequence.",
    installNote: "A hardtop on a metal frame in the standard ten by twelve footprint. The Solora goes together predictably when the base is square and the panels follow the sequence in the manual. If you are choosing between this and a cedar gazebo, the practical difference is maintenance: aluminium needs none, cedar wants sealing every couple of years.",
  },
  {
    slug: "hampton-bay-holden-10x10-hardtop-gazebo",
    name: "Hampton Bay Holden 10' × 10' Hardtop Gazebo",
    brand: "Hampton Bay",
    size: "10' × 10'",
    roof: "hardtop",
    material: "metal",
    tier: "compact",
    blurb: "A compact hardtop gazebo on a metal frame, sized for a patio or a deck corner. One of the quicker builds in this list, provided the surface underneath is level.",
    installNote: "Hampton Bay is Home Depot's own label, so the Holden is widely bought and widely half-finished in garages around Nashville. It is genuinely one of the easier builds here \u2014 compact, hardtop, no canopy to tension. The part that stops people is the roof lift, which is short but awkward, and not something to attempt alone off a ladder.",
  },
  {
    slug: "kozyard-apollo-10x12-hardtop-gazebo",
    name: "KOZYARD Apollo 10' × 12' Hardtop Gazebo",
    brand: "KOZYARD",
    size: "10' × 12'",
    roof: "hardtop",
    material: "metal",
    tier: "mid",
    blurb: "A hardtop aluminium gazebo in a 10 by 12 footprint. The roof panels need to seat and overlap properly across the span to shed water the way they are designed to.",
    installNote: "A ten by twelve aluminium hardtop. The Apollo's roof relies on panel overlap to shed water, so the order the panels go on in is not a suggestion \u2014 a panel fastened out of sequence is the single most common reason a hardtop gazebo drips at a seam a month later. We follow the manual's sequence rather than working around the frame.",
  },
  {
    slug: "covered-outdoor-ultra-series-10x12-hardtop-gazebo",
    name: "COVERED OUTDOOR Ultra Series 10' × 12' Hardtop Gazebo",
    brand: "COVERED OUTDOOR",
    size: "10' × 12'",
    roof: "hardtop",
    material: "metal",
    tier: "mid",
    blurb: "A hardtop gazebo from the Ultra Series on a metal frame. Standard backyard footprint, with the usual hardtop priorities: a square base and correctly seated roof panels.",
    installNote: "The Ultra Series sits at the heavier end of the ten by twelve hardtops, which is good news once it is standing and more work getting there. Heavier roof panels are less forgiving of a frame that is slightly out of square, because they will not draw into position the way a light panel does. We square the base properly rather than relying on the roof to pull it true.",
  },
]

export const GAZEBO_BRANDS = [...new Set(GAZEBOS.map(g => g.brand))]

export function getGazebo(slug) {
  return GAZEBOS.find(g => g.slug === slug) || null
}

export function gazeboTime(tier)     { return TIER_TIME[tier] || TIER_TIME.mid }
export function gazeboRoofLabel(r)   { return ROOF_LABEL[r] || ROOF_LABEL.hardtop }
export function gazeboMaterial(m)    { return MATERIAL_LABEL[m] || MATERIAL_LABEL.metal }

// Cross-links: prefer the same brand, then the same construction, so a visitor
// comparing cedar gazebos isn't sent to a soft-top steel one.
export function relatedGazebos(slug, count = 4) {
  const current = getGazebo(slug)
  if (!current) return GAZEBOS.slice(0, count)

  const sameBrand    = GAZEBOS.filter(g => g.slug !== slug && g.brand === current.brand)
  const sameMaterial = GAZEBOS.filter(g => g.slug !== slug && g.brand !== current.brand && g.material === current.material)
  const rest         = GAZEBOS.filter(g => g.slug !== slug && g.brand !== current.brand && g.material !== current.material)
  return [...sameBrand, ...sameMaterial, ...rest].slice(0, count)
}
