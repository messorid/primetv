"use client"

import { motion } from "framer-motion"

const faqs = [
  {
    question: "How long does a standard installation take?",
    answer: "Most installations take between 1 to 2 hours depending on complexity."
  },
  {
    question: "Do you provide the mounting bracket?",
    answer: "We can provide brackets for an additional cost or install yours."
  },
  {
    question: "Do you mount TVs on brick or concrete walls?",
    answer: "Yes, we are equipped for all wall types including brick and concrete."
  }
]

export default function FaqSection() {
  return (
    <section className="bg-white text-black py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="space-y-8">
          {faqs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border-b border-gray-200 pb-6"
            >
              <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
              <p className="text-gray-700">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
