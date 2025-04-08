export const metadata = {
    title: "Contact PrimeTvNashville | Book Your TV Mounting Today",
    description:
      "Reach out to PrimeTvNashville for professional TV installation services in Nashville TN. Call us or send a message to schedule your appointment.",
    openGraph: {
      title: "Contact PrimeTvNashville",
      description: "Get in touch with our team for expert TV mounting in Nashville",
      url: "https://primetvnashville.com/contact",
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website"
    },
    alternates: {
      canonical: "https://primetvnashville.com/contact"
    }
  }
  
  export default function ContactPage() {
    return (
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Contact Us</h1>
          <p className="text-gray-700 mb-10">
            Have questions or ready to book? Reach out and we will respond as soon as possible.
          </p>
  
          <div className="bg-gray-100 rounded-2xl shadow-md p-6 md:p-10 space-y-6 text-left">
            <div className="hover:bg-gray-200 transition rounded-lg p-4">
              <p className="text-sm text-gray-500">Email</p>
              <a
                href="mailto:info@primetvnashville.com"
                className="text-lg font-semibold text-black hover:text-[#e50914] block"
              >
                info@primetvnashville.com
              </a>
            </div>
  
            <div className="hover:bg-gray-200 transition rounded-lg p-4">
              <p className="text-sm text-gray-500">Phone</p>
              <a
                href="tel:+16152087089"
                className="text-lg font-semibold text-black hover:text-[#e50914] block"
              >
                +1 615-208-7089
              </a>
            </div>
  
            <div className="hover:bg-gray-200 transition rounded-lg p-4">
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-lg font-semibold text-black">Nashville, Tennessee</p>
            </div>
          </div>
        </div>
      </section>
    )
  }
  