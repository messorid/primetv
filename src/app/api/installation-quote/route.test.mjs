// The Home Installation form is the second way a lead reaches us, so it gets
// the same guarantee as the TV quote: recorded first, email second, neither one
// able to take the other down.
import { test, mock } from "node:test"
import assert from "node:assert/strict"

process.env.EMAIL_USER = "test@example.com"
process.env.EMAIL_PASS = "x"
process.env.DATABASE_URL = "postgres://fake"

const sent = []
const inserted = []
let failEmail = false
let failInsert = false

mock.module("nodemailer", {
  defaultExport: {
    createTransport: () => ({
      sendMail: async (opts) => {
        if (failEmail) throw new Error("535 authentication failed")
        sent.push({ subject: String(opts.subject || "") })
        return { messageId: "ok" }
      },
    }),
  },
})

mock.module("@neondatabase/serverless", {
  namedExports: {
    neon: () => async (strings, ...values) => {
      if (/INSERT INTO quote_leads/i.test(strings.join(" "))) {
        if (failInsert) throw new Error("connection timeout")
        const [source, service, name, phone, email, zip, address, , , preferredDate, , notes, details] = values
        inserted.push({ source, service, name, phone, email, zip, address, preferredDate, notes, details })
        return [{ id: "lead-1" }]
      }
      return []
    },
  },
})

const { POST } = await import("./route.js")

const post = body =>
  POST(new Request("http://localhost/api/installation-quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }))

function reset() {
  sent.length = 0
  inserted.length = 0
  failEmail = false
  failInsert = false
}

const REQ = {
  service: "playset",
  answers: { description: "Backyard Discovery Skyfort", brand: "Backyard Discovery" },
  contact: {
    name: "Ada Lovelace",
    phone: "6155550123",
    email: "ada@example.com",
    zip: "37201",
    address: "12 Music Row",
    date: "2026-10-05",
  },
}

test("an installation request becomes a lead with a readable service name", async () => {
  reset()
  const res = await post(REQ)
  const body = await res.json()

  assert.equal(res.status, 200)
  assert.equal(body.ok, true)
  assert.equal(body.saved, true)
  assert.equal(body.notified, true)

  const lead = inserted[0]
  assert.equal(lead.source, "installation_quote")
  assert.equal(lead.service, "Playground / Playset Installation", "the panel shows the label, not the form value")
  assert.equal(lead.name, "Ada Lovelace")
  assert.equal(lead.zip, "37201")
  assert.equal(lead.address, "12 Music Row")
  assert.equal(lead.preferredDate, "2026-10-05")
  assert.equal(lead.notes, "Backyard Discovery Skyfort")

  // Every per-service answer is kept, since each service asks different things.
  const details = JSON.parse(lead.details)
  assert.equal(details.serviceKey, "playset")
  assert.equal(details.answers.brand, "Backyard Discovery")
})

test("the lead survives a failed email", async () => {
  reset()
  failEmail = true
  const res = await post(REQ)
  const body = await res.json()

  assert.equal(res.status, 200)
  assert.equal(body.saved, true)
  assert.equal(body.notified, false)
  assert.equal(inserted.length, 1)
})

test("the email still goes out when the database is down", async () => {
  reset()
  failInsert = true
  const res = await post(REQ)

  assert.equal(res.status, 200)
  assert.equal((await res.json()).notified, true)
  assert.equal(sent.length, 1)
})

test("a total outage returns an error rather than losing the request", async () => {
  reset()
  failEmail = true
  failInsert = true
  const res = await post(REQ)

  assert.equal(res.status, 500)
})

test("missing contact details are rejected before anything is written", async () => {
  reset()
  const res = await post({ service: "furniture", answers: {}, contact: { name: "Ada" } })

  assert.equal(res.status, 400)
  assert.equal(inserted.length, 0)
  assert.equal(sent.length, 0)
})

test("an unmapped service falls back to whatever the form sent", async () => {
  reset()
  await post({ ...REQ, service: "trampoline" })

  assert.equal(inserted[0].service, "trampoline")
})
