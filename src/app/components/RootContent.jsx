"use client"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"
import StickyGate from "./StickyGate"

export default function RootContent({ children }) {
  const path = usePathname()
  // The admin and the job closeout page (handed to a customer to sign) are
  // tools, not marketing pages: no site header, footer or call-to-action bar.
  const bare = path.startsWith("/admin") || path.startsWith("/job/")

  if (bare) return <>{children}</>

  return (
    <>
      <Navbar />
      <main className="pb-24 md:pb-24 overflow-x-hidden">{children}</main>
      <StickyGate />
      <Footer />
    </>
  )
}
