// Reproduces the production incident: the business email goes out, the customer
// confirmation fails (mistyped address), and we assert the booking is still saved
// and the caller gets a success rather than a 500.
import { test } from "node:test"
import assert from "node:assert/strict"
import { mock } from "node:test"

process.env.EMAIL_USER = "test@example.com"
process.env.EMAIL_PASS = "x"
process.env.DATABASE_URL = "postgres://fake"

const sent = []
let inserts = 0
let failClientEmail = true
let failInsert = false

mock.module("nodemailer", {
  defaultExport: {
    createTransport: () => ({
      verify: async () => true,
      sendMail: async (opts) => {
        const to = String(opts.to || "")
        const subject = String(opts.subject || "")
        if (failClientEmail && to === "bad-address@@invalid") {
          throw new Error("550 5.1.1 recipient rejected")
        }
        sent.push({ to, subject, html: String(opts.html || "") })
        return { messageId: "ok" }
      },
    }),
  },
})

// Stands in for the real table. cableIsBoolean reproduces the production
// column that ADD COLUMN IF NOT EXISTS never converted from BOOLEAN to INT:
// it accepts 0 and 1 but rejects 2, exactly as Postgres did.
let cableIsBoolean = false
let migrated = false

mock.module("@neondatabase/serverless", {
  namedExports: {
    neon: () => async (strings, ...values) => {
      const sql = strings.join(" ")
      if (/ALTER COLUMN cable_concealment TYPE INTEGER/i.test(sql)) {
        migrated = true
        cableIsBoolean = false
        return []
      }
      if (/INSERT INTO bookings/i.test(sql)) {
        if (failInsert) throw new Error("connection timeout")
        if (cableIsBoolean) {
          const cable = values[17]
          if (typeof cable === "number" && cable !== 0 && cable !== 1) {
            throw new Error(`invalid input syntax for type boolean: "${cable}"`)
          }
        }
        inserts++
      }
      return []
    },
  },
})

const { POST } = await import(
  "./route.js"
)

function payload(email, cable = 0) {
  return {
    date: "2026-10-01",
    timePreference: "9:00 AM",
    bookingMode: "standard",
    tvs: [{ model: "standard", size: "55", wallType: "Drywall", comments: "" }],
    cableConcealment: cable,
    address: { street: "1 Main St", apt: "", city: "Franklin", state: "TN", zip: "37064" },
    info: {
      firstName: "Test", lastName: "Customer", email,
      phone: "615-555-0100", referral: "Google", payment: "Cash", agreed: true,
    },
  }
}

const call = (email, cable = 0) =>
  POST(new Request("https://x/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload(email, cable)),
  }))

test("customer email bounces -> booking STILL saved, no 500", async () => {
  sent.length = 0; inserts = 0; failInsert = false
  const res = await call("bad-address@@invalid")
  const json = await res.json()

  assert.equal(res.status, 200, "must not return 500")
  assert.equal(json.ok, true)
  assert.equal(inserts, 1, "booking must be inserted")
  assert.equal(json.saved, true)
  assert.equal(json.clientNotified, false, "client email failed")
  assert.equal(json.businessNotified, true, "business email still went out")

  const subjects = sent.map(s => s.subject).join(" | ")
  assert.match(subjects, /CUSTOMER DID NOT GET THEIR CONFIRMATION/,
    "office must be alerted to call the customer")
})

test("happy path -> saved and both emails sent", async () => {
  sent.length = 0; inserts = 0; failInsert = false
  const res = await call("good@example.com")
  const json = await res.json()

  assert.equal(res.status, 200)
  assert.equal(inserts, 1)
  assert.equal(json.saved, true)
  assert.equal(json.clientNotified, true)
  assert.equal(json.businessNotified, true)
  assert.ok(!sent.some(s => /⚠️/.test(s.subject)), "no alert emails on the happy path")
})

test("database down -> alert email fires, still no 500", async () => {
  sent.length = 0; inserts = 0; failInsert = true
  const res = await call("good@example.com")
  const json = await res.json()

  assert.equal(res.status, 200)
  assert.equal(json.saved, false)
  const subjects = sent.map(s => s.subject).join(" | ")
  assert.match(subjects, /BOOKING NOT SAVED TO DATABASE/)
})

test("cable concealment x2 on the legacy boolean column -> migrates and saves", async () => {
  // Reproduces the Casey Sherwin booking: two cable runs against a column that
  // was still BOOLEAN, which is what rejected the insert in production.
  sent.length = 0; inserts = 0; failInsert = false
  cableIsBoolean = true; migrated = false

  const res = await call("good@example.com", 2)
  const json = await res.json()

  assert.equal(res.status, 200)
  assert.equal(migrated, true, "the boolean->int migration must run")
  assert.equal(json.saved, true, "booking must be saved after the migration")
  assert.equal(inserts, 1)
  assert.ok(!sent.some(s => /NOT SAVED TO DATABASE/.test(s.subject)),
    "no data-loss alert once the migration lets the retry through")
})

test("cable concealment x1 still fine on the legacy column", async () => {
  sent.length = 0; inserts = 0; failInsert = false
  cableIsBoolean = true; migrated = false

  const json = await (await call("good@example.com", 1)).json()
  assert.equal(json.saved, true)
  assert.equal(migrated, false, "1 is valid for a boolean column, no migration needed")
})

test("client confirmation keeps its content after the shared-module extraction", async () => {
  sent.length = 0; inserts = 0; failInsert = false; cableIsBoolean = false
  await call("good@example.com", 2)

  const mail = sent.find(m => m.to === "good@example.com")
  assert.ok(mail, "client email must be sent")
  assert.equal(mail.subject, "Booking Confirmed — PrimeTvNashville")

  for (const needle of [
    "Your Booking is Confirmed!",
    "Hi Test,",
    "Booking Summary",
    "1 Main St",
    "Franklin",
    "Cable Concealment ×2",
    "Wall Liability Notice",
    "primetvnashville.com/terms",
  ]) {
    assert.ok(mail.html.includes(needle), `client email must still contain: ${needle}`)
  }
})
