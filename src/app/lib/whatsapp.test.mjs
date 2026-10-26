// The WhatsApp alerts, to the owner and to an assigned installer: what each one
// says, and that the sender never sends half-configured, never throws, and
// never hands Meta a variable it will refuse.
import { test, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"

import {
  notifyWhatsApp, notifyInstaller, canSendWhatsApp, recipients, installerNumber, templateParam,
} from "./whatsapp.js"
import { bookingAlert, quoteAlert, assignmentAlert, installerJobAlert, when } from "./whatsappAlerts.js"

const ENV_KEYS = [
  "WHATSAPP_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_NOTIFY_TO",
  "WHATSAPP_TEMPLATE", "WHATSAPP_TEMPLATE_LANG", "WHATSAPP_API_VERSION",
  "WHATSAPP_INSTALLER_TEMPLATE", "WHATSAPP_INSTALLER_TEMPLATE_LANG",
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
  assert.equal(body.template.name, "primetv_solicitud_cliente")
  assert.deepEqual(body.template.language, { code: "en" })
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

test("a skipped alert names the missing variable, never a value", async (t) => {
  const warn = t.mock.method(console, "warn", () => {})
  delete process.env.WHATSAPP_PHONE_NUMBER_ID
  await notifyWhatsApp(ALERT)

  assert.equal(warn.mock.callCount(), 1)
  const msg = warn.mock.calls[0].arguments[0]
  assert.match(msg, /WHATSAPP_PHONE_NUMBER_ID not set/)
  assert.ok(!msg.includes("wa-token"), "the token must never reach the logs")
})

test("an accepted alert logs Meta's message id", async (t) => {
  const log = t.mock.method(console, "log", () => {})
  reply = () => new Response(JSON.stringify({ messages: [{ id: "wamid.ABC123" }] }), { status: 200 })
  await notifyWhatsApp(ALERT)

  assert.match(log.mock.calls[0].arguments[0], /"Nueva reservación" accepted for 584122061611: wamid\.ABC123/)
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

/* Installers: their own heads-up when a job is assigned to them */

test("installer phones become numbers WhatsApp can reach", () => {
  assert.equal(installerNumber("(615) 555-0100"), "16155550100", "ten digits are a US number")
  assert.equal(installerNumber("1-615-555-0100"), "16155550100")
  assert.equal(installerNumber("+58 412-206-1611"), "584122061611", "a + keeps its country code")
  assert.equal(installerNumber("0058 4122061611"), "584122061611")
  assert.equal(installerNumber("555-0100"), null, "too short to route")
  assert.equal(installerNumber("04122061611"), null, "a local number abroad needs its country code")
  assert.equal(installerNumber(""), null)
  assert.equal(installerNumber(null), null)
})

test("an assigned installer gets the job template on their own phone", async () => {
  delete process.env.WHATSAPP_NOTIFY_TO   // the owner's number has nothing to do with it
  const params = ["Sun, Oct 25 (9:00 AM)", "Ada Lovelace · 615-555-0100", "1 Main St, Franklin, TN", '1 TV: 65"']

  assert.equal(await notifyInstaller({ installerName: "Juan", phone: "(615) 555-0199", params }), true)

  assert.equal(calls.length, 1)
  const { url, body } = calls[0]
  assert.equal(url, "https://graph.facebook.com/v23.0/1234567890/messages")
  assert.equal(body.to, "16155550199")
  assert.equal(body.template.name, "primetv_job_assigned")
  assert.deepEqual(body.template.language, { code: "en" })
  assert.deepEqual(body.template.components[0].parameters.map(p => p.text), params)
})

test("the installer template can be changed without a deploy", async () => {
  process.env.WHATSAPP_INSTALLER_TEMPLATE = "primetv_trabajo_asignado"
  process.env.WHATSAPP_INSTALLER_TEMPLATE_LANG = "es"
  await notifyInstaller({ installerName: "Juan", phone: "6155550199", params: ["a", "b", "c", "d"] })

  assert.equal(calls[0].body.template.name, "primetv_trabajo_asignado")
  assert.equal(calls[0].body.template.language.code, "es")
})

test("an installer without a usable phone is skipped and logged", async (t) => {
  const warn = t.mock.method(console, "warn", () => {})

  assert.equal(await notifyInstaller({ installerName: "Juan", phone: "", params: [] }), false)
  assert.equal(await notifyInstaller({ installerName: "Pedro", phone: "555-0100", params: [] }), false)

  assert.equal(calls.length, 0)
  assert.match(warn.mock.calls[0].arguments[0], /job alert for Juan not sent: no phone on file/)
  assert.match(warn.mock.calls[1].arguments[0], /job alert for Pedro not sent: "555-0100"/)
})

test("no installer is messaged without the token and the number id", async (t) => {
  t.mock.method(console, "warn", () => {})
  delete process.env.WHATSAPP_TOKEN

  assert.equal(await notifyInstaller({ installerName: "Juan", phone: "6155550199", params: [] }), false)
  assert.equal(calls.length, 0)
})

test("an installer's job alert is in English, names the crewmates and shows no price", () => {
  const [date, customer, address, job] = installerJobAlert({
    first_name: "Ada", last_name: "Lovelace", phone: "615-555-0100",
    date: "2026-10-25", time_pref: "9:00 AM",
    tvs: [{ size: "65" }, { size: "55\"", model: "frame" }], cable_concealment: 1,
    custom_quote: false, custom_price: "999.00", coupon_code: "PRIMETV5",
    address: { street: "1 Main St", city: "Franklin", state: "TN", zip: "37064" },
  }, ["Pedro"])

  assert.equal(date, "Sun, Oct 25 (9:00 AM)")
  assert.equal(customer, "Ada Lovelace · 615-555-0100")
  assert.equal(address, "1 Main St, Franklin, TN, 37064")
  assert.equal(job, '2 TVs: 65", 55" Frame + Cable concealment ×1 · 👷 With Pedro')
  assert.ok(!job.includes("999") && !job.includes("PRIMETV5"), "prices and coupons are for the office")
})

test("a solo home installation names the service and no crew", () => {
  const job = installerJobAlert({ booking_mode: "homeinstall", home_install_service: "gazebo" })[3]
  assert.equal(job, "Gazebo / Pergola Assembly")
})
