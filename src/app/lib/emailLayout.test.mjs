// The shared email shell and its plain-text conversion.
import { test } from "node:test"
import assert from "node:assert/strict"
import { htmlToText, esc, fmtDate, telHref, details, emailDocument, priceBox, buttons } from "./emailLayout.js"

test("plain text decodes typographic entities", () => {
  assert.equal(htmlToText("<p>We&rsquo;ve got it &mdash; &ldquo;thanks&rdquo;</p>"), "We\u2019ve got it \u2014 \u201cthanks\u201d")
})

test("plain text decodes numeric entities", () => {
  assert.equal(htmlToText("<p>Caf&#233; &#x2713;</p>"), "Caf\u00e9 \u2713")
})

test("a double-escaped entity is decoded only once", () => {
  // Someone typing "&lt;b&gt;" into a form must not come out as a real tag.
  assert.equal(htmlToText("<p>&amp;lt;b&amp;gt;</p>"), "&lt;b&gt;")
})

test("links keep their destination in plain text", () => {
  assert.equal(htmlToText('<a href="https://x.com/terms">Terms</a>'), "Terms (https://x.com/terms)")
  assert.equal(htmlToText('<a href="tel:+16155550123">(615) 555-0123</a>'), "(615) 555-0123")
})

test("the hidden preheader and styles stay out of the text part", () => {
  const html = emailDocument({ title: "T", preheader: "PREVIEW LINE", body: "<p>Body</p>" })
  const text = htmlToText(html)
  assert.ok(!text.includes("PREVIEW LINE"))
  assert.ok(!text.includes("@media"))
  assert.ok(text.includes("Body"))
})

test("customer input is escaped", () => {
  assert.equal(esc('<img src=x onerror="alert(1)">'), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;")
})

test("dates read like a person wrote them", () => {
  assert.equal(fmtDate("2026-10-15"), "Thursday, October 15, 2026")
  assert.equal(fmtDate(""), "")
  assert.equal(fmtDate("next week"), "next week", "free text passes through")
})

test("phone links need a full US number", () => {
  assert.equal(telHref("(615) 669-0251"), "tel:+16156690251")
  assert.equal(telHref("+1 615 669 0251"), "tel:+16156690251")
  assert.equal(telHref("555-01"), "")
})

test("empty detail rows are skipped", () => {
  const html = details([["Name", "Ada"], ["Phone", ""], ["ZIP", null]])
  assert.ok(html.includes("Ada"))
  assert.ok(!html.includes("Phone"))
  assert.equal(details([["Only", ""]]), "")
})

test("nothing uses CSS that email clients drop", () => {
  const html = emailDocument({ title: "T", body: priceBox({ label: "Price", amount: "$199" }) + buttons([{ href: "tel:+1", label: "Call" }, { href: "sms:+1", label: "Text" }]) })
  assert.ok(!/display:\s*(flex|grid)/i.test(html), "no flex or grid")
  assert.ok(!/calc\(/i.test(html), "no calc()")
  assert.ok(!/#[0-9a-f]{8}\b/i.test(html), "no 8-digit hex")
})
