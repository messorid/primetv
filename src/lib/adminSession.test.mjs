import { test } from "node:test"
import assert from "node:assert/strict"

process.env.ADMIN_SESSION_SECRET = "test-secret-for-sessions"
const { createSessionToken, verifySessionToken, isOwnerOnlyPage } = await import("./adminSession.js")
const { hashPassword, verifyPassword, passwordProblem, whatsappDigits } = await import("../app/lib/staff.js")

test("tokens carry the role, and the owner is the default", async () => {
  const owner = await verifySessionToken(await createSessionToken())
  assert.equal(owner.role, "admin")
  const seller = await verifySessionToken(await createSessionToken({ role: "seller", uid: "abc-123" }))
  assert.deepEqual([seller.role, seller.uid], ["seller", "abc-123"])
})

test("a seller can't turn their token into the owner's", async () => {
  const t = await createSessionToken({ role: "seller", uid: "abc" })
  const parts = t.split(".")
  assert.equal(await verifySessionToken([parts[0], "admin", parts[2], parts[3]].join(".")), null)
  assert.equal(await verifySessionToken([parts[0], parts[3]].join(".")), null) // dropping the role
  assert.equal(await verifySessionToken([String(Date.now() + 9e9), parts[1], parts[2], parts[3]].join(".")), null) // longer expiry
})

test("expired, unknown-role and malformed tokens are refused", async () => {
  assert.equal(await verifySessionToken(await createSessionToken({ role: "seller" }, -1000)), null)
  assert.equal(await createSessionToken({ role: "superuser" }), null)
  for (const t of [undefined, "", "abc", "1.2.3", "1.2.3.4.5"]) assert.equal(await verifySessionToken(t), null)
})

test("owner-only pages", () => {
  for (const p of ["/admin/earnings", "/admin/insights", "/admin/reporte", "/admin/installers", "/admin/team", "/admin/earnings/x"]) assert.ok(isOwnerOnlyPage(p), p)
  for (const p of ["/admin/today", "/admin/bookings", "/admin/customers", "/admin/messages", "/admin/teams"]) assert.ok(!isOwnerOnlyPage(p), p)
})

test("passwords are stored hashed and checked exactly", async () => {
  const h = await hashPassword("Barinas10")
  assert.match(h, /^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/)
  assert.ok(!h.includes("Barinas10"))
  assert.notEqual(h, await hashPassword("Barinas10")) // salted
  assert.equal(await verifyPassword("Barinas10", h), true)
  assert.equal(await verifyPassword("barinas10", h), false)
  assert.equal(await verifyPassword("Barinas10", "not-a-hash"), false)
  assert.ok(passwordProblem("short"))
  assert.equal(passwordProblem("Barinas10"), null)
  assert.equal(whatsappDigits("+58 424-5526181"), "584245526181")
})
