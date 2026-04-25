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
  title: "TV Mounting in Lebanon TN | Professional TV Installation",
  description: "Professional TV mounting and installation services in Lebanon, Tennessee. Secure wall mounting, cable concealment and fireplace TV installation for homes and businesses.",
  keywords: ["TV mounting Lebanon TN", "TV installation Lebanon", "TV mount Lebanon Tennessee", "TV wall mount Lebanon"],
  openGraph: {
    title: "TV Mounting Lebanon TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Lebanon Tennessee. Same-day availability.",
    url: "https://primetvnashville.com/tv-mounting-lebanon",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://primetvnashville.com/og-image.jpg", width: 1200, height: 630, alt: "TV wall mounting service in Lebanon Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://primetvnashville.com/tv-mounting-lebanon" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingLebanonPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "PrimeTvNashville",
    "image": "https://primetvnashville.com/og-image.jpg",
    "@id": "https://primetvnashville.com",
    "url": "https://primetvnashville.com/tv-mounting-lebanon",
    "telephone": "+1-615-208-7089",
    "priceRange": "$$",
    "description": "Professional TV mounting and installation services in Lebanon, Tennessee.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lebanon",
      "addressRegion": "TN",
      "addressCountry": "US"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 36.2081, "longitude": -86.2911 },
    "areaServed": { "@type": "City", "name": "Lebanon", "sameAs": "https://en.wikipedia.org/wiki/Lebanon,_Tennessee" },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "TV Mounting Services in Lebanon",
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
        hiddenTitle="TV Mounting Lebanon Tennessee"
        title="Professional TV Mounting in Lebanon TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in Lebanon."
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
