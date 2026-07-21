import Image from "next/image"
import CallToAction from "../components/CallToAction"

export const metadata = {
  title: "About PrimeTvNashville | Professional TV Installation in Nashville",
  description:
    "Learn more about PrimeTvNashville, our mission and why we are trusted by hundreds for TV mounting and installation services in Nashville TN.",
  keywords: ["about PrimeTvNashville", "TV mounting company Nashville", "professional TV installers Nashville TN", "local TV installation experts"],
  openGraph: {
    title: "About PrimeTvNashville",
    description: "Get to know the story and commitment behind PrimeTvNashville",
    url: "https://www.primetvnashville.com/about",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website"
  },
  alternates: {
    canonical: "https://www.primetvnashville.com/about"
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PrimeTvNashville",
  "url": "https://www.primetvnashville.com",
  "logo": "https://www.primetvnashville.com/opengraph-image",
  "image": "https://www.primetvnashville.com/opengraph-image",
  "description": "Professional TV mounting and installation company serving Nashville TN and surrounding areas.",
  "telephone": "+1-615-669-0251",
  "email": "info@primetvnashville.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nashville",
    "addressRegion": "TN",
    "addressCountry": "US"
  },
  "areaServed": [
    "Nashville", "Brentwood", "Franklin", "Murfreesboro", "Smyrna",
    "Hendersonville", "Gallatin", "Goodlettsville", "La Vergne",
    "Lebanon", "Mount Juliet", "Nolensville", "Spring Hill"
  ],
  "sameAs": [
    "https://www.facebook.com/primetvnashville",
    "https://www.instagram.com/primetvnashville"
  ]
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        
        {/* Text Section */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-4xl font-bold text-black mb-6">About Us</h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            PrimeTvNashville is a locally trusted company delivering top-tier TV installation services for homes and businesses in Nashville.
            <br /><br />
            With hundreds of successful installations, our team focuses on safety, aesthetics and reliable performance. We specialize in flat screen wall mounting, wire concealment and custom setups.
            <br /><br />
            Our mission is to elevate your space with expert solutions and excellent service. We proudly serve the Nashville community and treat every job with professionalism and care.
          </p>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/primetvnashville.webp"
              alt="TV installation by PrimeTvNashville"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
