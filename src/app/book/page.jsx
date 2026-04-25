// app/book/page.jsx
import JotformEmbed from "./JotformEmbed"

export const metadata = {
  title: "Book TV Mounting in Nashville | Schedule Your Installation | PrimeTvNashville",
  description: "Book your professional TV mounting or installation appointment in Nashville TN. Fast scheduling, same-day availability. PrimeTvNashville — trusted by hundreds of Nashville homeowners.",
  keywords: ["book TV mounting Nashville", "schedule TV installation Nashville", "TV mount appointment Nashville"],
  openGraph: {
    title: "Book TV Mounting in Nashville | PrimeTvNashville",
    description: "Schedule your professional TV mounting or installation appointment in Nashville TN. Fast, easy online booking.",
    url: "https://primetvnashville.com/book",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://primetvnashville.com/book",
  },
}

export default function Page() {
  return (
    <section id="book" className="bg-white text-black">
      <JotformEmbed />
    </section>
  )
}
