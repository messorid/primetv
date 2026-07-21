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
  title: "TV Mounting in Spring Hill TN | PrimeTvNashville",
  description: "Professional TV mounting in Spring Hill, TN. Secure wall mounting, cable concealment and fireplace TV installs for homes and businesses. Same-day available.",
  keywords: ["TV mounting Spring Hill TN", "TV installation Spring Hill", "TV mount Spring Hill Tennessee", "TV wall mount Spring Hill"],
  openGraph: {
    title: "TV Mounting Spring Hill TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Spring Hill Tennessee. Same-day availability.",
    url: "https://www.primetvnashville.com/tv-mounting-spring-hill",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://www.primetvnashville.com/opengraph-image", width: 1200, height: 630, alt: "TV wall mounting service in Spring Hill Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/tv-mounting-spring-hill" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingSpringHillPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TV Mounting in Spring Hill, TN",
    "serviceType": "TV Mounting",
    "description": "Professional TV mounting and installation services in Spring Hill, Tennessee.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.primetvnashville.com",
      "name": "PrimeTvNashville",
      "url": "https://www.primetvnashville.com",
      "telephone": "+1-615-669-0251"
    },
    "areaServed": {
      "@type": "City",
      "name": "Spring Hill",
      "sameAs": "https://en.wikipedia.org/wiki/Spring_Hill,_Tennessee"
    },
    "url": "https://www.primetvnashville.com/tv-mounting-spring-hill"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroReusable
        hiddenTitle="TV Mounting Spring Hill Tennessee"
        title="Professional TV Mounting in Spring Hill TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in Spring Hill."
      />
      <WhyChooseSection />
      <LocalCitySection city="spring-hill" />
      <ServicesSection />
      <PricingSection />
      <BookingSteps />
      <CoverageMap />
      <QuickQuoteForm />
      <CityFaqSection city="spring-hill" />
      <FaqsSection />
      <StickyActionBar />
    </>
  );
}
