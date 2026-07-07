// ─────────────────────────────────────────────────────────────────────────────
// COUPON CODES — edit this file to manage all promo codes
//
// Fields:
//   offer   → what the client SEES when they apply the code (write anything you want)
//   note    → internal reminder for you (not shown to the client)
//   active  → true = working / false = disabled without deleting it
//
// The code key is always UPPERCASE — clients can type lowercase, it still works.
// ─────────────────────────────────────────────────────────────────────────────

export const COUPON_CODES = {

  BALUMVP: {
    offer:  "Special VIP deal — write your custom offer here",   // ← EDIT THIS LINE freely
    note:   "Personal code — customize the offer before sending",
    active: true,
  },

  "2POR199": {
    offer:         "Special deal — 2 TV installations for only $199",
    note:          "2 TVs mounted for $199, no size restriction",
    skipTvDetails: true,   // habilita campo de comentario, salta el paso de detalles de TV
    active:        true,
  },

  // Add more codes below as needed:
  // SUMMER25: {
  //   offer:  "Summer special — 25% off your installation",
  //   note:   "Summer 2026 campaign",
  //   active: false,
  // },

}

// Returns the coupon if valid and active, otherwise null
export function validateCoupon(code) {
  const match = COUPON_CODES[code?.trim().toUpperCase()]
  return match?.active ? match : null
}
