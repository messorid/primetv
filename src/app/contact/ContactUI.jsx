"use client"

import { motion } from "framer-motion"

export default function ContactUI() {
  const contactMethods = [
    {
      title: "Call Us",
      description: "Mon-Sat from 8am to 6pm.",
      value: "+1 615-208-7089",
      href: "tel:+16152087089",
      icon: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      title: "Email Us",
      description: "We usually reply within 2 hours.",
      value: "info@primetvnashville.com",
      href: "mailto:info@primetvnashville.com",
      icon: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Service Area",
      description: "Serving the greater Nashville area.",
      value: "Nashville, Tennessee",
      href: "#", // Puede enlazar a Google Maps
      icon: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ]

  return (
    <section className="relative w-full overflow-hidden px-5 py-20 md:py-32 flex justify-center items-center">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.03),transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        
        {/* Header Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-[#E50914] font-bold tracking-wider uppercase text-sm mb-3 block">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6 text-balance tracking-tight">
            We are here to help
          </h1>
          <p className="text-lg text-black/60 text-balance">
            Have questions about your installation or ready to book? Reach out and our expert team will respond as soon as possible.
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <a 
                href={method.href}
                className="group flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
              >
                <div className="size-14 rounded-full bg-[#E50914]/10 text-[#E50914] flex items-center justify-center mb-6 group-hover:bg-[#E50914] group-hover:text-white transition-colors duration-300">
                  {method.icon}
                </div>
                
                <h3 className="text-xl font-bold text-black mb-2">
                  {method.title}
                </h3>
                
                <p className="text-sm text-black/60 mb-6">
                  {method.description}
                </p>
                
                <span className="mt-auto font-semibold text-black group-hover:text-[#E50914] transition-colors">
                  {method.value}
                </span>
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}