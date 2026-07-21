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
  title: "TV Mounting in Smyrna TN | PrimeTvNashville",
  description: "Professional TV mounting in Smyrna, TN. Secure wall mounting, cable concealment and fireplace TV installs for homes and businesses. Same-day available.",
  keywords: ["TV mounting Smyrna TN", "TV installation Smyrna", "TV mount Smyrna Tennessee", "TV wall mount Smyrna"],
  openGraph: {
    title: "TV Mounting Smyrna TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Smyrna Tennessee. Same-day availability.",
    url: "https://www.primetvnashville.com/tv-mounting-smyrna",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://www.primetvnashville.com/opengraph-image", width: 1200, height: 630, alt: "TV wall mounting service in Smyrna Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/tv-mounting-smyrna" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingSmyrnaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TV Mounting in Smyrna, TN",
    "serviceType": "TV Mounting",
    "description": "Professional TV mounting and installation services in Smyrna, Tennessee.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.primetvnashville.com",
      "name": "PrimeTvNashville",
      "url": "https://www.primetvnashville.com",
      "telephone": "+1-615-669-0251"
    },
    "areaServed": {
      "@type": "City",
      "name": "Smyrna",
      "sameAs": "https://en.wikipedia.org/wiki/Smyrna,_Tennessee"
    },
    "url": "https://www.primetvnashville.com/tv-mounting-smyrna"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroReusable
        hiddenTitle="TV Mounting Smyrna Tennessee"
        title="Professional TV Mounting in Smyrna TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in Smyrna."
      />
      <WhyChooseSection />
      <LocalCitySection city="smyrna" />
      <ServicesSection />
      <PricingSection />
      <BookingSteps />
      <CoverageMap />
      <QuickQuoteForm />
      <CityFaqSection city="smyrna" />
      <FaqsSection />
      <StickyActionBar />
    </>
  );
}
