import InstallationQuoteForm from "../components/InstallationQuoteForm"
import StickyActionBar from "../components/StickyActionBar"
import Link from "next/link"

export const metadata = {
  title: "Request Installation Quote Nashville TN | PrimeTvNashville",
  description: "Request a quote for furniture assembly, mirror hanging, shelf installation, gazebo assembly and other home installation services in Nashville TN.",
  robots: { index: false },
}

export default function GetInstallationQuotePage() {
  return (
    <>
      <section className="relative w-full bg-white overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#E50914] via-black to-[#E50914]" />
        <div aria-hidden="true" className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#E50914]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/60 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E50914]" />
              Free Quote · No Obligation
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-black mb-3">Request an Installation Quote</h1>
            <p className="text-black/55 max-w-md mx-auto text-sm">
              Tell us about your project and we'll get back to you with pricing and availability.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 md:p-8">
            <InstallationQuoteForm />
          </div>

          <div className="text-center mt-6 text-sm text-black/50">
            Looking to mount a TV?{" "}
            <Link href="/book" className="font-semibold text-[#E50914] hover:underline underline-offset-2">
              Book TV mounting here →
            </Link>
          </div>
        </div>
      </section>

      <StickyActionBar />
    </>
  )
}
