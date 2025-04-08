"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const stats = [
  {
    label: "Clients Served",
    value: "+300",
    icon: "/icons/clients.svg"
  },
  {
    label: "TVs Installed",
    value: "+600",
    icon: "/icons/tv-installed.ico"
  },
  {
    label: "Reliable Service",
    value: "100%",
    icon: "/icons/trusted.svg"
  }
]

export default function StatsSection() {
  return (
    <section className="bg-gray-50 text-black py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-center">
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="text-3xl font-extrabold text-[#e50914]">{stat.value}</div>
              <p className="text-gray-700 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
