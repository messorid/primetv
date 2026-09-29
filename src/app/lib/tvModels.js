// ─────────────────────────────────────────────────────────────────────────────
// TV MODELS — single source of truth for the brand pages, the size pages and
// the "how to mount" guides, so the cross-links between them can never drift.
//
// Deliberately conservative about specs. Screen-size and weight talk stays in
// general terms ("85-inch panels typically weigh 90+ lbs") because publishing a
// VESA pattern or an exact weight we have not measured would be worse than
// saying nothing: a customer would buy the wrong bracket on our word. Every
// page repeats that the correct mount is confirmed on site.
//
// PrimeTvNashville is an independent installation service. The brand and model
// names here identify what we install; we are not affiliated with, endorsed by
// or acting on behalf of any manufacturer.
// ─────────────────────────────────────────────────────────────────────────────

export const BASE = "https://www.primetvnashville.com"
export const PHONE_DISPLAY = "(615) 669-0251"
export const PHONE_HREF = "tel:+16156690251"

// Wording reused wherever a brand name appears in a heading, to keep the
// independent-service disclaimer consistent instead of retyped per page.
export const AFFILIATION_NOTE =
  "PrimeTvNashville is an independent TV mounting and installation company. We are not affiliated with, authorized by or endorsed by any television manufacturer. Brand and model names are used only to describe the equipment we install."

export const BRANDS = [
  {
    slug: "samsung",
    name: "Samsung",
    path: "/samsung-tv-mounting",
    // What actually changes about the install when the TV is this brand.
    angle:
      "Samsung spans the widest range we mount in Nashville: Crystal UHD panels that go up on a standard bracket, QLED sets that reward a tighter fit to the wall, and The Frame, which is a different job altogether.",
  },
  {
    slug: "hisense",
    name: "Hisense",
    path: "/hisense-tv-mounting",
    angle:
      "Hisense has become the value pick for big screens in Middle Tennessee. The U-series in particular sells in 75 and 85 inches at prices that put a very large, very heavy panel in living rooms that were not built for one.",
  },
  {
    slug: "tcl",
    name: "TCL",
    path: "/tcl-tv-mounting",
    angle:
      "TCL's QM line put Mini-LED backlighting into mainstream sizes, and the sets are physically deeper and heavier than the thin LED panels people picture when they think of a modern TV.",
  },
  {
    slug: "lg",
    name: "LG",
    path: "/lg-tv-mounting",
    angle:
      "LG covers both ends of what we handle: budget LED sets that hang like any other TV, and OLED panels that are thin enough to need a genuinely different set of hands on them.",
  },
]

export const getBrand = slug => BRANDS.find(b => b.slug === slug)

// ─────────────────────────────────────────────────────────────────────────────
// SERIES
//
// brand: "samsung" | "hisense" | "tcl" | "lg" | "other"
//   "other" covers Insignia, onn, Vizio, Roku and Toshiba — they appear on the
//   size pages only, since they have no brand page of their own.
// panel: the manufacturer's own marketing name for the panel line. Nothing is
//   inferred beyond what the series is actually sold as.
// priority: 1 = flagship best-sellers, 2 = volume sellers, 3 = premium.
// ─────────────────────────────────────────────────────────────────────────────
export const SERIES = [
  // ── SAMSUNG ────────────────────────────────────────────────────────────────
  {
    id: "samsung-u8000h",
    brand: "samsung",
    name: "Samsung Crystal UHD U8000H",
    short: "U8000H",
    panel: "Crystal UHD LED",
    sizes: [65, 75, 85],
    codes: { 75: "UN75U8000HFXZA" },
    priority: 1,
    note: "The volume seller. Thin enough that the bracket arms sit close to the panel edge, so we check arm reach against your stud spacing before drilling rather than after.",
  },
  {
    id: "samsung-u8000f",
    brand: "samsung",
    name: "Samsung U8000F",
    short: "U8000F",
    panel: "Crystal UHD LED",
    sizes: [75, 85],
    priority: 1,
    note: "Sold only in the two largest sizes, which makes it a two-technician job every time. The 85-inch is one of the heaviest panels we routinely hang on residential drywall.",
  },
  {
    id: "samsung-u7900",
    brand: "samsung",
    name: "Samsung U7900",
    short: "U7900",
    panel: "Crystal UHD LED",
    sizes: [65],
    priority: 1,
    note: "A 65-inch-only set and one of the easier Samsungs to mount. Straightforward on drywall with two studs; the usual complication is where the media box ends up, not the TV.",
  },
  {
    id: "samsung-qn80",
    brand: "samsung",
    name: "Samsung QN80F / QN80H",
    short: "QN80F / QN80H",
    panel: "QLED",
    sizes: [75, 85],
    priority: 3,
    note: "A premium panel on a premium wall, usually. These land above fireplaces and on stone features more often than the Crystal UHD sets, which changes both the anchor and the price.",
  },
  {
    id: "samsung-s90f",
    brand: "samsung",
    name: "Samsung S90F OLED",
    short: "S90F",
    panel: "OLED",
    sizes: [65],
    priority: 3,
    note: "An OLED, so it flexes. It is carried on edge by two people and never laid face-down. Worth a slim bracket — the thinness is the point of buying it.",
  },
  {
    id: "samsung-frame",
    brand: "samsung",
    name: "Samsung The Frame",
    short: "The Frame",
    panel: "QLED, matte finish",
    sizes: [65, 75, 85],
    priority: 3,
    quoteOnly: true,
    note: "Not a normal mount. It uses its own no-gap bracket, the One Connect box has to live somewhere, and the whole point is that no cable shows. Quoted individually.",
  },
  {
    id: "samsung-r85h",
    brand: "samsung",
    name: "Samsung R85H Micro RGB",
    short: "R85H Micro RGB",
    panel: "Micro RGB",
    sizes: [85],
    priority: 3,
    note: "85 inches of premium panel. Two technicians, minimum two studs, and a serious conversation about the wall before anything is opened.",
  },
  {
    id: "samsung-monitors",
    brand: "samsung",
    name: "Samsung M70H / M80H Smart Monitors",
    short: "M70H / M80H",
    panel: "Smart Monitor LED",
    sizes: [],
    priority: 3,
    note: "These are Samsung's Smart Monitor line rather than TVs, and they turn up in home offices and bedrooms. Light enough for a single stud or a solid-wall anchor, and we mount them the same way we mount a small TV.",
  },

  // ── HISENSE ────────────────────────────────────────────────────────────────
  {
    id: "hisense-u7",
    brand: "hisense",
    name: "Hisense U7",
    short: "U7",
    panel: "ULED Mini-LED",
    sizes: [65, 75, 85],
    codes: { 65: "65U7SG", 75: "75U7SG" },
    priority: 1,
    note: "Mini-LED backlighting makes the chassis deeper than a basic LED set. On a full-motion arm that extra depth shows when the TV is pushed flat, so we set the bracket depth with the panel actually on it.",
  },
  {
    id: "hisense-u6",
    brand: "hisense",
    name: "Hisense U6",
    short: "U6",
    panel: "ULED",
    sizes: [65, 75],
    priority: 1,
    note: "The easiest of the U-series to live with. A standard fixed or tilt bracket on two studs handles it, and the 65-inch is comfortably a one-technician install on drywall.",
  },
  {
    id: "hisense-u65-pro",
    brand: "hisense",
    name: "Hisense U65 Pro",
    short: "U65 Pro",
    panel: "ULED Mini-LED",
    sizes: [75, 85],
    priority: 1,
    note: "Large-format only. At 85 inches this is a two-technician lift with a heavy-duty bracket, and it is the size where we most often say no to a single-stud wall.",
  },
  {
    id: "hisense-r6",
    brand: "hisense",
    name: "Hisense R6 (Roku TV)",
    short: "R6",
    panel: "LED, Roku TV",
    sizes: [75],
    codes: { 75: "75R6E3" },
    priority: 2,
    note: "A lot of screen for the money, which is exactly why it ends up on walls that were never checked for studs. We check first.",
  },
  {
    id: "hisense-e6sr",
    brand: "hisense",
    name: "Hisense E6SR",
    short: "E6SR",
    panel: "LED",
    sizes: [65],
    codes: { 65: "65E6SR" },
    priority: 2,
    note: "A light, simple 65-inch panel. Fine on a tilt bracket in a bedroom or a rental, and quick to swap out later.",
  },
  {
    id: "hisense-e7",
    brand: "hisense",
    name: "Hisense E7",
    short: "E7",
    panel: "QLED",
    sizes: [65],
    codes: { 65: "65E7SF" },
    priority: 2,
    note: "The step up from the E6SR in picture without a meaningful change in how it hangs. Same bracket class, same install.",
  },

  // ── TCL ────────────────────────────────────────────────────────────────────
  {
    id: "tcl-qm6k",
    brand: "tcl",
    name: "TCL QM6K",
    short: "QM6K",
    panel: "QD-Mini LED",
    sizes: [65, 85],
    priority: 1,
    note: "Sold at the two ends of the range, and the two ends are different jobs. The 65-inch is routine; the 85-inch is a two-technician lift onto a wall we want to inspect first.",
  },
  {
    id: "tcl-qm7k",
    brand: "tcl",
    name: "TCL QM7K",
    short: "QM7K",
    panel: "QD-Mini LED",
    sizes: [75],
    priority: 1,
    note: "A 75-inch Mini-LED set with real depth to the chassis. If you want it close to the wall, the bracket choice matters more here than on a thin LED panel.",
  },
  {
    id: "tcl-qm5k",
    brand: "tcl",
    name: "TCL QM5K",
    short: "QM5K",
    panel: "QD-Mini LED",
    sizes: [85],
    priority: 1,
    note: "85-inch only. Two technicians, heavy-duty bracket, and a stud check before we commit to a height.",
  },
  {
    id: "tcl-qm9k",
    brand: "tcl",
    name: "TCL QM9K",
    short: "QM9K",
    panel: "QD-Mini LED",
    sizes: [85],
    priority: 3,
    note: "TCL's flagship at its largest size. Everything true of the QM5K applies, plus the panel is expensive enough that we would rather take the extra half hour on the bracket.",
  },
  {
    id: "tcl-q6lr",
    brand: "tcl",
    name: "TCL Q6LR",
    short: "Q6LR",
    panel: "QLED",
    sizes: [65],
    priority: 2,
    note: "A light 65-inch QLED. One of the quicker installs we do, and an easy candidate for a full-motion arm if you need to angle it into a kitchen.",
  },
  {
    id: "tcl-f7d",
    brand: "tcl",
    name: "TCL F7D",
    short: "F7D",
    panel: "LED",
    sizes: [65],
    codes: { 65: "65F7D" },
    priority: 2,
    note: "Entry-level and light. Goes up quickly on drywall with two studs; a good fit for a bedroom or a bonus room.",
  },

  // ── LG ─────────────────────────────────────────────────────────────────────
  {
    id: "lg-oled-c6",
    brand: "lg",
    name: "LG OLED C6",
    short: "OLED C6",
    panel: "OLED",
    sizes: [65, 77],
    codes: { 65: "OLED65C6PUA" },
    priority: 1,
    note: "The panel is thin and it flexes. Carried on edge, never face-down, and the flush bracket LG's own accessories assume is worth the upgrade — half the reason to buy a C-series is how little of it you see.",
  },
  {
    id: "lg-oled-c5",
    brand: "lg",
    name: "LG OLED C5",
    short: "OLED C5",
    panel: "OLED",
    sizes: [77],
    priority: 3,
    note: "At 77 inches an OLED is large, light for its size, and unforgiving of a bad grip. Two technicians, on edge, every time.",
  },
  {
    id: "lg-qned-75b",
    brand: "lg",
    name: "LG QNED 75B",
    short: "QNED 75B",
    panel: "QNED",
    sizes: [75],
    priority: 1,
    note: "A 75-inch QNED sits between the budget LED sets and the OLEDs in both weight and price. Two technicians, standard heavy-duty bracket, two studs.",
  },
  {
    id: "lg-nu700b",
    brand: "lg",
    name: "LG NU700B",
    short: "NU700B",
    panel: "LED",
    sizes: [75, 85],
    priority: 1,
    note: "LG's large-format value set. At 85 inches the price makes it tempting for a wall that cannot really take it, so the stud check is the first thing we do.",
  },
  {
    id: "lg-ua7050",
    brand: "lg",
    name: "LG UA7050",
    short: "UA7050",
    panel: "LED",
    sizes: [65],
    priority: 2,
    note: "A light 65-inch LED. Straightforward on drywall, and an easy one to put on a full-motion arm in a corner.",
  },

  // ── OTHER BRANDS (size pages only) ─────────────────────────────────────────
  {
    id: "roku-select",
    brand: "other",
    name: "Roku Select Series",
    short: "Roku Select",
    brandLabel: "Roku",
    panel: "LED",
    sizes: [65],
    priority: 2,
    note: "Inexpensive and light. A common second TV, and a common candidate for a bedroom tilt mount.",
  },
  {
    id: "toshiba-m450",
    brand: "other",
    name: "Toshiba M450",
    short: "M450",
    brandLabel: "Toshiba",
    panel: "QLED",
    sizes: [65],
    priority: 2,
    note: "A mid-range 65-inch. Nothing unusual about the install; a standard tilt or full-motion bracket on two studs.",
  },
  {
    id: "insignia-f50",
    brand: "other",
    name: "Insignia F50",
    short: "F50",
    brandLabel: "Insignia",
    panel: "LED, Fire TV",
    sizes: [65, 75, 85],
    priority: 2,
    note: "Sold in all three big sizes and priced low enough that the 85-inch surprises people with its weight. It weighs what any 85-inch panel weighs.",
  },
  {
    id: "insignia-qf",
    brand: "other",
    name: "Insignia QF",
    short: "QF",
    brandLabel: "Insignia",
    panel: "QLED, Fire TV",
    sizes: [75],
    priority: 2,
    note: "A 75-inch QLED at a budget price. Two technicians regardless of what it cost.",
  },
  {
    id: "onn-75s4v4",
    brand: "other",
    name: "onn. 75-inch",
    short: "onn. 75",
    brandLabel: "onn.",
    panel: "LED",
    sizes: [75],
    codes: { 75: "75S4V4" },
    priority: 2,
    note: "One of the cheapest routes to a 75-inch screen, and one of the most likely to be hung on a single stud by a previous owner. We re-anchor those.",
  },
  {
    id: "vizio-vqm75c",
    brand: "other",
    name: "Vizio Mini LED QLED 75-inch",
    short: "Vizio Mini LED QLED",
    brandLabel: "Vizio",
    panel: "Mini LED QLED",
    sizes: [75],
    codes: { 75: "VQM75C-10" },
    priority: 2,
    note: "Mini-LED depth in a 75-inch chassis. Same caution as the other Mini-LED sets: measure the gap you actually want before choosing the bracket.",
  },
]

export const getSeries = id => SERIES.find(s => s.id === id)

export const seriesForBrand = brand =>
  SERIES.filter(s => s.brand === brand).sort((a, b) => a.priority - b.priority)

export const seriesForSize = size =>
  SERIES.filter(s => s.sizes.includes(size)).sort((a, b) => a.priority - b.priority)

// The label to show for a model on a size page, where the brand is not implied
// by the page itself.
export const brandLabel = s =>
  s.brandLabel || BRANDS.find(b => b.slug === s.brand)?.name || ""

export const codeFor = (s, size) => s.codes?.[size] || null

// ─────────────────────────────────────────────────────────────────────────────
// SIZES
//
// What genuinely changes from 65 to 85 inches: how many people carry it, how
// much wall it needs, and how high it can sit before the room fights you.
// ─────────────────────────────────────────────────────────────────────────────
export const SIZES = [
  {
    inches: 65,
    path: "/65-inch-tv-mounting",
    weightTalk: "65-inch panels typically run in the 40 to 60 lb range",
    crew: "One technician can usually handle a 65-inch install on drywall, and we send two when the wall is masonry or the mount is going above a fireplace.",
    studs:
      "Two studs is the target. A 65-inch bracket usually spans a standard 16-inch stud spacing comfortably, which is why this is the size that most often goes up exactly where the customer wanted it.",
    height:
      "Centre of the screen at seated eye level — roughly 42 to 48 inches off the floor for most sofas. A 65-inch screen is short enough that this works in almost any room with an 8-foot ceiling.",
    fireplace:
      "The most forgiving size above a mantel. There is usually enough wall left above the firebox to keep the screen out of the heat plume and still land within a tolerable viewing angle.",
    lead:
      "65 inches is the size most Nashville living rooms settle on, and the one where the install almost always goes the way the customer pictured it.",
  },
  {
    inches: 75,
    path: "/75-inch-tv-mounting",
    weightTalk: "75-inch panels typically run in the 60 to 85 lb range",
    crew: "Two technicians. Not a recommendation — a 75-inch panel is wider than one person's arm span, and the way it gets damaged is someone trying to hold it and align the bracket at the same time.",
    studs:
      "Two studs minimum, and we want the bracket centred across them rather than clinging to one edge. On a 16-inch spacing a 75-inch bracket can reach three, which is better.",
    height:
      "Still centre-at-eye-level, but the screen is tall enough that the maths starts to bite. Keep the centre near 42 to 48 inches and the bottom edge can end up low over a console — we set the final height with your furniture in the room, not from a table.",
    fireplace:
      "Workable, but this is where fireplace installs start going wrong. Many mantels do not leave enough wall to get a 75-inch screen above the heat and below a neck-breaking angle at the same time. We measure before we quote.",
    lead:
      "75 inches is where a TV install stops being a one-person job and starts being a question about your wall.",
  },
  {
    inches: 85,
    path: "/85-inch-tv-mounting",
    weightTalk: "85-inch panels typically weigh 90 lbs or more",
    crew: "Two technicians, always. There is no version of an 85-inch install that one person should attempt, and we will not send one.",
    studs:
      "At least two studs, found and confirmed — not guessed at with a magnet. This is the size where a mount pulled out of drywall takes the drywall, the TV and sometimes the furniture underneath with it.",
    height:
      "The formula gives way to the room. Centre-at-eye-level on an 85-inch screen can put the bottom edge below a media console, so the honest answer is usually the lowest height the furniture allows. We sit down in your room and decide from there.",
    fireplace:
      "Often the wrong answer at this size. Above a typical mantel an 85-inch screen either sits in the heat or sits so high that the viewing angle ruins it. Sometimes the right advice is a different wall, and we will say so.",
    lead:
      "85 inches is the size where the wall, not the TV, decides what is possible.",
  },
]

export const getSize = inches => SIZES.find(s => s.inches === inches)

// ─────────────────────────────────────────────────────────────────────────────
// HOW-TO GUIDES — one blog article per priority-1 series, at its flagship size.
// The slug is also the MDX filename in content/blog/.
// ─────────────────────────────────────────────────────────────────────────────
export const HOW_TO_GUIDES = [
  { slug: "how-to-mount-samsung-u8000h-75-inch", seriesId: "samsung-u8000h", size: 75 },
  { slug: "how-to-mount-samsung-u8000f-75-inch", seriesId: "samsung-u8000f", size: 75 },
  { slug: "how-to-mount-hisense-u7-75-inch",     seriesId: "hisense-u7",     size: 75 },
  { slug: "how-to-mount-hisense-u6-65-inch",     seriesId: "hisense-u6",     size: 65 },
  { slug: "how-to-mount-tcl-qm6k-65-inch",       seriesId: "tcl-qm6k",       size: 65 },
  { slug: "how-to-mount-tcl-qm7k-75-inch",       seriesId: "tcl-qm7k",       size: 75 },
  { slug: "how-to-mount-tcl-qm5k-85-inch",       seriesId: "tcl-qm5k",       size: 85 },
  { slug: "how-to-mount-lg-qned-75b-75-inch",    seriesId: "lg-qned-75b",    size: 75 },
  { slug: "how-to-mount-lg-nu700b-75-inch",      seriesId: "lg-nu700b",      size: 75 },
  { slug: "how-to-mount-lg-oled-c6-65-inch",     seriesId: "lg-oled-c6",     size: 65 },
]

export const guidesForBrand = brand =>
  HOW_TO_GUIDES.filter(g => getSeries(g.seriesId)?.brand === brand)

export const guidesForSize = size => HOW_TO_GUIDES.filter(g => g.size === size)

export const guideFor = (seriesId, size) =>
  HOW_TO_GUIDES.find(g => g.seriesId === seriesId && (size == null || g.size === size))

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE AREA — the existing city pages, so every new page links into them
// and the labels stay in step with the footer.
// ─────────────────────────────────────────────────────────────────────────────
export const CITIES = [
  { label: "Nashville",      href: "/" },
  { label: "Brentwood",      href: "/tv-mounting-brentwood" },
  { label: "Franklin",       href: "/tv-mounting-franklin" },
  { label: "Murfreesboro",   href: "/tv-mounting-murfreesboro" },
  { label: "Hendersonville", href: "/tv-mounting-hendersonville" },
  { label: "Mount Juliet",   href: "/tv-mounting-mount-juliet" },
  { label: "Smyrna",         href: "/tv-mounting-smyrna" },
  { label: "Gallatin",       href: "/tv-mounting-gallatin" },
  { label: "Spring Hill",    href: "/tv-mounting-spring-hill" },
  { label: "Nolensville",    href: "/tv-mounting-nolensville" },
]

// ─────────────────────────────────────────────────────────────────────────────
// PRICING — mirrors PricingSection so no page invents a number. Every figure
// here is a starting price; PriceDisclaimer carries the full wording.
// ─────────────────────────────────────────────────────────────────────────────
export const PRICES = {
  upTo55:      "From $110 per TV",
  over55:      "From $140 per TV",
  cables:      "From $60 per TV",
  fireplace:   "From $25 extra",
  hardWall:    "From $25 for concrete, tile, stone or metal",
  twoUpTo55:   "From $199",
  twoOver55:   "From $260",
  warranty:    "30-day workmanship warranty",
}
