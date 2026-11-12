// ─────────────────────────────────────────────────────────────────────────────
// BLACK FRIDAY — one switch and one set of numbers for the whole site.
//
//   BLACK_FRIDAY_ON   true  → the landing page, the pricing section, the top
//                             bar, the booking form and the booking emails show
//                             the Black Friday deals.
//                     false → everything goes back to the regular site.
//
// What the sale is:
//   • the three 2-TV bundles below, shown as "Black Friday Promo";
//   • 10% off any other service (anything booked that is not one of the
//     bundles). It isn't combined with coupon codes.
//
// The site only ANNOUNCES the 10%: every price shown stays the regular
// starting price, and the office takes the 10% off when it confirms the
// final price. Nothing here calculates a discounted figure.
//
// The bundle `label`s are stored with each booking and looked up in
// PROMO_PRICES (lib/clientEmail.js) — keep them the same in both places.
// No imports, so the browser, the server and the tests can all use it.
// ─────────────────────────────────────────────────────────────────────────────

export const BLACK_FRIDAY_ON = true

export const BF_DISCOUNT_PCT = 10
export const BF_COUPON_CODE = "BLACKFRIDAY10"
export const BF_COUPON_LABEL = `Black Friday — ${BF_DISCOUNT_PCT}% off your service`

export const BF_PROMOS = [
  {
    id: "2x55",
    label: '2 TVs up to 55"',
    title: "2 TVs, up to 55 inches max each",
    short: "2 TVs up to 55 inches max",
    amount: 199,
    image: "/images/black-friday/2-tvs-up-to-55-199.png",
    alt: "Black Friday offer from PrimeTV: 2 TVs up to 55 inches mounted for $199",
  },
  {
    id: "55-70",
    label: '1 TV up to 55" + 1 TV up to 70"',
    title: "1 TV up to 55 inches max + 1 TV up to 70 inches max",
    short: "1 TV up to 55 in + 1 TV up to 70 in max",
    amount: 230,
    image: "/images/black-friday/1-tv-55-plus-1-tv-70-230.png",
    alt: "Black Friday deal from PrimeTV: 1 TV up to 55 inches plus 1 TV up to 70 inches mounted for $230",
  },
  {
    id: "2x70",
    label: '2 TVs up to 70"',
    title: "2 TVs, up to 70 inches max each",
    short: "2 TVs up to 70 inches max",
    amount: 260,
    image: "/images/black-friday/2-tvs-up-to-70-260.png",
    alt: "Black Friday offer from PrimeTV: 2 TVs up to 70 inches mounted for $260",
  },
]

// What every Black Friday Promo is limited to. Shown wherever a promo is.
export const BF_PROMO_TERMS = ["Drywall walls only", "Not for TVs mounted over a fireplace"]
export const BF_PROMO_TERMS_LINE = "Black Friday Promos are for drywall walls only and are not for TVs mounted over a fireplace."

export const bfPromoById = id => BF_PROMOS.find(p => p.id === id) || null
export const bfBookHref = id => `/book?promo=${id}`


// Whether a booking gets the 10%: the sale is on, it is not one of the
// bundles, and no coupon code was used.
export function bfDiscountApplies({ bookingMode, couponCode, customQuote } = {}, on = BLACK_FRIDAY_ON) {
  return on && bookingMode !== "promo" && !customQuote && !String(couponCode || "").trim()
}
