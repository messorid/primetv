// Add or remove promo codes here.
// code: always UPPERCASE — users can type lowercase, it gets normalized before matching
// label: shown to the user when the code is applied
// description: internal note (not shown to user)
// active: set to false to disable without deleting

export const COUPON_CODES = {
  BALUMVP: {
    label: 'Special deal — TV mounting (up to 55") for only $99',
    description: "$99 install for TVs up to 55 inches",
    active: true,
  },
}

// Returns the coupon object if valid and active, otherwise null
export function validateCoupon(code) {
  const match = COUPON_CODES[code?.trim().toUpperCase()]
  return match?.active ? match : null
}
