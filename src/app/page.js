import FaqsSection from "./components/FaqsSection";
import HeroSection from "./components/HeroSection";
import PricingSection from "./components/PricingSection";
import ServicesSection from "./components/ServicesSection";
import BookingSteps from "./components/BookingSteps";
import StickyActionBar from "./components/StickyActionBar";
import CoverageMap from "./components/CoverageMap";
import WhyChooseSection from "./components/WhyChooseSection";
import QuickQuoteForm from "./components/QuickQuoteForm";

// 📝 OPTIMIZACIÓN DE METADATOS PARA SEO Y REDES SOCIALES
export const metadata = {
  title: "Expert TV Mounting in Nashville TN | PrimeTvNashville",
  description: "Reliable and expert TV installation services for homes and businesses in Nashville. Flat screen mounting, concealed wiring, and commercial setups. Book today!",
  keywords: ["TV mounting Nashville", "TV installation TN", "home theater setup", "commercial TV installation", "PrimeTvNashville", "cable concealment"],
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
    url: "https://primetvnashville.com",
    siteName: "PrimeTvNashville",
    images: [
      {
        url: "https://primetvnashville.com/og-image.jpg",
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
    images: ["https://primetvnashville.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://primetvnashville.com",
  }
};

// 📱 OPTIMIZACIÓN DE VIEWPORT (Next.js App Router Standard)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#E50914", // Color sugerido para la barra del navegador en móviles
};

export default function HomePage() {
  // 🗺️ JSON-LD SCHEMA MARKUP PARA SEO LOCAL
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "PrimeTvNashville",
    "image": "https://primetvnashville.com/og-image.jpg",
    "@id": "https://primetvnashville.com",
    "url": "https://primetvnashville.com",
    "telephone": "+1-000-000-0000", // TODO: Actualizar con el número real
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

      {/* Contenedor principal semántico */}
      <main className="flex min-h-screen flex-col w-full overflow-hidden bg-white">
        <HeroSection />
        <ServicesSection />
        <WhyChooseSection />
        <PricingSection />
        <BookingSteps />
        <CoverageMap />
        <QuickQuoteForm />
        <FaqsSection />
      </main>

      {/* Interfaz Global fuera del tag <main> por semántica HTML5 */}
      <StickyActionBar />
    </>
  );
}