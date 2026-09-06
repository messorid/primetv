export default function ExtraServices() {
    const extras = [
      {
        title: "Above Fireplace Mounting",
        price: "$30",
        note: "Add this service to any TV mounting."
      },
      {
        title: "Cable Management and Concealment",
        price: "$60",
        note: "Includes in-wall or external solutions."
      },
      {
        title: "Home Theater Installations",
        price: "Price by Quote",
        note: "Add-on for full AV setup and speaker placement."
      },
      {
        title: "Smart TV Configuration",
        price: "$50",
        note: "Setup and optimization of smart features."
      }
    ]
  
    return (
      <div className="mt-20 text-left">
        <h2 className="text-2xl font-bold text-black mb-2 text-center">Extra Services</h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-2xl mx-auto">
          Prices are approximate and may vary depending on your setup. Your final price is
          confirmed by one of our sales representatives.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {extras.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 border border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-black mb-1">{item.title}</h3>
              <p className="text-[#e50914] text-xl font-bold">{item.price}</p>
              <p className="text-sm text-gray-600 mt-2">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  