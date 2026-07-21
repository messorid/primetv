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
  title: "TV Mounting in Mount Juliet TN | PrimeTvNashville",
  description: "Professional TV mounting in Mount Juliet, TN. Secure wall mounting, cable concealment and fireplace TV installs for homes and businesses. Same-day available.",
  keywords: ["TV mounting Mount Juliet TN", "TV installation Mount Juliet", "TV mount Mount Juliet Tennessee", "TV wall mount Mount Juliet"],
  openGraph: {
    title: "TV Mounting Mount Juliet TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Mount Juliet Tennessee. Same-day availability.",
    url: "https://www.primetvnashville.com/tv-mounting-mount-juliet",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://www.primetvnashville.com/opengraph-image", width: 1200, height: 630, alt: "TV wall mounting service in Mount Juliet Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/tv-mounting-mount-juliet" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingMountJulietPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TV Mounting in Mount Juliet, TN",
    "serviceType": "TV Mounting",
    "description": "Professional TV mounting and installation services in Mount Juliet, Tennessee.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.primetvnashville.com",
      "name": "PrimeTvNashville",
      "url": "https://www.primetvnashville.com",
      "telephone": "+1-615-669-0251"
    },
    "areaServed": {
      "@type": "City",
      "name": "Mount Juliet",
      "sameAs": "https://en.wikipedia.org/wiki/Mount_Juliet,_Tennessee"
    },
    "url": "https://www.primetvnashville.com/tv-mounting-mount-juliet"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroReusable
        hiddenTitle="TV Mounting Mount Juliet Tennessee"
        title="Professional TV Mounting in Mount Juliet TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in Mount Juliet."
      />
      <WhyChooseSection />
      <LocalCitySection city="mount-juliet" />
      <ServicesSection />
      <PricingSection />
      <BookingSteps />
      <CoverageMap />
      <QuickQuoteForm />
      <CityFaqSection city="mount-juliet" />
      <FaqsSection />
      <StickyActionBar />
    </>
  );
}
