import BookingFormSection from "@/app/components/BookingFormSection"

export const metadata = {
  title: "Book TV Mounting in Nashville | PrimeTvNashville",
  description: "Book your TV mounting or installation appointment in Nashville TN online. Same-day availability, upfront pricing. Homes, apartments and businesses welcome.",
  keywords: ["book TV mounting Nashville", "schedule TV installation Nashville", "TV mount appointment Nashville"],
  openGraph: {
    title: "Book TV Mounting in Nashville | PrimeTvNashville",
    description: "Schedule your professional TV mounting or installation appointment in Nashville TN. Fast, easy online booking.",
    url: "https://www.primetvnashville.com/book",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://www.primetvnashville.com/book",
  },
}

export default function Page() {
  return (
    <main className="bg-white text-black min-h-screen">
      <BookingFormSection />
    </main>
  )
}
