// JSON-LD builders for the brand, size, OLED and guide pages.
//
// provider always points at the LocalBusiness node the homepage already
// publishes (@id = the site root) rather than re-declaring a second business,
// so Google resolves every Service to the same entity.

import { BASE, CITIES } from "./tvModels"

const PROVIDER = {
  "@type": "HomeAndConstructionBusiness",
  "@id": BASE,
  "name": "PrimeTvNashville",
  "url": BASE,
  "telephone": "+1-615-669-0251",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nashville",
    "addressRegion": "TN",
    "addressCountry": "US",
  },
}

// Every page serves the same footprint, so areaServed is built from one list.
const AREA_SERVED = CITIES.map(c => ({ "@type": "City", "name": c.label }))

export function serviceSchema({ name, description, serviceType, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url,
    "provider": PROVIDER,
    "areaServed": AREA_SERVED,
  }
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  }
}

// trail: [{ name, path }] — Home is prepended automatically.
export function breadcrumbSchema(trail) {
  const items = [{ name: "Home", path: "" }, ...trail]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((t, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": t.name,
      "item": `${BASE}${t.path}`,
    })),
  }
}

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(Array.isArray(data) ? data : [data]) }}
    />
  )
}
