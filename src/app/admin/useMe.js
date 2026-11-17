"use client"
// Who is signed in to the admin — { role: "admin" | "seller", name } — so the
// screens show only what that person can use. Fetched once per page load and
// shared. The server checks every request on its own; this only shapes what is
// on screen. null while it loads.
import { useEffect, useState } from "react"

let pending = null
let cached = null

function loadMe() {
  if (!pending) {
    pending = fetch("/api/me")
      .then(r => (r.ok ? r.json() : null))
      .then(j => (cached = j?.ok ? { role: j.role, name: j.name } : null))
      .catch(() => null)
  }
  return pending
}

export function useMe() {
  const [me, setMe] = useState(cached)
  useEffect(() => {
    let live = true
    loadMe().then(m => { if (live) setMe(m) })
    return () => { live = false }
  }, [])
  return me
}

// Forget who was signed in (after logging out).
export function forgetMe() {
  pending = null
  cached = null
}
