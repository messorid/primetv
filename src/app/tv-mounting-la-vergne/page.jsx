import ServicesSection from "../components/ServicesSection";
import PricingSection from "../components/PricingSection";
import BookingSteps from "../components/BookingSteps";
import CoverageMap from "../components/CoverageMap";
import WhyChooseSection from "../components/WhyChooseSection";
import QuickQuoteForm from "../components/QuickQuoteForm";
import FaqsSection from "../components/FaqsSection";
import StickyActionBar from "../components/StickyActionBar";
import HeroReusable from "../components/HeroReusable";

export const metadata = {
  title: "TV Mounting in La Vergne TN | Professional TV Installation",
  description: "Professional TV mounting and installation services in La Vergne, Tennessee. Secure wall mounting, cable concealment and fireplace TV installation for homes and businesses.",
  keywords: ["TV mounting La Vergne TN", "TV installation La Vergne", "TV mount La Vergne Tennessee", "TV wall mount La Vergne"],
  openGraph: {
    title: "TV Mounting La Vergne TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in La Vergne Tennessee. Same-day availability.",
    url: "https://primetvnashville.com/tv-mounting-la-vergne",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://primetvnashville.com/og-image.jpg", width: 1200, height: 630, alt: "TV wall mounting service in La Vergne Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://primetvnashville.com/tv-mounting-la-vergne" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingLaVergnePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "PrimeTvNashville",
    "image": "https://primetvnashville.com/og-image.jpg",
    "@id": "https://primetvnashville.com",
    "url": "https://primetvnashville.com/tv-mounting-la-vergne",
    "telephone": "+1-615-208-7089",
    "priceRange": "$$",
    "description": "Professional TV mounting and installation services in La Vergne, Tennessee.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "La Vergne",
      "addressRegion": "TN",
      "addressCountry": "US"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 36.0151, "longitude": -86.5819 },
    "areaServed": { "@type": "City", "name": "La Vergne", "sameAs": "https://en.wikipedia.org/wiki/La_Vergne,_Tennessee" },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "TV Mounting Services in La Vergne",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Standard TV Mounting" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Fireplace TV Mounting" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cable Concealment" } }
      ]
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroReusable
        hiddenTitle="TV Mounting La Vergne Tennessee"
        title="Professional TV Mounting in La Vergne TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in La Vergne."
      />
      <WhyChooseSection />
      <ServicesSection />
      <PricingSection />
      <BookingSteps />
      <CoverageMap />
      <QuickQuoteForm />
      <FaqsSection />
      <StickyActionBar />
    </>
  );
}
