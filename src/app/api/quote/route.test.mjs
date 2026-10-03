// Quote forms used to only send an email: if the email was lost, so was the
// lead. These tests pin down the fix — the lead is written to Postgres first,
// and neither side can take the other down.
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
      verify: async () => {
        if (failEmail) throw new Error("535 authentication failed")
        return true
      },
      sendMail: async (opts) => {
        sent.push({ subject: String(opts.subject || ""), html: String(opts.html || "") })
        return { messageId: "ok" }
      },
    }),
  },
})

mock.module("@neondatabase/serverless", {
  namedExports: {
    neon: () => async (strings, ...values) => {
      const sql = strings.join(" ")
      if (/INSERT INTO quote_leads/i.test(sql)) {
        if (failInsert) throw new Error("connection timeout")
        const [source, service, name, phone, email, zip, address, tvSize, mountType,
               preferredDate, preferredTime, notes, details] = values
        inserted.push({ source, service, name, phone, email, zip, address, tvSize,
                        mountType, preferredDate, preferredTime, notes, details })
        return [{ id: "lead-1" }]
      }
      return []
    },
  },
})

// after() is replaced by a queue, so a test can prove the CRM call waits until
// the response is out, then run it on demand.
const deferred = []
mock.module("../../lib/afterResponse.js", {
  namedExports: { runAfterResponse: task => deferred.push(task) },
})

process.env.CRM_API_URL = "https://crm.example.com/api/public/leads"
process.env.CRM_API_KEY = "crm-key"

const crmCalls = []
let failCrm = false
globalThis.fetch = async (url, opts) => {
  if (failCrm) throw new Error("ECONNREFUSED")
  crmCalls.push({ url, headers: opts.headers, body: JSON.parse(opts.body) })
  return new Response(JSON.stringify({ id: "crm-1" }), { status: 201 })
}

const runDeferred = () => Promise.all(deferred.map(task => task()))

const { POST } = await import("./route.js")

const post = body =>
  POST(new Request("http://localhost/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }))

function reset() {
  sent.length = 0
  inserted.length = 0
  deferred.length = 0
  crmCalls.length = 0
  failEmail = false
  failInsert = false
  failCrm = false
}

const QUICK = {
  service: "TV up to 55",
  tvSize: "Up to 55 inches",
  zip: "37201",
  name: "Ada Lovelace",
  phone: "6155550123",
  email: "ada@example.com",
}

test("a quick quote is stored as a lead and emailed", async () => {
  reset()
  const res = await post(QUICK)
  const body = await res.json()

  assert.equal(res.status, 200)
  assert.deepEqual({ ok: body.ok, saved: body.saved, notified: body.notified },
    { ok: true, saved: true, notified: true })

  assert.equal(inserted.length, 1)
  assert.equal(sent.length, 1)

  const lead = inserted[0]
  assert.equal(lead.source, "quick_quote")
  assert.equal(lead.name, "Ada Lovelace")
  assert.equal(lead.email, "ada@example.com")
  assert.equal(lead.phone, "6155550123")
  assert.equal(lead.zip, "37201")
  assert.equal(lead.service, "TV up to 55")
  assert.equal(lead.tvSize, "Up to 55 inches")
})

test("the lead survives a dead mailbox", async () => {
  reset()
  failEmail = true
  const res = await post(QUICK)
  const body = await res.json()

  // The form must still succeed, or the customer retypes everything while we
  // already have their details.
  assert.equal(res.status, 200)
  assert.equal(body.ok, true)
  assert.equal(body.saved, true)
  assert.equal(body.notified, false)
  assert.equal(inserted.length, 1)
  assert.equal(sent.length, 0)
})

test("the email still goes out when the database is down", async () => {
  reset()
  failInsert = true
  const res = await post(QUICK)
  const body = await res.json()

  assert.equal(res.status, 200)
  assert.equal(body.saved, false)
  assert.equal(body.notified, true)
  assert.equal(sent.length, 1, "the inbox is the fallback record")
})

test("a total outage is reported as an error, not a silent loss", async () => {
  reset()
  failEmail = true
  failInsert = true
  const res = await post(QUICK)

  assert.equal(res.status, 500, "the form has to tell them to call instead")
  assert.equal((await res.json()).ok, false)
})

test("the contact form is filed under its own source", async () => {
  reset()
  await post({ ...QUICK, leadSource: "contact_form", notes: "over a brick fireplace" })

  assert.equal(inserted[0].source, "contact_form")
  assert.equal(inserted[0].notes, "over a brick fireplace")
})

test("an unknown source cannot be injected", async () => {
  reset()
  await post({ ...QUICK, leadSource: "'; DROP TABLE quote_leads; --" })

  assert.equal(inserted[0].source, "quick_quote")
})

test("the multi-TV wizard payload is flattened into one lead", async () => {
  reset()
  const res = await post({
    fullName: "Grace Hopper",
    email: "grace@example.com",
    phone: "6155550199",
    preferredDate: "2026-10-02",
    totalCost: 260,
    tvDetails: [
      { tvType: "Samsung", tvSize: "65", wallType: "Drywall", hideCables: "Yes", comments: "living room" },
      { tvType: "LG", tvSize: "43", wallType: "Brick", hideCables: "No", comments: "" },
    ],
  })

  assert.equal(res.status, 200)
  assert.equal(inserted.length, 1, "one request is one lead, not one per TV")

  const lead = inserted[0]
  assert.equal(lead.name, "Grace Hopper")
  assert.equal(lead.service, "2 TVs")
  assert.equal(lead.tvSize, "65, 43")
  assert.equal(lead.preferredDate, "2026-10-02")
  assert.match(lead.notes, /TV 1: Samsung/)
  assert.match(lead.notes, /TV 2: LG/)

  // Nothing from the form is dropped: the per-TV answers are kept verbatim.
  const details = JSON.parse(lead.details)
  assert.equal(details.tvDetails.length, 2)
  assert.equal(details.totalCost, 260)
})

test("long input is clipped instead of blowing up the insert", async () => {
  reset()
  await post({ ...QUICK, notes: "x".repeat(5000), name: "y".repeat(500) })

  assert.equal(inserted[0].notes.length, 2000)
  assert.equal(inserted[0].name.length, 120)
})

test("blank fields are stored as null, not empty strings", async () => {
  reset()
  await post({ ...QUICK, address: "   ", mountType: "" })

  assert.equal(inserted[0].address, null)
  assert.equal(inserted[0].mountType, null)
})

test("malformed JSON is rejected without touching the database", async () => {
  reset()
  const res = await POST(new Request("http://localhost/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  }))

  assert.equal(res.status, 400)
  assert.equal(inserted.length, 0)
  assert.equal(sent.length, 0)
})

/* CRM: Quick Quote leads also go to the Sistema de Leads CRM, as Google leads */

test("a quick quote is filed in the CRM as a Google lead, after the response", async () => {
  reset()
  const res = await post({ ...QUICK, mountType: "Tilting", notes: "brick fireplace" })

  assert.equal(res.status, 200)
  assert.equal(crmCalls.length, 0, "the customer must not wait for the CRM")
  assert.equal(deferred.length, 1)

  await runDeferred()
  assert.equal(crmCalls.length, 1)

  const call = crmCalls[0]
  assert.equal(call.url, "https://crm.example.com/api/public/leads")
  assert.equal(call.headers["X-API-Key"], "crm-key")
  assert.equal(call.body.source, "GOOGLE")
  assert.equal(call.body.form, "Quick Quote")
  assert.equal(call.body.name, "Ada Lovelace")
  assert.equal(call.body.phone, "6155550123")
  assert.equal(call.body.zip, "37201")
  assert.equal(call.body.mountType, "Tilting")
  assert.equal(call.body.notes, "brick fireplace")
  assert.match(call.body.externalId, /^[0-9a-f-]{36}$/)
})

test("each quote gets its own CRM id, so two real requests are two leads", async () => {
  reset()
  await post(QUICK)
  await post(QUICK)
  await runDeferred()

  assert.equal(crmCalls.length, 2)
  assert.notEqual(crmCalls[0].body.externalId, crmCalls[1].body.externalId)
})

test("the contact form is not sent to the CRM", async () => {
  reset()
  await post({ ...QUICK, leadSource: "contact_form" })

  assert.equal(deferred.length, 0)
})

test("a CRM outage never reaches the customer", async () => {
  reset()
  failCrm = true
  const res = await post(QUICK)

  assert.equal(res.status, 200)
  assert.equal((await res.json()).ok, true)
  // The deferred task swallows the failure instead of crashing the function.
  await assert.doesNotReject(runDeferred())
})

test("the CRM still gets the lead when the inbox and database are both down", async () => {
  reset()
  failEmail = true
  failInsert = true
  const res = await post(QUICK)
  await runDeferred()

  assert.equal(res.status, 500)
  assert.equal(crmCalls.length, 1, "the CRM is one more place the lead survives")
})
