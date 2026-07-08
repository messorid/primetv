"use client"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"
import StickyGate from "./StickyGate"

export default function RootContent({ children }) {
  const path = usePathname()
  const isAdmin = path.startsWith("/admin")

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Navbar />
      <main className="pb-24 md:pb-24 overflow-x-hidden">{children}</main>
      <StickyGate />
      <Footer />
    </>
  )
}
