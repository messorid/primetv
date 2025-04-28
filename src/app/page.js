import CallToAction from "./components/CallToAction";
import FaqSection from "./components/FaqSection";
import GallerySection from "./components/GallerySection";
import HeroSection from "./components/HeroSection";
import LatestFromBlog from "./components/LatestFromBlog";
import PricingSection from "./components/PricingSection";
import QuoteWizardTv from "./components/QuoteWizardTv";
import ServicesSection from "./components/ServicesSection";
import StatsSection from "./components/StatsSection";
import Head from 'next/head';
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
             <Head>
             <meta name="google-site-verification" content="E_DbrqHnpwKIHqd4_aVA1ohaNJGsYZ7XDZaHCbY_OOk" />
         </Head>
    
      <HeroSection/>
      <StatsSection/>
      <QuoteWizardTv/>
      <ServicesSection/>
      <PricingSection/>
      <LatestFromBlog/>
      <GallerySection/>
      <FaqSection/>
      <CallToAction/>

    </>
  );
}