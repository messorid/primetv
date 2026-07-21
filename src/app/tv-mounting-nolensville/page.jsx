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
  title: "TV Mounting in Nolensville TN | PrimeTvNashville",
  description: "Professional TV mounting in Nolensville, TN. Secure wall mounting, cable concealment and fireplace TV installs for homes and businesses. Same-day available.",
  keywords: ["TV mounting Nolensville TN", "TV installation Nolensville", "TV mount Nolensville Tennessee", "TV wall mount Nolensville"],
  openGraph: {
    title: "TV Mounting Nolensville TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Nolensville Tennessee. Same-day availability.",
    url: "https://www.primetvnashville.com/tv-mounting-nolensville",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://www.primetvnashville.com/opengraph-image", width: 1200, height: 630, alt: "TV wall mounting service in Nolensville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/tv-mounting-nolensville" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingNolensvillePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TV Mounting in Nolensville, TN",
    "serviceType": "TV Mounting",
    "description": "Professional TV mounting and installation services in Nolensville, Tennessee.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.primetvnashville.com",
      "name": "PrimeTvNashville",
      "url": "https://www.primetvnashville.com",
      "telephone": "+1-615-669-0251"
    },
    "areaServed": {
      "@type": "City",
      "name": "Nolensville",
      "sameAs": "https://en.wikipedia.org/wiki/Nolensville,_Tennessee"
    },
    "url": "https://www.primetvnashville.com/tv-mounting-nolensville"
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
      <LocalCitySection city="nolensville" />
      <ServicesSection />
      <PricingSection />
      <BookingSteps />
      <CoverageMap />
      <QuickQuoteForm />
      <CityFaqSection city="nolensville" />
      <FaqsSection />
      <StickyActionBar />
    </>
  );
}
