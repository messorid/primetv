// The owner's WhatsApp alerts: what each one says, and that the sender never
// sends half-configured, never throws, and never hands Meta a variable it will
// refuse.
import { test, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"

import { notifyWhatsApp, canSendWhatsApp, recipients, templateParam } from "./whatsapp.js"
import { bookingAlert, quoteAlert, assignmentAlert, when } from "./whatsappAlerts.js"

const ENV_KEYS = [
  "WHATSAPP_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_NOTIFY_TO",
  "WHATSAPP_TEMPLATE", "WHATSAPP_TEMPLATE_LANG", "WHATSAPP_API_VERSION",
]
const realFetch = globalThis.fetch
let calls = []
let reply = () => new Response("{}", { status: 200 })

beforeEach(() => {
  for (const k of ENV_KEYS) delete process.env[k]
  process.env.WHATSAPP_TOKEN = "wa-token"
  process.env.WHATSAPP_PHONE_NUMBER_ID = "1234567890"
  process.env.WHATSAPP_NOTIFY_TO = "584122061611"
  calls = []
  reply = () => new Response("{}", { status: 200 })
  globalThis.fetch = async (url, opts) => {
    calls.push({ url, headers: opts.headers, body: JSON.parse(opts.body) })
    return reply()
  }
})

afterEach(() => {
  for (const k of ENV_KEYS) delete process.env[k]
  globalThis.fetch = realFetch
})

const ALERT = { kind: "Nueva reservación", customer: "Ada Lovelace · 615-555-0100", details: "📅 dom, 25 oct" }

/* Sending */

test("an alert is sent as the approved template, to the configured number", async () => {
  assert.equal(await notifyWhatsApp(ALERT), true)

  assert.equal(calls.length, 1)
  const { url, headers, body } = calls[0]
  assert.equal(url, "https://graph.facebook.com/v23.0/1234567890/messages")
  assert.equal(headers.Authorization, "Bearer wa-token")
  assert.equal(body.messaging_product, "whatsapp")
  assert.equal(body.to, "584122061611")
  assert.equal(body.type, "template")
  assert.equal(body.template.name, "primetv_alerta")
  assert.deepEqual(body.template.language, { code: "es" })
  assert.deepEqual(body.template.components, [{
    type: "body",
    parameters: [
      { type: "text", text: ALERT.kind },
      { type: "text", text: ALERT.customer },
      { type: "text", text: ALERT.details },
    ],
  }])
})

test("template, language and API version can be changed without a deploy", async () => {
  process.env.WHATSAPP_TEMPLATE = "otra_plantilla"
  process.env.WHATSAPP_TEMPLATE_LANG = "es_MX"
  process.env.WHATSAPP_API_VERSION = "v24.0"
  await notifyWhatsApp(ALERT)

  assert.match(calls[0].url, /\/v24\.0\//)
  assert.equal(calls[0].body.template.name, "otra_plantilla")
  assert.equal(calls[0].body.template.language.code, "es_MX")
})

test("every number in the list gets its own message", async () => {
  process.env.WHATSAPP_NOTIFY_TO = "+58 412-2061611, +1 (615) 555-0100"
  await notifyWhatsApp(ALERT)

  assert.deepEqual(calls.map(c => c.body.to).sort(), ["16155550100", "584122061611"])
})

test("nothing is sent until the token, the number id and a recipient are all set", async () => {
  for (const key of ["WHATSAPP_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_NOTIFY_TO"]) {
    const saved = process.env[key]
    delete process.env[key]
    assert.equal(canSendWhatsApp(), false, `${key} missing`)
    assert.equal(await notifyWhatsApp(ALERT), false)
    process.env[key] = saved
  }
  assert.equal(calls.length, 0)
})

test("a refusal from Meta is reported as false, not thrown", async () => {
  reply = () => new Response(JSON.stringify({ error: { code: 132001, message: "Template name does not exist" } }), { status: 400 })
  assert.equal(await notifyWhatsApp(ALERT), false)
})

test("a network failure is reported as false, not thrown", async () => {
  globalThis.fetch = async () => { throw new Error("ECONNRESET") }
  assert.equal(await notifyWhatsApp(ALERT), false)
})

/* Template variables */

test("recipients are reduced to digits", () => {
  process.env.WHATSAPP_NOTIFY_TO = " +58 (412) 206-1611 ,, "
  assert.deepEqual(recipients(), ["584122061611"])
})

test("a variable never carries what Meta refuses", () => {
  assert.equal(templateParam("two fans\nliving room\r\n\tupstairs"), "two fans · living room · upstairs")
  assert.equal(templateParam("lots      of     space"), "lots of space")
  assert.equal(templateParam(""), "—")
  assert.equal(templateParam(null), "—")
  assert.equal(templateParam("   \n  "), "—")
})

test("a long variable is cut short", () => {
  const out = templateParam("x".repeat(1000))
  assert.equal(out.length, 300)
  assert.ok(out.endsWith("…"))
})

/* What each alert says */

test("dates read in Spanish, with the time beside them", () => {
  assert.match(when("2026-10-25", "Morning"), /^dom\.?, 25 oct\.? \(Morning\)$/)
  assert.equal(when("", "Flexible"), "Flexible")
  assert.equal(when("next week", ""), "next week")
})

test("a booking alert names the customer, the day, the job and the address", () => {
  const a = bookingAlert({
    date: "2026-10-25", timePreference: "Morning",
    bookingMode: "standard",
    tvs: [{ size: "65" }, { size: "55\"", model: "frame" }],
    cableConcealment: 2, couponCode: "PRIMETV5",
    address: { street: "1 Main St", city: "Franklin", state: "TN", zip: "37064" },
    info: { firstName: "Ada", lastName: "Lovelace", phone: "615-555-0100" },
  })

  assert.equal(a.kind, "Nueva reservación")
  assert.equal(a.customer, "Ada Lovelace · 615-555-0100")
  assert.match(a.details, /📅 dom\.?, 25 oct\.? \(Morning\)/)
  assert.match(a.details, /🛠 2 TVs: 65", 55" Frame \+ Ocultar cables ×2 \+ Cupón PRIMETV5/)
  assert.match(a.details, /📍 1 Main St, Franklin, TN, 37064$/)
})

test("a promo booking shows the package and its price", () => {
  const a = bookingAlert({ bookingMode: "promo", selectedPromo: '2 TVs up to 70"', info: {} })
  assert.match(a.details, /Promo 2 TVs up to 70" \(From \$260\)/)
})

test("a home installation shows the service by name", () => {
  const a = bookingAlert({ bookingMode: "homeinstall", homeInstallService: "ceiling_fan", info: {} })
  assert.match(a.details, /🛠 Ceiling Fan Installation/)
})

test("a custom-quote booking shows its size and price", () => {
  const a = bookingAlert({
    customQuote: true, customMode: "sized", customTvSize: "85", customTvQty: 2, customPrice: "350",
    info: {},
  })
  assert.match(a.details, /Trabajo especial 85" × 2/)
  assert.match(a.details, /Precio especial \$350\.00/)
})

test("a booking the database refused says so", () => {
  const a = bookingAlert({ info: { firstName: "Ada" } }, { saved: false })
  assert.match(a.kind, /NO se guardó/)
})

test("each quote form is named for what it is", () => {
  assert.equal(quoteAlert({ source: "quick_quote" }).kind, "Nueva cotización")
  assert.equal(quoteAlert({ source: "installation_quote" }).kind, "Nueva cotización de instalación")
  assert.equal(quoteAlert({ source: "contact_form" }).kind, "Nuevo mensaje de contacto")
})

test("a quote alert carries the request, falling back to the ZIP for the place", () => {
  const a = quoteAlert({
    source: "quick_quote", service: "TV up to 55", tvSize: "Up to 55 inches", mountType: "Tilting",
    name: "Ada Lovelace", phone: "6155550123", zip: "37201", notes: "brick fireplace",
  })
  assert.equal(a.customer, "Ada Lovelace · 6155550123")
  assert.equal(a.details, "🛠 TV up to 55, Up to 55 inches, Tilting · 📍 ZIP 37201 · 💬 brick fireplace")
})

test("an assignment alert names the crew and the job", () => {
  const a = assignmentAlert({
    first_name: "Ada", last_name: "Lovelace", phone: "615-555-0100",
    date: "2026-10-25", time_pref: "9:00 AM",
    booking_mode: "homeinstall", home_install_service: "gazebo",
    custom_quote: false, custom_price: "999.00",
    address: { street: "1 Main St", city: "Franklin", state: "TN", zip: "37064" },
  }, ["Juan", "", "Pedro"])

  assert.equal(a.kind, "Trabajo asignado")
  assert.equal(a.customer, "Ada Lovelace · 615-555-0100")
  assert.match(a.details, /^👷 Juan, Pedro · 📅 dom\.?, 25 oct\.? \(9:00 AM\) · 🛠 Gazebo \/ Pergola Assembly · 📍 1 Main St/)
  assert.ok(!a.details.includes("Precio especial"), "a price only shows on a custom quote")
})
