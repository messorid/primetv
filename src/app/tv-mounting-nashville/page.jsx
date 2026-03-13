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
  title: "TV Mounting in Nashville TN | Professional TV Installation",
  description:
    "Professional TV mounting services in Nashville Tennessee. Secure wall mounting, cable concealment and fireplace TV installation for homes, apartments and offices.",
  openGraph: {
    title: "TV Mounting Nashville TN | PrimeTvNashville",
    description:
      "Professional TV installation and wall mounting services in Nashville Tennessee.",
    url: "https://primetvnashville.com/tv-mounting-nashville",
    siteName: "PrimeTvNashville",
    images: [
      {
        url: "https://primetvnashville.com/og-tv-mounting.jpg",
        width: 1200,
        height: 630,
        alt: "TV wall mounting service in Nashville Tennessee"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  alternates: {
    canonical: "https://primetvnashville.com/tv-mounting-nashville"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function TvMountingPage() {
  return (
    <>
      <HeroReusable
        title="Professional TV Mounting in Nashville TN"
        subtitle="Safe and secure TV wall mounting with clean cable management for homes and businesses."
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
