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

  MESSORID: {
    offer:              "Custom installation quote",
    note:               "Personal code — use to manually quote jobs that aren't in the standard form (custom TV size/qty/price, or a plain job comment + price)",
    customQuote:        true,   // reveals TV size+qty+price fields, or a comment-only+price mode
    hideCodeFromClient: true,   // client does NOT see "MESSORID" in their email, only the price/details
    active:             true,
  },

  "2POR199": {
    offer:         "Special deal — 2 TV installations for only $199",
    note:          "2 TVs mounted for $199, no size restriction",
    skipTvDetails: true,   // habilita campo de comentario, salta el paso de detalles de TV
    active:        true,
  },

  PRIMETV5: {
    offer:  "5% discount applied to your installation",
    note:   "5% off — general promo code",
    active: true,
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
