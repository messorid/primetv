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
  title: "TV Mounting in Hendersonville TN | Professional TV Installation",
  description: "Professional TV mounting and installation services in Hendersonville, Tennessee. Secure wall mounting, cable concealment and fireplace TV installation for homes and businesses.",
  keywords: ["TV mounting Hendersonville TN", "TV installation Hendersonville", "TV mount Hendersonville Tennessee", "TV wall mount Hendersonville"],
  openGraph: {
    title: "TV Mounting Hendersonville TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Hendersonville Tennessee. Same-day availability.",
    url: "https://primetvnashville.com/tv-mounting-hendersonville",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://primetvnashville.com/og-image.jpg", width: 1200, height: 630, alt: "TV wall mounting service in Hendersonville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://primetvnashville.com/tv-mounting-hendersonville" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingHendersonvillePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "PrimeTvNashville",
    "image": "https://primetvnashville.com/og-image.jpg",
    "@id": "https://primetvnashville.com",
    "url": "https://primetvnashville.com/tv-mounting-hendersonville",
    "telephone": "+1-615-208-7089",
    "priceRange": "$$",
    "description": "Professional TV mounting and installation services in Hendersonville, Tennessee.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hendersonville",
      "addressRegion": "TN",
      "addressCountry": "US"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 36.3048, "longitude": -86.6197 },
    "areaServed": { "@type": "City", "name": "Hendersonville", "sameAs": "https://en.wikipedia.org/wiki/Hendersonville,_Tennessee" },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "TV Mounting Services in Hendersonville",
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
        hiddenTitle="TV Mounting Hendersonville Tennessee"
        title="Professional TV Mounting in Hendersonville TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in Hendersonville."
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
