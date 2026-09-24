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
        sent.push({ to, subject })
        return { messageId: "ok" }
      },
    }),
  },
})

mock.module("@neondatabase/serverless", {
  namedExports: {
    // Tagged-template stub: INSERT bumps the counter, everything else is a no-op.
    neon: () => async (strings) => {
      const sql = strings.join(" ")
      if (/INSERT INTO bookings/i.test(sql)) {
        if (failInsert) throw new Error("connection timeout")
        inserts++
      }
      return []
    },
  },
})

const { POST } = await import(
  "./route.js"
)

function payload(email) {
  return {
    date: "2026-10-01",
    timePreference: "9:00 AM",
    bookingMode: "standard",
    tvs: [{ model: "standard", size: "55", wallType: "Drywall", comments: "" }],
    cableConcealment: 0,
    address: { street: "1 Main St", apt: "", city: "Franklin", state: "TN", zip: "37064" },
    info: {
      firstName: "Test", lastName: "Customer", email,
      phone: "615-555-0100", referral: "Google", payment: "Cash", agreed: true,
    },
  }
}

const call = (email) =>
  POST(new Request("https://x/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload(email)),
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
