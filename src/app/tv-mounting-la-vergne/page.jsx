import ServicesSection from "../components/ServicesSection";
import PricingSection from "../components/PricingSection";
import BookingSteps from "../components/BookingSteps";
import CoverageMap from "../components/CoverageMap";
import WhyChooseSection from "../components/WhyChooseSection";
import QuickQuoteForm from "../components/QuickQuoteForm";
import FaqsSection from "../components/FaqsSection";
import StickyActionBar from "../components/StickyActionBar";
import HeroReusable from "../components/HeroReusable"
import LocalCitySection from "../components/LocalCitySection"
import CityFaqSection from "../components/CityFaqSection";

export const metadata = {
  title: "TV Mounting in La Vergne TN | PrimeTvNashville",
  description: "Professional TV mounting in La Vergne, TN. Secure wall mounting, cable concealment and fireplace TV installs for homes and businesses. Same-day available.",
  keywords: ["TV mounting La Vergne TN", "TV installation La Vergne", "TV mount La Vergne Tennessee", "TV wall mount La Vergne"],
  openGraph: {
    title: "TV Mounting La Vergne TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in La Vergne Tennessee. Same-day availability.",
    url: "https://www.primetvnashville.com/tv-mounting-la-vergne",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://www.primetvnashville.com/opengraph-image", width: 1200, height: 630, alt: "TV wall mounting service in La Vergne Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/tv-mounting-la-vergne" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingLaVergnePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TV Mounting in La Vergne, TN",
    "serviceType": "TV Mounting",
    "description": "Professional TV mounting and installation services in La Vergne, Tennessee.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.primetvnashville.com",
      "name": "PrimeTvNashville",
      "url": "https://www.primetvnashville.com",
      "telephone": "+1-615-669-0251"
    },
    "areaServed": {
      "@type": "City",
      "name": "La Vergne",
      "sameAs": "https://en.wikipedia.org/wiki/La_Vergne,_Tennessee"
    },
    "url": "https://www.primetvnashville.com/tv-mounting-la-vergne"
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
      <LocalCitySection city="la-vergne" />
      <ServicesSection />
      <PricingSection />
      <BookingSteps />
      <CoverageMap />
      <QuickQuoteForm />
      <CityFaqSection city="la-vergne" />
      <FaqsSection />
      <StickyActionBar />
    </>
  );
}
