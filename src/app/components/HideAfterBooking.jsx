"use client"
// Shows its children until the booking form on the same page is sent, then
// hides them. The children are rendered on the server, so they are in the page
// as it first loads.
import { useEffect, useState } from "react"

export const BOOKING_DONE_EVENT = "primetv:booking-done"

export default function HideAfterBooking({ children }) {
  const [done, setDone] = useState(false)
  useEffect(() => {
    const onDone = () => setDone(true)
    window.addEventListener(BOOKING_DONE_EVENT, onDone)
    return () => window.removeEventListener(BOOKING_DONE_EVENT, onDone)
  }, [])
  return done ? null : children
}
