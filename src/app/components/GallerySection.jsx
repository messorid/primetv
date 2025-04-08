"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const images = [
  "/gallery/tv1.jpeg",
  "/gallery/tv2.jpeg",
  "/gallery/tv3.jpeg",
  "/gallery/tv4.jpeg",
  "/gallery/tv5.jpg",
]

export default function GallerySection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-black"
        >
          Our Work in Action
        </motion.h2>
        <p className="text-gray-600 mb-12">
          A few examples of completed installations for our happy clients
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="overflow-hidden rounded-xl shadow hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <Image
                src={src}
                alt={`TV installation ${index + 1}`}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
