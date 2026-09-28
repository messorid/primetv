export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Legacy alias. This used to read a MongoDB `leads` collection whose cluster no
// longer resolves, so every request returned 500 and the Leads page was blank.
//
// Leads now live in Postgres next to the bookings, served by /api/quote-leads.
// The old path is kept pointing at the same data so nothing that still calls it
// breaks, and both stay in step because there is only one implementation.
export { GET, PATCH, DELETE } from "../quote-leads/route.js"
