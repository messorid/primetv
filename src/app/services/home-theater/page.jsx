export const metadata = {
    title: "Home Theater Setup in Nashville | PrimeTvNashville",
    description:
      "Complete home theater and AV setup solutions in Nashville TN. Displays, speakers, PA systems and immersive entertainment installations.",
    openGraph: {
      title: "Home Theater Installation in Nashville",
      description:
        "Create your dream media room with our home theater setup services. We install projectors, speakers, and displays for homes and businesses.",
      url: "https://primetvnashville.com/services/home-theater",
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website"
    },
    alternates: {
      canonical: "https://primetvnashville.com/services/home-theater"
    }
  }
  
  export default function HomeTheaterPage() {
    return (
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
  
            <img
              src="/gallery/homet.webp"
              alt="Home theater installation in Nashville"
              className="rounded-xl shadow-lg mt-4 w-full object-cover"
            />
          </div>
        </div>
      </section>
    )
  }
  