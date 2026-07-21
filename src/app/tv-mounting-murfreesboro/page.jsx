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
  title: "TV Mounting in Murfreesboro TN | PrimeTvNashville",
  description: "Professional TV mounting in Murfreesboro, TN. Secure wall mounting, cable concealment and fireplace TV installs for homes and businesses. Same-day available.",
  keywords: ["TV mounting Murfreesboro TN", "TV installation Murfreesboro", "TV mount Murfreesboro Tennessee", "TV wall mount Murfreesboro"],
  openGraph: {
    title: "TV Mounting Murfreesboro TN | PrimeTvNashville",
    description: "Professional TV installation and wall mounting services in Murfreesboro Tennessee. Same-day availability.",
    url: "https://www.primetvnashville.com/tv-mounting-murfreesboro",
    siteName: "PrimeTvNashville",
    images: [{ url: "https://www.primetvnashville.com/opengraph-image", width: 1200, height: 630, alt: "TV wall mounting service in Murfreesboro Tennessee" }],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://www.primetvnashville.com/tv-mounting-murfreesboro" },
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function TvMountingMurfreesboroPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TV Mounting in Murfreesboro, TN",
    "serviceType": "TV Mounting",
    "description": "Professional TV mounting and installation services in Murfreesboro, Tennessee.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.primetvnashville.com",
      "name": "PrimeTvNashville",
      "url": "https://www.primetvnashville.com",
      "telephone": "+1-615-669-0251"
    },
    "areaServed": {
      "@type": "City",
      "name": "Murfreesboro",
      "sameAs": "https://en.wikipedia.org/wiki/Murfreesboro,_Tennessee"
    },
    "url": "https://www.primetvnashville.com/tv-mounting-murfreesboro"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroReusable
        hiddenTitle="TV Mounting Murfreesboro Tennessee"
        title="Professional TV Mounting in Murfreesboro TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses in Murfreesboro."
      />
      <WhyChooseSection />
      <LocalCitySection city="murfreesboro" />
      <ServicesSection />
      <PricingSection />
      <BookingSteps />
      <CoverageMap />
      <QuickQuoteForm />
      <CityFaqSection city="murfreesboro" />
      <FaqsSection />
      <StickyActionBar />
    </>
  );
}
