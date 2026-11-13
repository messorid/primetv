import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import { BF_PROMOS, bfPromoById, BF_COUPON_CODE, BF_CODE_LINE, isBfCode } from "./blackFriday.js"
import { PROMO_PRICES } from "./clientEmail.js"
import { validateCoupon } from "./coupons.js"

test("BLACKFRIDAY10 is a code the customer types, never applied on its own", () => {
  assert.equal(isBfCode(" blackfriday10 "), true)
  assert.equal(isBfCode(""), false)
  assert.equal(isBfCode("PRIMETV5"), false)
  const c = validateCoupon("blackfriday10")
  assert.ok(c && c.notWithPromo && !c.hideCodeFromClient)
  assert.equal(BF_CODE_LINE, "10% off with code BLACKFRIDAY10")
  const src = fs.readFileSync(new URL("../api/booking/route.js", import.meta.url), "utf8")
  assert.ok(!/body\.couponCode\s*=\s*BF_COUPON_CODE/.test(src), "the booking route must not add the code itself")
})

test("every promo has its price in the emails, its artwork on disk and a booking link", () => {
  for (const p of BF_PROMOS) {
    assert.equal(PROMO_PRICES[p.label], `From $${p.amount}`, p.label)
    assert.ok(fs.existsSync(new URL(`../../../public${p.image}`, import.meta.url)), p.image)
    assert.ok(p.alt.includes(`$${p.amount}`))
    assert.equal(bfPromoById(p.id), p)
    assert.match(p.title, /max/)
    assert.match(p.short, /max/)
  }
  assert.equal(bfPromoById("nope"), null)
  assert.ok(validateCoupon(BF_COUPON_CODE))
})
