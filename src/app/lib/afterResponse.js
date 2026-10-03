// Runs a task after the response has been sent, so slow follow-up work (like
// filing the lead in the CRM) never holds up the customer.
//
// Lives in its own module so the route tests can replace it: plain Node can't
// resolve "next/server", and after() only works inside a live Next request.
import { after } from "next/server"

export function runAfterResponse(task) {
  after(task)
}
