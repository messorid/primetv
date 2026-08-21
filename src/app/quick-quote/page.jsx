import QuickQuoteForm from "../components/QuickQuoteForm"
import StickyActionBar from "../components/StickyActionBar"
import Link from "next/link"

export const metadata = {
  title: "Quick Quote | TV Mounting Nashville | PrimeTvNashville",
  description: "Get a quick quote for TV mounting or home installation services in Nashville TN. Fast response, upfront pricing.",
  robots: { index: false },
}

export default function QuickQuotePage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-xl mx-auto px-5 pt-6 pb-2">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition mb-2">
            ← Back to home
          </Link>
        </div>
        <QuickQuoteForm />
      </div>
      <StickyActionBar />
    </>
  )
}
