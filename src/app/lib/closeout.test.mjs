import { test } from "node:test"
import assert from "node:assert/strict"
import {
  validateSignoff, parseTip, workItemsOf, publicView, isToken, newToken, decodeDataUrl, MAX_TIP,
} from "./closeout.js"
import {
  buildReviewRequestEmail, buildCloseoutSignedEmail, buildCloseoutLinkEmail, GOOGLE_REVIEW_URL,
} from "./closeoutEmails.js"
import { buildInstallerJobEmail } from "./installerEmails.js"

const SIG = "data:image/png;base64," + "A".repeat(400)
const good = { signerName: "Ada Lovelace", confirmed: true, signature: SIG, tip: "20", tipMethod: "Cash", notes: "" }

test("a complete sign-off passes and is normalised", () => {
  const r = validateSignoff({ ...good, signerName: "  Ada   Lovelace " })
  assert.equal(r.ok, true)
  assert.equal(r.value.signerName, "Ada Lovelace")
  assert.equal(r.value.tip, 20)
  assert.equal(r.value.tipMethod, "Cash")
})

test("no tip needs no payment method, and stores none", () => {
  const r = validateSignoff({ ...good, tip: "0", tipMethod: "Zelle" })
  assert.equal(r.ok, true)
  assert.equal(r.value.tip, 0)
  assert.equal(r.value.tipMethod, null)
})

test("each missing part is reported against its own field", () => {
  const r = validateSignoff({ signerName: "A", confirmed: false, signature: null, tip: "15" })
  assert.equal(r.ok, false)
  assert.deepEqual(Object.keys(r.errors).sort(), ["confirmed", "signature", "signerName", "tipMethod"])
})

test("only a real PNG signature is accepted", () => {
  assert.ok(validateSignoff({ ...good, signature: "data:image/jpeg;base64," + "A".repeat(400) }).errors.signature)
  assert.ok(validateSignoff({ ...good, signature: "data:image/png;base64,AAAA" }).errors.signature)
  assert.ok(validateSignoff({ ...good, signature: "data:image/png;base64," + "A".repeat(600_000) }).errors.signature)
})

test("tips: dollars and cents up to the cap; nothing else", () => {
  assert.equal(parseTip(""), 0)
  assert.equal(parseTip("$12.50"), 12.5)
  assert.equal(parseTip(String(MAX_TIP)), MAX_TIP)
  for (const bad of ["-5", "1e3", "12.345", "abc", String(MAX_TIP + 1)]) assert.equal(parseTip(bad), null, bad)
})

test("the work list reads like the job, whatever the size format", () => {
  const items = workItemsOf({
    tvs: [{ size: "65", wallType: "Drywall (standard)" }, { size: '43" – 55"', model: "frame", wallType: "Brick" }],
    cable_concealment: 1,
  })
  assert.deepEqual(items, [
    'TV 1: 65" TV mounted on drywall',
    'TV 2: 43" – 55" Frame TV mounted on brick',
    "In-wall cable concealment × 1",
  ])
  assert.deepEqual(workItemsOf({ booking_mode: "homeinstall", home_install_service: "furniture" }), ["Furniture Assembly"])
  assert.deepEqual(workItemsOf({}), ["Installation service"])
})

test("the public view leaves out contact details", () => {
  const v = publicView({
    closeout: { token: newToken(), signed_at: null, work_items: null },
    booking: { first_name: "Ada", last_name: "L", email: "a@b.co", phone: "6155550100", address: { street: "1 Main" }, date: "2026-10-08" },
    photoIds: ["p1"],
  }, ["Nelson"])
  const text = JSON.stringify(v)
  assert.ok(!text.includes("a@b.co") && !text.includes("6155550100") && !text.includes("1 Main"))
  assert.equal(v.customerName, "Ada L")
  assert.equal(v.photos[0].url, `/api/job/${v.token}/photos/p1`)
})

test("tokens are long, URL-safe and checked", () => {
  const t = newToken()
  assert.equal(t.length, 24)
  assert.ok(isToken(t))
  assert.ok(!isToken("short"))
  assert.ok(!isToken("../../etc/passwd-xxxxxxxxxxxx"))
})

test("only image data URLs decode", () => {
  assert.equal(decodeDataUrl("data:image/png;base64,iVBORw0KGgo=").mime, "image/png")
  assert.equal(decodeDataUrl("data:text/html;base64,PGI+"), null)
})

test("review request carries the message and the Google link", () => {
  const { subject, html } = buildReviewRequestEmail({ first_name: "Ada", date: "2026-10-08" })
  assert.match(subject, /Ada/)
  assert.ok(html.includes(GOOGLE_REVIEW_URL))
  assert.ok(html.includes("we would be grateful if you could leave us a quick Google review"))
  assert.ok(html.includes("Your feedback helps our small business grow."))
})

test("names are escaped in the review and closeout emails", () => {
  const b = { first_name: "<script>x</script>", last_name: "", date: "2026-10-08" }
  assert.ok(!buildReviewRequestEmail(b).html.includes("<script>x"))
  const view = { workItems: ["<b>TV</b>"], installers: [], signed: { name: "<i>A</i>", at: "2026-10-08T15:00:00Z", tip: 0, notes: "" } }
  const office = buildCloseoutSignedEmail({ b, view, signatureCid: "sig", photoCids: [] }).html
  assert.ok(!office.includes("<b>TV</b>") && !office.includes("<i>A</i>"))
  assert.ok(!buildCloseoutLinkEmail({ b, installerName: "<u>N</u>", url: "https://x/job/abc" }).html.includes("<u>N</u>"))
})

test("the work order includes the closeout link only when there is one", () => {
  const b = { first_name: "Ada", last_name: "L", date: "2026-10-08", tvs: [] }
  const url = "https://www.primetvnashville.com/job/abcdefghijklmnopqrstuvwx"
  assert.ok(buildInstallerJobEmail({ b, installerName: "Nelson", closeoutUrl: url }).html.includes(url))
  assert.ok(!buildInstallerJobEmail({ b, installerName: "Nelson" }).html.includes("/job/"))
})
