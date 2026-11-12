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
    title: "2 TVs up to 55 inches",
    amount: 199,
    image: "/images/black-friday/2-tvs-up-to-55-199.png",
    alt: "Black Friday offer from PrimeTV: 2 TVs up to 55 inches mounted for $199",
  },
  {
    id: "55-70",
    label: '1 TV up to 55" + 1 TV up to 70"',
    title: "1 TV up to 55 inches + 1 TV up to 70 inches",
    amount: 230,
    image: "/images/black-friday/1-tv-55-plus-1-tv-70-230.png",
    alt: "Black Friday deal from PrimeTV: 1 TV up to 55 inches plus 1 TV up to 70 inches mounted for $230",
  },
  {
    id: "2x70",
    label: '2 TVs up to 70"',
    title: "2 TVs up to 70 inches",
    amount: 260,
    image: "/images/black-friday/2-tvs-up-to-70-260.png",
    alt: "Black Friday offer from PrimeTV: 2 TVs up to 70 inches mounted for $260",
  },
]

export const bfPromoById = id => BF_PROMOS.find(p => p.id === id) || null
export const bfBookHref = id => `/book?promo=${id}`

// A regular price with the Black Friday discount, in whole dollars when it
// comes out even ($110 → $99) and with cents when it doesn't.
export function bfPrice(amount, on = BLACK_FRIDAY_ON) {
  const n = Number(amount)
  if (!on || !Number.isFinite(n)) return n
  return Math.round(n * (100 - BF_DISCOUNT_PCT)) / 100
}
export const money = n => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`)

// Whether a booking gets the 10%: the sale is on, it is not one of the
// bundles, and no coupon code was used.
export function bfDiscountApplies({ bookingMode, couponCode, customQuote } = {}, on = BLACK_FRIDAY_ON) {
  return on && bookingMode !== "promo" && !customQuote && !String(couponCode || "").trim()
}
