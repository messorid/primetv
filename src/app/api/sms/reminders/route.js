export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET /api/sms/reminders?date=YYYY-MM-DD — the appointments for a day
// (tomorrow in Nashville by default) with everything the reminder screen
// needs: phone, arrival window, consent, earlier reminders, and the reasons a
// reminder can't be sent yet.

import { neon } from "@neondatabase/serverless"
import { isAdminRequest, unauthorized } from "@/lib/adminSession"
import { ensureSmsTables, smsStatusFor, smsMode } from "@/app/lib/sms.js"
import { toE164, arrivalWindow, buildReminder, serviceLabel, sendingHours, nashvilleDate, startMinutes } from "@/app/lib/smsRules.js"
import { getCrewFor, crewOrLegacy, ensureCrewTable } from "@/app/lib/crew.js"

export async function GET(request) {
  if (!(await isAdminRequest(request))) return unauthorized()
  try {
    const q = new URL(request.url).searchParams.get("date")
    const date = /^\d{4}-\d{2}-\d{2}$/.test(q || "") ? q : nashvilleDate(new Date(), 1)
    const sql = neon(process.env.DATABASE_URL)
    await ensureSmsTables(sql)
    await ensureCrewTable(sql)

    const rows = await sql`
      SELECT id, first_name, last_name, phone, date, time_pref, status, booking_mode, address, installer_id, installer_name
      FROM bookings WHERE date = ${date} AND status IN ('pending', 'confirmed')
    `
    const crewBy = await getCrewFor(sql, rows.map(r => r.id))
    const phones = rows.map(r => toE164(r.phone))
    const status = await smsStatusFor(sql, phones)
    const msgs = rows.length ? await sql`
      SELECT booking_id, body, sent_by, mode, status, error_code, error_message, created_at, to_phone
      FROM sms_messages WHERE kind = 'reminder' AND booking_id = ANY(${rows.map(r => r.id)}::uuid[])
      ORDER BY created_at DESC
    ` : []

    const appointments = rows.map((r, i) => {
      const phone = phones[i]
      const st = phone ? status.get(phone) : null
      const window = arrivalWindow(r.time_pref)
      const blockers = []
      if (!phone) blockers.push("No valid US mobile number on this booking.")
      else if (!st.allowed) blockers.push(st.reason)
      if (!window) blockers.push("No appointment time set — add the time to the booking first.")
      return {
        id: r.id,
        name: `${r.first_name || ""} ${r.last_name || ""}`.trim(),
        firstName: r.first_name || "",
        phone,
        rawPhone: r.phone || "",
        time: r.time_pref || "",
        window,
        status: r.status,
        city: r.address?.city || "",
        crew: crewOrLegacy(crewBy.get(r.id), r).map(m => m.installerName).filter(Boolean),
        consent: st?.consent ? { method: st.consent.method, givenAt: st.consent.given_at, by: st.consent.recorded_by } : null,
        optedOut: !!st?.optout && (!st.consent || new Date(st.optout.opted_out_at) >= new Date(st.consent.given_at)),
        sent: msgs.filter(m => m.booking_id === r.id).map(m => ({
          at: m.created_at, by: m.sent_by, mode: m.mode, status: m.status, errorCode: m.error_code, errorMessage: m.error_message, body: m.body,
        })),
        draft: buildReminder({ firstName: r.first_name, date: r.date, timePref: r.time_pref, service: serviceLabel(r), tomorrow: date === nashvilleDate(new Date(), 1) }),
        blockers,
      }
    }).sort((a, b) => startMinutes(a.time) - startMinutes(b.time))

    return Response.json({ ok: true, date, mode: smsMode(), hours: sendingHours(), appointments })
  } catch (err) {
    console.error("sms reminders GET error", err)
    return Response.json({ ok: false, error: err.message }, { status: 500 })
  }
}
