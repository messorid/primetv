export const metadata = {
    title: "Our Services | PrimeTvNashville",
    description:
      "Explore our professional TV mounting and home theater setup services in Nashville TN. Clean installations, aesthetic integration and expert AV solutions.",
    openGraph: {
      title: "Services - PrimeTvNashville",
      description:
        "We offer TV wall mounting and home theater installations for homes and businesses in Nashville TN. Clean, safe and visually stunning results.",
      url: "https://primetvnashville.com/services",
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website"
    },
    alternates: {
      canonical: "https://primetvnashville.com/services"
    }
  }
  
  import Link from "next/link"
  
  export default function ServicesPage() {
    return (
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 space-y-24">
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Our Services</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide professional solutions tailored to your home or business setup. Clean, safe and aesthetic installations that elevate your space.
            </p>
            <div className="mt-4 h-1 w-24 mx-auto bg-[#e50914] rounded-full" />
          </div>
  
          {/* TV Mounting Section */}
          <div className="bg-gray-50 rounded-3xl p-8 shadow-md">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2 space-y-4">
                <h2 className="text-2xl font-bold text-black border-l-4 border-[#e50914] pl-4">
                  Professional TV Mounting
                </h2>
                <p className="text-gray-700">
                  Our experts provide both wall and stand mounting to meet your specific needs, ensuring your TV is perfectly positioned for the best viewing angle.
                </p>
                <p className="text-gray-700">
                  We specialize in setups that not only work flawlessly but also beautifully complement your decor. All wires are hidden or professionally managed.
                </p>
                <p className="text-gray-700">
                  We use high-quality mounts and test every installation for maximum safety and durability.
                </p>
  
                <Link
                  href="/services/tv-mounting"
                  className="inline-block mt-4 text-[#e50914] font-semibold hover:underline"
                >
                  Learn more →
                </Link>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/gallery/tv1.jpeg"
                  alt="TV mounting service"
                  className="w-full rounded-xl shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
  
          {/* Home Theater Section */}
          <div className="bg-[#fefefe] rounded-3xl p-8 shadow-md border border-gray-200">
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              <div className="md:w-1/2 space-y-4">
                <h2 className="text-2xl font-bold text-black border-l-4 border-[#e50914] pl-4">
                  Home Theater Setup
                </h2>
                <p className="text-gray-700">
                  We provide full AV setup solutions for home theaters, living rooms and commercial environments.
                </p>
                <p className="text-gray-700">
                  From projector installations to audio calibration, our team handles everything with precision to create immersive media experiences.
                </p>
                <p className="text-gray-700">
                  We tailor each setup based on space and acoustic design, ensuring premium results every time.
                </p>
  
                <Link
                  href="/services/home-theater"
                  className="inline-block mt-4 text-[#e50914] font-semibold hover:underline"
                >
                  Learn more →
                </Link>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/gallery/homet.webp"
                  alt="Home theater setup"
                  className="w-full rounded-xl shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
  
        </div>
      </section>
    )
  }
  