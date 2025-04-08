"use client"

import { motion } from "framer-motion"


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

export default function PricingSection() {
  return (
    <section className="bg-white text-black py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Transparent Pricing
        </motion.h2>
        <p className="text-gray-600 mb-12">
          No hidden fees. Clear rates based on screen size and installation type.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-bold mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-4">{option.description}</p>
              <div className="text-3xl font-extrabold text-[#e50914]">{option.price}</div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  )
}
