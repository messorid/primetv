import ExtraServices from "../components/ExtraServices"

export const metadata = {
    title: "Pricing | PrimeTvNashville",
    description:
      "Transparent and affordable TV mounting and home theater installation prices in Nashville. View our service rates with no hidden fees.",
    openGraph: {
      title: "Pricing - PrimeTvNashville",
      description:
        "Check our clear pricing for TV wall mounting and AV setups in Nashville TN. Reliable, affordable and professional services.",
      url: "https://primetvnashville.com/pricing",
      siteName: "PrimeTvNashville",
      locale: "en_US",
      type: "website"
    },
    alternates: {
      canonical: "https://primetvnashville.com/pricing"
    }
  }
  
  const pricingOptions = [
    {
      title: "Standard TV Mounting",
      description: "For TVs up to 55 inches",
      price: "$99"
    },
    {
      title: "Installation of 2 Televisions",
      description: "Perfect for setups in different rooms",
      price: "$170"
    },
    {
      title: "Large Screen Mounting",
      description: "For TVs larger than 55 inches",
      price: "$140"
    }
  ]
  
  export default function PricingPage() {
    return (
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Pricing</h1>
          <p className="text-gray-600 mb-12">
            Transparent rates for high-quality installations. No hidden fees.
          </p>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {pricingOptions.map((option, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-bold text-black mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="text-3xl font-extrabold text-[#e50914]">{option.price}</div>
              </div>
            ))}
          </div>
          <ExtraServices />
        </div>
      </section>
    )
  }
  