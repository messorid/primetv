export const metadata = {
    title: "TV Wall Mounting Services in Nashville | PrimeTvNashville",
    description:
      "Expert TV wall mounting with secure installation, wire concealment and aesthetic integration. Serving Nashville TN homes and businesses.",
    openGraph: {
      title: "TV Mounting Services in Nashville",
      description:
        "Professional TV installation with secure wall mounting and clean cable concealment. Trusted by hundreds in Nashville TN.",
      url: "https://primetvnashville.com/services/tv-mounting",
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website"
    },
    alternates: {
      canonical: "https://primetvnashville.com/services/tv-mounting"
    }
  }
  
  export default function TvMountingPage() {
    return (
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gray-50 p-8 rounded-3xl shadow-md space-y-6">
            <h1 className="text-4xl font-bold text-black border-l-4 border-[#e50914] pl-4">
              Professional TV Mounting
            </h1>
  
            <p className="text-gray-700 text-lg">
              We provide expert TV wall and stand mounting for all types of rooms. Whether you want your screen above the fireplace, in your bedroom, or inside your commercial space, we guarantee clean and secure installations.
            </p>
  
            <p className="text-gray-700">
              Our service includes aesthetic integration with cable concealment options: in-wall routing when possible, or external decorative solutions when needed. We make sure your space looks polished and professional.
            </p>
  
            <p className="text-gray-700">
              Safety is our top priority. We use high-quality mounting equipment and rigorously test every setup to ensure stability and long-term reliability.
            </p>
  
            <img
              src="/gallery/tv2.jpeg"
              alt="TV wall mounting in Nashville"
              className="rounded-xl shadow-lg mt-4 w-full object-cover"
            />
          </div>
        </div>
      </section>
    )
  }
  