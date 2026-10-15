import { test } from "node:test"
import assert from "node:assert/strict"
import { businessToday, shiftDay, crewPageUrl } from "./crewPortal.js"
import { buildInstallerJobEmail, buildCrewPageEmail } from "./installerEmails.js"

test("today is Nashville's date, not UTC's", () => {
  // 03:30 UTC on Oct 16 is still the evening of Oct 15 in Nashville.
  assert.equal(businessToday(new Date("2026-10-16T03:30:00Z")), "2026-10-15")
  assert.equal(businessToday(new Date("2026-10-16T15:00:00Z")), "2026-10-16")
})

test("days shift across month ends", () => {
  assert.equal(shiftDay("2026-10-31", 1), "2026-11-01")
  assert.equal(shiftDay("2026-03-01", -1), "2026-02-28")
})

test("the crew page link points at the live site", () => {
  assert.equal(crewPageUrl("abc"), "https://www.primetvnashville.com/crew/abc")
})

test("the work order links the installer's jobs page only when there is one", () => {
  const b = { first_name: "Ada", last_name: "L", date: "2026-10-08", tvs: [] }
  const url = "https://www.primetvnashville.com/crew/abcdefghijklmnopqrstuvwx"
  assert.ok(buildInstallerJobEmail({ b, installerName: "Nelson", crewPageUrl: url }).html.includes(url))
  assert.ok(!buildInstallerJobEmail({ b, installerName: "Nelson" }).html.includes("/crew/"))
})

test("the jobs page email escapes the name and carries the link", () => {
  const { html } = buildCrewPageEmail({ installerName: "<b>N</b>", url: "https://x/crew/t" })
  assert.ok(!html.includes("<b>N</b>"))
  assert.ok(html.includes("https://x/crew/t"))
})
