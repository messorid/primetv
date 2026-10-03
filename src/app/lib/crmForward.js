// ─────────────────────────────────────────────────────────────────────────────
// Sends Quick Quote leads on to the Sistema de Leads CRM, so the team works them
// next to the Messenger and Instagram conversations instead of only here.
//
// Best effort by design. By the time this runs the lead is already in Postgres
// and on its way to the inbox, so a CRM outage must never reach the customer:
// this never throws, and the quote route calls it after the response is sent.
// ─────────────────────────────────────────────────────────────────────────────

const TIMEOUT_MS = 8000

// Website quotes mostly arrive from Google search and the Google Business
// Profile, so the CRM files them under Google.
export function crmLeadPayload(lead, externalId) {
  return {
    externalId,
    source:        "GOOGLE",
    form:          "Quick Quote",
    name:          lead.name,
    phone:         lead.phone,
    email:         lead.email,
    zip:           lead.zip,
    address:       lead.address,
    service:       lead.service,
    tvSize:        lead.tvSize,
    mountType:     lead.mountType,
    preferredDate: lead.preferredDate,
    preferredTime: lead.preferredTime,
    notes:         lead.notes,
  }
}

export async function forwardLeadToCrm(lead, externalId, fetchImpl = fetch) {
  // Same URL and key the admin dashboard already uses to read the CRM feed.
  const url = process.env.CRM_API_URL
  const key = process.env.CRM_API_KEY
  if (!url || !key) {
    console.error("CRM forward skipped: CRM_API_URL or CRM_API_KEY missing")
    return false
  }

  const body = JSON.stringify(crmLeadPayload(lead, externalId))

  // The retry reuses the same externalId, so if the first attempt landed but
  // its response was lost the CRM recognises it instead of filing it twice.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetchImpl(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": key },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      if (res.ok) return true

      const detail = await res.text().catch(() => "")
      // A 4xx (bad key, rejected payload) won't change on a retry.
      if (res.status < 500) {
        console.error(`CRM rejected quote lead (${res.status}): ${detail}`)
        return false
      }
      console.error(`CRM forward attempt ${attempt} got ${res.status}: ${detail}`)
    } catch (err) {
      console.error(`CRM forward attempt ${attempt} failed`, err)
    }
  }
  return false
}
