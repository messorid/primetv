"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center px-4 gap-12 text-center">
        
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight">
            Expert TV Mounting Services
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Safe and professional installation for homes and businesses in Nashville
          </p>
          <div className="mt-6">
            <a
              href="#quote"
              className="inline-block bg-[#e50914] text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Get a Free Quote
            </a>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 flex justify-center"
        >
          <div className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px]">
            <Image
              src="/images/tvinstallation.jpg"
              alt="TV installation preview"
              width={500}
              height={400}
              className="rounded-xl shadow-xl object-contain w-full h-auto"
              priority
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
