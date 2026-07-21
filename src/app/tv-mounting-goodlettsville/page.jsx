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
  title: "TV Mounting Goodlettsville TN | PrimeTvNashville",
  description: "Professional TV mounting in Goodlettsville, TN. Secure wall mounting, cable concealment and fireplace TV installs for homes and businesses. Same-day available.",
  keywords: ["TV mounting Goodlettsville TN", "TV installation Goodlettsville", "TV mount Goodlettsville Tennessee", "TV wall mount Goodlettsville"],
  openGraph: {
    title: "TV Mounting Goodlettsville TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Goodlettsville Tennessee. Same-day availability.",
    url: "https://www.primetvnashville.com/tv-mounting-goodlettsville",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://www.primetvnashville.com/opengraph-image", width: 1200, height: 630, alt: "TV wall mounting service in Goodlettsville Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/tv-mounting-goodlettsville" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingGoodlettsvillePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TV Mounting in Goodlettsville, TN",
    "serviceType": "TV Mounting",
    "description": "Professional TV mounting and installation services in Goodlettsville, Tennessee.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.primetvnashville.com",
      "name": "PrimeTvNashville",
      "url": "https://www.primetvnashville.com",
      "telephone": "+1-615-669-0251"
    },
    "areaServed": {
      "@type": "City",
      "name": "Goodlettsville",
      "sameAs": "https://en.wikipedia.org/wiki/Goodlettsville,_Tennessee"
    },
    "url": "https://www.primetvnashville.com/tv-mounting-goodlettsville"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroReusable
        hiddenTitle="TV Mounting Goodlettsville Tennessee"
        title="Professional TV Mounting in Goodlettsville TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in Goodlettsville."
      />
      <WhyChooseSection />
      <LocalCitySection city="goodlettsville" />
      <ServicesSection />
      <PricingSection />
      <BookingSteps />
      <CoverageMap />
      <QuickQuoteForm />
      <CityFaqSection city="goodlettsville" />
      <FaqsSection />
      <StickyActionBar />
    </>
  );
}
