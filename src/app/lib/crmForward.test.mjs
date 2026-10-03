// The CRM forward is best effort: it must never throw, must not retry what a
// retry can't fix, and must retry with the same id so the CRM can dedupe.
import { test } from "node:test"
import assert from "node:assert/strict"
import { crmLeadPayload, forwardLeadToCrm } from "./crmForward.js"

process.env.CRM_API_URL = "https://crm.example.com/api/public/leads"
process.env.CRM_API_KEY = "crm-key"

const LEAD = { name: "Ada Lovelace", phone: "6155550123", zip: "37201", service: "TV up to 55" }

function fakeFetch(responses) {
  const calls = []
  const impl = async (url, opts) => {
    calls.push({ url, opts, body: JSON.parse(opts.body) })
    const next = responses[calls.length - 1]
    if (next instanceof Error) throw next
    return new Response("{}", { status: next })
  }
  return { impl, calls }
}

test("the payload marks the lead as a Google Quick Quote", () => {
  const body = crmLeadPayload(LEAD, "abc")
  assert.equal(body.externalId, "abc")
  assert.equal(body.source, "GOOGLE")
  assert.equal(body.form, "Quick Quote")
  assert.equal(body.name, "Ada Lovelace")
  assert.equal(body.zip, "37201")
})

test("a successful post reports true after one call", async () => {
  const { impl, calls } = fakeFetch([201])
  assert.equal(await forwardLeadToCrm(LEAD, "abc", impl), true)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].opts.headers["X-API-Key"], "crm-key")
})

test("a server error is retried once, with the same id", async () => {
  const { impl, calls } = fakeFetch([503, 201])
  assert.equal(await forwardLeadToCrm(LEAD, "abc", impl), true)
  assert.equal(calls.length, 2)
  assert.equal(calls[0].body.externalId, calls[1].body.externalId)
})

test("a rejected lead is not retried", async () => {
  const { impl, calls } = fakeFetch([401, 201])
  assert.equal(await forwardLeadToCrm(LEAD, "abc", impl), false)
  assert.equal(calls.length, 1, "a bad key won't fix itself on a retry")
})

test("a network failure on both attempts returns false instead of throwing", async () => {
  const { impl, calls } = fakeFetch([new Error("ECONNRESET"), new Error("ECONNRESET")])
  assert.equal(await forwardLeadToCrm(LEAD, "abc", impl), false)
  assert.equal(calls.length, 2)
})

test("nothing is sent when the CRM isn't configured", async () => {
  const saved = process.env.CRM_API_KEY
  delete process.env.CRM_API_KEY
  try {
    const { impl, calls } = fakeFetch([201])
    assert.equal(await forwardLeadToCrm(LEAD, "abc", impl), false)
    assert.equal(calls.length, 0)
  } finally {
    process.env.CRM_API_KEY = saved
  }
})
