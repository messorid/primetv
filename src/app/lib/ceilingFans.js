// ─────────────────────────────────────────────────────────────────────────────
// CEILING FANS — the data behind the hub page and one landing page per type.
//
// Deliberately conservative about specs. No blade spans, no weights, no CFM, no
// downrod lengths. Those change between model years, and a wrong number on our
// own site would send someone to buy the wrong part on our word. Everything
// here is either about the installation itself or a retail fact that is easy to
// verify (which store carries the brand), never a spec we have not measured.
//
// The one number that matters is the electrical boundary, and it is spelled out
// on every page: we replace and install fans where a fan-rated box and switched
// power already exist, and we upgrade a light-fixture box to a fan-rated brace.
// Running a new circuit is licensed electrician work and we say so rather than
// taking the job.
//
// To add a type: append to FAN_TYPES. The hub, the dynamic route and the
// sitemap all read from this list.
// ─────────────────────────────────────────────────────────────────────────────

export const BASE = "https://www.primetvnashville.com"
export const HUB = "/ceiling-fan-installation-nashville"

export const FAN_AFFILIATION_NOTE =
  "PrimeTvNashville is an independent installation company. We are not affiliated with, authorized by or endorsed by Hunter, Hampton Bay, Home Decorators Collection, Harbor Breeze, Casablanca, Minka-Aire, Fanimation, Emerson, Westinghouse, Big Ass Fans or Amico. Brand names are used only to describe the equipment we install. We are not licensed electrical contractors; work that requires a new circuit is referred to a licensed electrician."

// The sentence that keeps every page honest about scope.
export const ELECTRICAL_SCOPE =
  "We replace and install ceiling fans where there is already a ceiling box with switched power at the spot, and we swap a standard light-fixture box for a fan-rated brace box when that is what is holding you up. If the spot has no wiring at all, or the job needs a new circuit or a new switch leg, that is licensed electrician work — we will tell you before we quote rather than after we arrive."

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — one landing page each.
// ─────────────────────────────────────────────────────────────────────────────
export const FAN_TYPES = [
  {
    slug: "standard-ceiling-fan",
    title: "Standard Ceiling Fan Installation Nashville | PrimeTV",
    desc: "Standard ceiling fan installation in Nashville TN. We check the box is fan-rated before anything goes up, then hang it level and wobble-free.",
    name: "Standard Ceiling Fan",
    short: "Standard",
    emoji: "🌀",
    // What the page is really about, in one line.
    lead: "The ordinary bedroom-and-living-room fan, and the one most often found hanging off a box that was never meant to hold it.",
    // The specific thing that goes wrong with this type.
    crux: "box-rating",
    time: "Usually 1 to 2 hours for a straight replacement",
    blurb:
      "A pull-chain or wall-switched fan with no light kit and no remote. The simplest install we do, and the one where the box underneath matters most.",
  },
  {
    slug: "ceiling-fan-with-led-light",
    title: "Ceiling Fan with LED Light Installation | Nashville",
    desc: "Ceiling fan with LED light installation in Nashville TN. Fan and light wired the way you actually want to control them, from one wall switch or two.",
    name: "Ceiling Fan with LED Light",
    short: "LED light",
    emoji: "💡",
    lead: "A fan and a ceiling light in one fitting, which means two things to control and often only one switch in the wall.",
    crux: "switching",
    time: "Usually 1.5 to 2.5 hours",
    blurb:
      "An integrated LED light kit, bright enough to be the room's main light. The install question is almost always how you want to control the fan and the light separately.",
  },
  {
    slug: "remote-control-ceiling-fan",
    title: "Remote Control Ceiling Fan Installation Nashville TN",
    desc: "Remote control ceiling fan installation in Nashville TN. Receiver fitted in the canopy and paired properly, so only your remote runs your fan.",
    name: "Remote Control Ceiling Fan",
    short: "Remote",
    emoji: "🎛️",
    lead: "A handheld or wall remote, a receiver squeezed into the canopy, and a pairing step that is skipped more often than any other.",
    crux: "receiver",
    time: "Usually 1.5 to 2.5 hours",
    blurb:
      "Speed, direction and light from a remote instead of a chain. The receiver has to fit in the canopy and be paired properly, or you end up with a fan your neighbour's remote can also control.",
  },
  {
    slug: "low-profile-ceiling-fan",
    title: "Low Profile & Flush Mount Fan Install | Nashville TN",
    desc: "Low profile flush mount ceiling fan installation in Nashville TN. The right fan for an eight-foot ceiling, hung with proper blade clearance.",
    name: "Low Profile / Flush Mount Ceiling Fan",
    short: "Low profile",
    emoji: "📏",
    lead: "A hugger fan for a low ceiling, where the rule is about the gap between the blades and your head, not the look.",
    crux: "clearance",
    time: "Usually 1.5 to 2.5 hours",
    blurb:
      "Mounts flush to the ceiling with no downrod. The right answer for an eight-foot ceiling, a basement or a converted attic, and the wrong answer almost everywhere else.",
  },
  {
    slug: "outdoor-ceiling-fan",
    title: "Outdoor & Porch Ceiling Fan Installation Nashville",
    desc: "Outdoor and porch ceiling fan installation in Nashville TN. Damp and wet rated fans for covered patios, sunrooms, screened decks and open porches.",
    name: "Outdoor & Porch Ceiling Fan",
    short: "Outdoor",
    emoji: "🏡",
    lead: "A covered porch in Nashville humidity is a different environment from a bedroom, and an indoor fan put out there will not last.",
    crux: "rating",
    time: "Usually 2 to 3 hours",
    blurb:
      "Damp or wet rated fans for covered porches, patios, sunrooms and screened decks. The rating on the box is the whole decision, and it is the thing customers most often get wrong.",
  },
  {
    slug: "smart-wifi-ceiling-fan",
    title: "Smart WiFi Ceiling Fan Installation | Nashville TN",
    desc: "Smart WiFi ceiling fan installation in Nashville TN. Hung, connected to your home network and answering to Alexa or Google before our crew leaves.",
    name: "Smart WiFi Ceiling Fan",
    short: "Smart WiFi",
    emoji: "📱",
    lead: "The mounting is ordinary. The part people actually want help with is the app, the account and getting it to answer to Alexa or Google.",
    crux: "setup",
    time: "Usually 2 to 3 hours including setup",
    blurb:
      "App control, schedules and voice assistants. We hang it, then stay to connect it to your WiFi and hand it over working, not just spinning.",
  },
  {
    slug: "high-ceiling-fan-installation",
    title: "Ceiling Fan Installation for High Ceilings | Nashville",
    desc: "High ceiling fan installation in Nashville TN. Vaulted ceilings, great rooms and stairwell landings, with the right downrod and real access gear.",
    name: "High Ceiling Fan Installation",
    short: "High ceilings",
    emoji: "🪜",
    lead: "Vaulted ceilings, two-storey great rooms and stairwell landings — where the downrod length and the ladder are the whole job.",
    crux: "downrod",
    time: "Usually 2 to 4 hours",
    blurb:
      "Downrod extensions, sloped-ceiling adapters and the access equipment to reach a ceiling that a step ladder will not. Quoted after we see the height.",
  },
]

export const getFanType = slug => FAN_TYPES.find(t => t.slug === slug)

export const otherFanTypes = slug => FAN_TYPES.filter(t => t.slug !== slug)

// ─────────────────────────────────────────────────────────────────────────────
// BRANDS
//
// `where` is a retail fact, not a spec, and it is the single most useful thing
// we can tell a customer: it predicts what is in the box and how easy a
// replacement part will be to find two years from now.
// ─────────────────────────────────────────────────────────────────────────────
export const FAN_BRANDS = [
  {
    name: "Hunter",
    where: "Home Depot, Lowe's and online",
    note: "One of the oldest names in American ceiling fans and the one we see most in Middle Tennessee. Parts and replacement remotes are easy to find years later, which matters more than people expect.",
  },
  {
    name: "Hampton Bay",
    where: "Home Depot house brand",
    note: "Sold only through Home Depot, which is both the strength and the catch: priced to move, but a replacement part means going back to the same retailer rather than any hardware store.",
  },
  {
    name: "Home Decorators Collection",
    where: "Home Depot house brand",
    note: "Home Depot's more design-led fan line. They install exactly like a Hampton Bay — same reasoning about parts applies.",
  },
  {
    name: "Harbor Breeze",
    where: "Lowe's house brand",
    note: "Lowe's answer to Hampton Bay, and just as common in Nashville homes. Keep the manual: the remote pairing sequence varies between models and is hard to find online later.",
  },
  {
    name: "Casablanca",
    where: "Lighting showrooms and online",
    note: "The premium line under the Hunter umbrella. Heavier, better finished, and worth the extra care at the canopy — this is not a fan to hang off a questionable box.",
  },
  {
    name: "Minka-Aire",
    where: "Lighting showrooms and online",
    note: "Design-forward fans that often turn up in renovations and new builds. Frequently remote-only with no pull chains, so the receiver and pairing step is not optional.",
  },
  {
    name: "Fanimation",
    where: "Lighting showrooms and online",
    note: "Specialty and statement fans, including large-diameter and unusual blade designs. Worth sending us the model before you buy if the ceiling is sloped or very high.",
  },
  {
    name: "Emerson",
    where: "Online and specialty retailers",
    note: "A long-established fan name still widely sold. Solid, conventional installs; older Emerson units we take down are often heavier than their replacement.",
  },
  {
    name: "Westinghouse",
    where: "Online and hardware retailers",
    note: "Broad, affordable range covering most of the types on this page. Straightforward to hang, and light enough that the existing box is usually the only question.",
  },
  {
    name: "Big Ass Fans (Haiku)",
    where: "Direct from the manufacturer",
    note: "The Haiku residential line is premium, app-controlled and larger than a typical fan. These deserve a proper look at the mounting point and the ceiling height before anything is ordered.",
  },
  {
    name: "Amico",
    where: "Mostly Amazon",
    note: "Budget fans bought online, usually flush-mount or low profile. They go up fine; the thing to check is that the box up there is fan-rated, because the price tag tempts people to skip that.",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE AREA — mirrors the TV pages so the footprint never drifts.
// ─────────────────────────────────────────────────────────────────────────────
export { CITIES } from "./tvModels.js"
