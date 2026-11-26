"use client"

import { motion } from "framer-motion"

export default function ContactUI() {
  const contactMethods = [
    {
      title: "Call Us",
      description: "Every day from 8am to 6pm.",
      value: "+1 615-669-0251",
      href: "tel:+16156690251",
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
          {contactMethods.map(method => {
            const Card = method.href ? "a" : "div"
            return (
              <Card
                key={method.title}
                href={method.href}
                className={`group flex h-full flex-col items-center rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm ${method.href ? "transition-shadow hover:shadow-xl" : ""}`}
              >
                <div aria-hidden="true" className="mb-6 flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand-dark">
                  {method.icon}
                </div>
                
                <h2 className="mb-2 text-xl font-bold text-ink">
                  {method.title}
                </h2>
                
                <p className="text-sm text-black/60 mb-6">
                  {method.description}
                </p>
                
                <span className={`mt-auto max-w-full font-semibold text-ink [overflow-wrap:anywhere] ${method.href ? "underline underline-offset-4 group-hover:text-brand-dark" : ""}`}>
                  {method.value}
                </span>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}
