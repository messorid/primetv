import HeroReusable from "../components/HeroReusable"
import ServicesSection from "../components/ServicesSection"
import WhyChooseSection from "../components/WhyChooseSection"
import QuickQuoteForm from "../components/QuickQuoteForm"
import CoverageMap from "../components/CoverageMap"
import FaqsSection from "../components/FaqsSection"
import StickyActionBar from "../components/StickyActionBar"

export const metadata = {
  title: "Soundbar Installation in Nashville TN | PrimeTvNashville",
  description:
    "Professional soundbar installation in Nashville Tennessee. Secure mounting, perfect alignment and clean cable concealment for your home theater system.",
  openGraph: {
    title: "Soundbar Installation Nashville TN",
    description:
      "Professional soundbar mounting and setup services in Nashville Tennessee.",
    url: "https://primetvnashville.com/soundbar-installation-nashville",
    siteName: "PrimeTvNashville",
    images: [
      {
        url: "https://primetvnashville.com/og-soundbar.jpg",
        width: 1200,
        height: 630,
        alt: "Soundbar installation service in Nashville"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  alternates: {
    canonical: "https://primetvnashville.com/soundbar-installation-nashville"
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
}

export default function SoundbarInstallationPage() {
  return (
    <>
      <HeroReusable
        hiddenTitle="Professional Soundbar Installation in Nashville TN"
        title="Soundbar Installation in Nashville"
        subtitle="Professional mounting and setup for the best home theater sound experience."
        image="/images/homet.webp"
        imageAlt="Soundbar installation in Nashville Tennessee"
      />

      <ServicesSection />

      <WhyChooseSection />

      <QuickQuoteForm />

      <CoverageMap />

      <FaqsSection />

      <StickyActionBar />
    </>
  )
}
