import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import { BF_PROMOS, bfDiscountApplies, bfPromoById, BF_COUPON_CODE } from "./blackFriday.js"
import { PROMO_PRICES } from "./clientEmail.js"
import { validateCoupon } from "./coupons.js"

test("the 10% is for anything that isn't a promo, and never stacks with a coupon", () => {
  assert.equal(bfDiscountApplies({ bookingMode: "standard" }, true), true)
  assert.equal(bfDiscountApplies({ bookingMode: "homeinstall" }, true), true)
  assert.equal(bfDiscountApplies({ bookingMode: "bundle", couponCode: "" }, true), true)
  assert.equal(bfDiscountApplies({ bookingMode: "promo" }, true), false)
  assert.equal(bfDiscountApplies({ bookingMode: "standard", couponCode: "PRIMETV5" }, true), false)
  assert.equal(bfDiscountApplies({ bookingMode: "standard", customQuote: true }, true), false)
  assert.equal(bfDiscountApplies({ bookingMode: "standard" }, false), false)
})

test("every promo has its price in the emails, its artwork on disk and a booking link", () => {
  for (const p of BF_PROMOS) {
    assert.equal(PROMO_PRICES[p.label], `From $${p.amount}`, p.label)
    assert.ok(fs.existsSync(new URL(`../../../public${p.image}`, import.meta.url)), p.image)
    assert.ok(p.alt.includes(`$${p.amount}`))
    assert.equal(bfPromoById(p.id), p)
  }
  assert.equal(bfPromoById("nope"), null)
  assert.equal(validateCoupon(BF_COUPON_CODE)?.hideCodeFromClient, true)
})
