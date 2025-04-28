"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function CallToAction() {
  return (
    <section className="bg-black  py-20">
      <div className="max-w-4xl mx-auto px-4 text-center ">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl text-white font-bold mb-4  "
        >
          Trusted TV Installation Services in <span className="text-[#e50914]">Nashville</span>
        </motion.h2>
        <p className="text-white mb-8 text-lg ">
          Join hundreds of satisfied clients. Let us mount your TV with precision and care.
        </p>
        <Link
          href="#quote"
          className="inline-block bg-[#e50914] text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Request a Free Quote
        </Link>
      </div>
    </section>
  )
}
