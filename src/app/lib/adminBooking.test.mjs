// Bookings made from the admin panel: the customer's details are required, the
// customer's email carries the agreed total, and the crew's instructions never
// leave the crew.
import { test } from "node:test"
import assert from "node:assert/strict"

import { adminBookingFrom } from "./adminBooking.js"
import { buildClientEmail } from "./clientEmail.js"
import { buildInstallerJobEmail } from "./installerEmails.js"
import { installerJobAlert } from "./whatsappAlerts.js"
import { customersCsv } from "./customersCsv.js"
import { formatUsPhone } from "./usPhone.js"

const FORM = {
  firstName: "Ada", lastName: "Lovelace", phone: "615-555-0100", email: "ada@example.com",
  date: "2026-12-05", timePref: "10:00 AM",
  address: { street: "1 Main St", city: "Franklin", state: "TN", zip: "37064" },
  bookingMode: "standard", tvs: [{ size: '56" – 65"', wallType: "Drywall (standard)" }],
  cableConcealment: 1, jobTotal: "350",
  notes: "SECRET-CREW-NOTE: take down the old mount, gate code 4321",
}

// What the bookings API hands buildClientEmail and the installer email: the
// stored row, in each one's shape.
function stored(values) {
  const row = {
    first_name: values.firstName, last_name: values.lastName, phone: values.phone, email: values.email,
    date: values.date, time_pref: values.timePref, address: values.address,
    booking_mode: values.bookingMode, promo: values.promo, tvs: values.tvs,
    cable_concealment: values.cableConcealment, home_install_service: values.homeInstallService,
    notes: values.notes, job_total: values.jobTotal,
  }
  const camel = {
    firstName: row.first_name, lastName: row.last_name, email: row.email, phone: row.phone,
    date: row.date, timePreference: row.time_pref, address: row.address,
    bookingMode: row.booking_mode, selectedPromo: row.promo, tvs: row.tvs,
    cableConcealment: row.cable_concealment, homeInstallService: row.home_install_service,
    notes: row.notes, jobTotal: row.job_total,
  }
  return { row, camel }
}

test("the customer's details are all required, and named when missing", () => {
  const { error } = adminBookingFrom({ ...FORM, phone: "", email: " ", address: { street: "1 Main St" } })
  assert.equal(error, "Required: Phone, Email, City, State, ZIP")
  assert.match(adminBookingFrom({ ...FORM, email: "ada@" }).error, /email/)
})

test("the office can record explicit phone consent for a valid mobile number", () => {
  assert.equal(adminBookingFrom(FORM).values.reminderSmsChoice, "none")
  assert.match(adminBookingFrom({ ...FORM, reminderSmsChoice: "yes" }).error, /valid text reminder preference/)
  assert.match(adminBookingFrom({ ...FORM, phone: "615-155-0100", reminderSmsChoice: "phone" }).error, /valid US mobile/)
  const result = adminBookingFrom({ ...FORM, reminderSmsChoice: "phone" })
  assert.equal(result.values.reminderSmsChoice, "phone")
})

test("phones are US numbers of ten digits, shown as (615) 555-0100", () => {
  assert.equal(formatUsPhone("6155550100"), "(615) 555-0100")
  assert.equal(formatUsPhone("+1 615-555-0100"), "(615) 555-0100")
  assert.equal(formatUsPhone("61555501009999"), "(615) 555-0100", "no more than ten digits")
  assert.equal(formatUsPhone("615"), "(615")
  assert.equal(formatUsPhone("6155"), "(615) 5")
  assert.equal(formatUsPhone(""), "")

  assert.equal(adminBookingFrom(FORM).values.phone, "(615) 555-0100")
  assert.match(adminBookingFrom({ ...FORM, phone: "615-555" }).error, /10-digit/)
})

test("the total is read as dollars and refused when it isn't one", () => {
  assert.equal(adminBookingFrom({ ...FORM, jobTotal: "$1,250.5" }).values.jobTotal, 1250.5)
  assert.equal(adminBookingFrom({ ...FORM, jobTotal: "" }).values.jobTotal, null)
  assert.match(adminBookingFrom({ ...FORM, jobTotal: "abc" }).error, /total/)
})

test("each service keeps only its own fields", () => {
  const promo = adminBookingFrom({ ...FORM, bookingMode: "promo", promo: '2 TVs up to 55"' }).values
  assert.equal(promo.promo, '2 TVs up to 55"')
  assert.deepEqual(promo.tvs, [])

  const home = adminBookingFrom({ ...FORM, bookingMode: "homeinstall", homeInstallService: "gazebo" }).values
  assert.equal(home.homeInstallService, "gazebo")
  assert.equal(home.cableConcealment, 0, "no cable runs on a home installation")
})

test("the customer's email shows the total and never the crew's instructions", () => {
  const { camel } = stored(adminBookingFrom(FORM).values)
  const { html } = buildClientEmail(camel, { organizer: "info@example.com" })

  assert.match(html, /\$350\.00/)
  assert.ok(!html.includes("SECRET-CREW-NOTE"), "instructions leaked into the customer's email")
  assert.ok(!html.includes("4321"), "instructions leaked into the customer's email")
})

test("the installer gets the instructions and the total to collect", () => {
  const { row } = stored(adminBookingFrom(FORM).values)
  const { html } = buildInstallerJobEmail({ b: row, installerName: "Nelson" })
  assert.ok(html.includes("SECRET-CREW-NOTE"))
  assert.match(html, /Total to collect[\s\S]*\$350\.00/)

  const job = installerJobAlert(row)[3]
  assert.match(job, /💵 Collect \$350\.00/)
  assert.match(job, /📺 TV 1 \(56" – 65"\): Drywall \(standard\)/)
  assert.match(job, /🗒️ Office: SECRET-CREW-NOTE: take down the old mount, gate code 4321$/)
})

test("every confirmation warns that a return visit for something else is charged", () => {
  const { camel } = stored(adminBookingFrom(FORM).values)
  const { html } = buildClientEmail(camel)
  assert.match(html, /Return Visits/)
  assert.match(html, /additional return-visit fee will be charged/)
})

test("a booking without an agreed total reads as before", () => {
  const { camel } = stored(adminBookingFrom({ ...FORM, jobTotal: "" }).values)
  assert.ok(!buildClientEmail(camel).html.includes(">Total<"))
})

test("the customer download is name, phone and email, safe to open in Excel", () => {
  const csv = customersCsv([
    { name: 'Ana "AJ" Pérez', phone: "+58 412 206 1611", email: "ana@example.com" },
    { firstName: "Bo", lastName: "Li", phone: "615-555-0100", email: "=HYPERLINK(\"x\")" },
  ])
  assert.ok(csv.startsWith("﻿"), "Excel needs the BOM to read accents")
  const lines = csv.slice(1).trim().split("\r\n")
  assert.equal(lines[0], '"Name","Phone","Email"')
  assert.equal(lines[1], '"Ana ""AJ"" Pérez","+58 412 206 1611","ana@example.com"')
  assert.equal(lines[2], '"Bo Li","615-555-0100","\'=HYPERLINK(""x"")"')
})
