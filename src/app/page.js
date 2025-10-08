import FaqsSection from "./components/FaqsSection";
import HeroSection from "./components/HeroSection";
import PricingSection from "./components/PricingSection";
import ServicesSection from "./components/ServicesSection";
import BookingSteps from "./components/BookingSteps";
import StickyActionBar from "./components/StickyActionBar";
import CoverageMap from "./components/CoverageMap";
import WhyChooseSection from "./components/WhyChooseSection";
import QuickQuoteForm from "./components/QuickQuoteForm";

export const metadata = {
  title: "PrimeTvNashville | Professional TV Mounting in Nashville TN",
  description:
    "Reliable and expert TV installation services for homes and businesses in Nashville. Flat screen mounting, concealed wiring and commercial setups.",
  openGraph: {
    title: "PrimeTvNashville",
    description: "TV Wall Mounting and Installation Experts in Nashville Tennessee",
    url: "https://primetvnashville.com",
    siteName: "PrimeTvNashville",
    images: [
      {
        url: "https://primetvnashville.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TV wall mounting by PrimeTvNashville"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  alternates: {
    canonical: "https://primetvnashville.com"
  }
}

// ✅ Export separado:
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
}

export default function HomePage() {
  return (
    <>
   
      <HeroSection/>
      <ServicesSection/>
      <PricingSection/>
      <BookingSteps/>
      <WhyChooseSection/>
      <CoverageMap/>
      <QuickQuoteForm/>
      <FaqsSection/>
      <StickyActionBar/>
    </>
  );
}