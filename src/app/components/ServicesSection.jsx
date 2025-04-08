"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const services = [
  {
    title: "TV Wall Mounting",
    description: "Flat, tilt and full motion mounting on all wall types",
    icon: "/icons/tv-mount.svg"
  },
  {
    title: "Wire Concealment",
    description: "No visible cables, only clean and professional look",
    icon: "/icons/wire-conceal.svg"
  },
  {
    title: "Commercial Installations",
    description: "Offices, lobbies and entertainment areas ready to go",
    icon: "/icons/commercial.svg"
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-12"
        >
          Our Services
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white text-black rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all"
            >
              <div className="mb-4 flex justify-center">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-700">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
