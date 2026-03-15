import ContactUI from "./ContactUI"

// 📝 OPTIMIZACIÓN SEO Y METADATOS
export const metadata = {
  title: "Contact PrimeTvNashville | Book Your TV Mounting Today",
  description: "Reach out to PrimeTvNashville for professional TV installation services in Nashville TN. Call us, send an email, or schedule your appointment online today.",
  keywords: ["Contact PrimeTvNashville", "book TV mounting Nashville", "TV installation contact", "Nashville TV installers phone number"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact PrimeTvNashville | Expert TV Mounting",
    description: "Get in touch with our team for expert TV mounting and cable concealment in Nashville, TN.",
    url: "https://primetvnashville.com/contact",
    siteName: "PrimeTvNashville",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://primetvnashville.com/contact",
  }
}

export default function ContactPage() {
  // 🗺️ JSON-LD: Define esta página específicamente como una página de contacto
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "PrimeTvNashville",
      "telephone": "+1-615-208-7089",
      "email": "info@primetvnashville.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nashville",
        "addressRegion": "TN",
        "addressCountry": "US"
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Contenedor semántico que renderiza la UI del cliente */}
      <main className="flex min-h-screen flex-col bg-gray-50/50">
        <ContactUI />
      </main>
    </>
  )
}