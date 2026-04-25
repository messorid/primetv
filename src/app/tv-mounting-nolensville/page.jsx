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
  title: "TV Mounting in Nolensville TN | Professional TV Installation",
  description: "Professional TV mounting and installation services in Nolensville, Tennessee. Secure wall mounting, cable concealment and fireplace TV installation for homes and businesses.",
  keywords: ["TV mounting Nolensville TN", "TV installation Nolensville", "TV mount Nolensville Tennessee", "TV wall mount Nolensville"],
  openGraph: {
    title: "TV Mounting Nolensville TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Nolensville Tennessee. Same-day availability.",
    url: "https://primetvnashville.com/tv-mounting-nolensville",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://primetvnashville.com/og-image.jpg", width: 1200, height: 630, alt: "TV wall mounting service in Nolensville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://primetvnashville.com/tv-mounting-nolensville" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingNolensvillePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "PrimeTvNashville",
    "image": "https://primetvnashville.com/og-image.jpg",
    "@id": "https://primetvnashville.com",
    "url": "https://primetvnashville.com/tv-mounting-nolensville",
    "telephone": "+1-615-208-7089",
    "priceRange": "$$",
    "description": "Professional TV mounting and installation services in Nolensville, Tennessee.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nolensville",
      "addressRegion": "TN",
      "addressCountry": "US"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 35.9523, "longitude": -86.6686 },
    "areaServed": { "@type": "City", "name": "Nolensville", "sameAs": "https://en.wikipedia.org/wiki/Nolensville,_Tennessee" },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "TV Mounting Services in Nolensville",
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
        hiddenTitle="TV Mounting Nolensville Tennessee"
        title="Professional TV Mounting in Nolensville TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in Nolensville."
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
