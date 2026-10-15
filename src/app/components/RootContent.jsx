"use client"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"
import StickyGate from "./StickyGate"

export default function RootContent({ children }) {
  const path = usePathname()
  // The admin, the job closeout (handed to a customer to sign) and the crew
  // page are
  // tools, not marketing pages: no site header, footer or call-to-action bar.
  const bare = path.startsWith("/admin") || path.startsWith("/job/") || path.startsWith("/crew/")

  if (bare) return <>{children}</>

  return (
    <>
      {/* First thing a keyboard user reaches: jump past the menu. */}
      <a href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-base focus:font-bold focus:text-white">
        Skip to main content
      </a>
      <Navbar />
      {/* Room at the bottom for the quick-actions bar, which shows below lg. */}
      <main id="main" tabIndex={-1} className="pb-24 lg:pb-0 overflow-x-hidden focus:outline-none">{children}</main>
      <StickyGate />
      <Footer />
    </>
  )
}
