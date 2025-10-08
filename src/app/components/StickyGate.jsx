"use client"

import { usePathname } from "next/navigation"
import StickyActionBar from "./StickyActionBar"

export default function StickyGate() {
  const pathname = usePathname()
  const hide =
    pathname === "/book" || pathname.startsWith("/book/") // oculta en book
  if (hide) return null
  return <StickyActionBar />
}
