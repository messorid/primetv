import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import PricingSection from "./components/PricingSection";
import BookingSteps from "./components/BookingSteps";
import GallerySection from "./components/GallerySection";
import WhyChooseSection from "./components/WhyChooseSection";
import MoreThanTVSection from "./components/MoreThanTVSection";
import CoverageMap from "./components/CoverageMap";
import InternalLinksHub from "./components/InternalLinksHub";
import FaqsSection from "./components/FaqsSection";
import QuickQuoteForm from "./components/QuickQuoteForm";

// 📝 OPTIMIZACIÓN DE METADATOS PARA SEO Y REDES SOCIALES
export const metadata = {
  title: "TV Mounting Nashville TN | PrimeTvNashville",
  description: "Professional TV mounting in Nashville TN. Same-day options, clean cable concealment, upfront pricing. Homes, apartments and businesses. Book today!",
  keywords: ["TV mounting Nashville", "TV mounting Nashville TN", "TV installation Nashville", "same-day TV mounting Nashville", "TV wall mount Nashville", "cable concealment Nashville", "PrimeTvNashville"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Expert TV Wall Mounting in Nashville, TN | PrimeTvNashville",
    description: "Same-day and next-day TV installation experts in Nashville. Safe, secure, and perfectly leveled.",
    url: "https://www.primetvnashville.com",
    siteName: "PrimeTvNashville",
    images: [
      {
        url: "https://www.primetvnashville.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Professional TV wall mounting by PrimeTvNashville",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expert TV Mounting in Nashville TN | PrimeTvNashville",
    description: "Reliable and expert TV installation services for homes and businesses in Nashville.",
    images: ["https://www.primetvnashville.com/opengraph-image"],
  },
  alternates: {
    canonical: "https://www.primetvnashville.com",
  }
};

// 📱 OPTIMIZACIÓN DE VIEWPORT (Next.js App Router Standard)
// No maximumScale: pinch-to-zoom must stay available (WCAG 1.4.4).
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E50914",
};

export default function HomePage() {
  // 🗺️ JSON-LD SCHEMA MARKUP PARA SEO LOCAL
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "PrimeTvNashville",
    "image": "https://www.primetvnashville.com/opengraph-image",
    "@id": "https://www.primetvnashville.com",
    "url": "https://www.primetvnashville.com",
    "telephone": "+1-615-669-0251",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nashville",
      "addressRegion": "TN",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 36.1627, // Coordenadas centrales de Nashville
      "longitude": -86.7816
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    }
  };

  return (
    <>
      {/* Inyección segura del Schema Markup para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* The order follows the visitor's questions: what and how much,
          how it works, proof, what else, where, doubts, then the quote. The
          site's <main> wraps this, so this is a plain container. */}
      <div className="flex w-full flex-col overflow-hidden bg-white">
        <HeroSection />
        <ServicesSection />
        <PricingSection />
        <BookingSteps />
        <GallerySection />
        <WhyChooseSection />
        <MoreThanTVSection />
        <CoverageMap />
        <InternalLinksHub />
        <FaqsSection />
        <QuickQuoteForm />
      </div>
    </>
  );
}