import Image from "next/image"
import Link from "next/link"
import { photoSet } from "../../lib/photos"

const THEATER_PHOTOS = photoSet(
  "theaterSeating",
  "theaterTvShelves",
  "theaterAvRack",
  "theaterTvSurround",
  "posterWall",
  "theaterCenterChannel",
  "theaterInWallSpeakers",
  "theaterFloatingShelves",
)

export const metadata = {
    title: "Home Theater Setup in Nashville | PrimeTvNashville",
    description:
      "Complete home theater and AV setup solutions in Nashville TN. Displays, speakers, PA systems and immersive entertainment installations.",
    keywords: ["home theater setup Nashville", "home theater installation Nashville TN", "AV installation Nashville", "media room setup Nashville", "surround sound installation Nashville"],
    openGraph: {
      title: "Home Theater Installation in Nashville",
      description:
        "Create your dream media room with our home theater setup services. We install projectors, speakers, and displays for homes and businesses.",
      url: "https://www.primetvnashville.com/services/home-theater",
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website"
    },
    alternates: {
      canonical: "https://www.primetvnashville.com/services/home-theater"
    }
  }
  
  export default function HomeTheaterPage() {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Home Theater Setup Service",
      "description": "Complete home theater and AV setup solutions in Nashville TN. Displays, speakers, PA systems and immersive entertainment installations.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "PrimeTvNashville",
        "telephone": "+1-615-669-0251",
        "url": "https://www.primetvnashville.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Nashville",
          "addressRegion": "TN",
          "addressCountry": "US"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "Nashville",
        "sameAs": "https://en.wikipedia.org/wiki/Nashville,_Tennessee"
      },
      "serviceType": "Home Theater Installation",
      "url": "https://www.primetvnashville.com/services/home-theater"
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gray-100 p-8 rounded-3xl shadow-md space-y-6">
            <h1 className="text-4xl font-bold text-black border-l-4 border-[#e50914] pl-4">
              Home Theater Setup
            </h1>
  
            <p className="text-gray-700 text-lg">
              Transform your space into a cinema-like experience with our professional home theater services. From cozy living rooms to full media rooms, we customize everything to fit your space.
            </p>
  
            <p className="text-gray-700">
              Our team installs projectors, large displays, and sound systems with precision. We also calibrate audio for optimal acoustics and speaker placement.
            </p>
  
            <p className="text-gray-700">
              Whether you are setting up a system for movies, music, or presentations, we make sure the setup is both immersive and clean. All wiring is carefully managed for a flawless finish.
            </p>
  
            {/* next/image so the full-size photo is not shipped to a phone */}
            <div className="relative mt-4 w-full aspect-[16/9] overflow-hidden rounded-xl shadow-lg">
              <Image
                src="/images/hometheater/home-theater-led-accent-lighting-theater-seating-nashville.jpeg"
                alt="Home theater room with leather recliners, LED floor lighting and backlit framed movie posters, Nashville TN"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* OUR WORK */}
      <section className="bg-gray-50 py-16 border-t border-black/[0.06]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-black mb-2">
            Home Theaters We Have Built
          </h2>
          <p className="text-black/60 mb-8 text-sm max-w-2xl leading-relaxed">
            Dedicated theater rooms and media walls across Nashville and Middle Tennessee —
            tiered seating, surround speakers set and levelled, accent lighting, poster walls,
            and every cable out of sight.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEATER_PHOTOS.map(p => (
              <figure
                key={p.src}
                className={`relative overflow-hidden rounded-2xl border border-black/10 bg-gray-100 ${
                  p.tall ? "aspect-[3/4]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </figure>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full bg-[#E50914] px-8 py-4 font-bold text-white hover:bg-red-700 transition"
            >
              Book a Home Theater Setup
            </Link>
            <a
              href="tel:+16156690251"
              className="inline-flex items-center justify-center rounded-full border-2 border-black/10 px-8 py-4 font-bold text-black hover:bg-black/5 transition"
            >
              Call (615) 669-0251
            </a>
          </div>
        </div>
      </section>
      </>
    )
  }
