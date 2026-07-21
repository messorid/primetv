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
  title: "TV Mounting in Franklin TN | PrimeTvNashville",
  description: "Professional TV mounting in Franklin, TN. Secure wall mounting, cable concealment and fireplace TV installs for homes and businesses. Same-day available.",
  keywords: ["TV mounting Franklin TN", "TV installation Franklin", "TV mount Franklin Tennessee", "TV wall mount Franklin"],
  openGraph: {
    title: "TV Mounting Franklin TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Franklin Tennessee. Same-day availability.",
    url: "https://www.primetvnashville.com/tv-mounting-franklin",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://www.primetvnashville.com/opengraph-image", width: 1200, height: 630, alt: "TV wall mounting service in Franklin Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/tv-mounting-franklin" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingFranklinPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TV Mounting in Franklin, TN",
    "serviceType": "TV Mounting",
    "description": "Professional TV mounting and installation services in Franklin, Tennessee.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.primetvnashville.com",
      "name": "PrimeTvNashville",
      "url": "https://www.primetvnashville.com",
      "telephone": "+1-615-669-0251"
    },
    "areaServed": {
      "@type": "City",
      "name": "Franklin",
      "sameAs": "https://en.wikipedia.org/wiki/Franklin,_Tennessee"
    },
    "url": "https://www.primetvnashville.com/tv-mounting-franklin"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroReusable
        hiddenTitle="TV Mounting Franklin Tennessee"
        title="Professional TV Mounting in Franklin TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in Franklin."
      />
      <WhyChooseSection />
      <LocalCitySection city="franklin" />
      <ServicesSection />
      <PricingSection />
      <BookingSteps />
      <CoverageMap />
      <QuickQuoteForm />
      <CityFaqSection city="franklin" />
      <FaqsSection />
      <StickyActionBar />
    </>
  );
}
