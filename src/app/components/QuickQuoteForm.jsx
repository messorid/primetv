"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { motion } from "framer-motion"

export default function QuickQuoteForm({ onSubmitted }) {

  const [status,setStatus] = useState("idle")

  const [form,setForm] = useState({
    tvSize:"",
    location:"",
    name:"",
    phone:"",
    email:"",
  })

  const valid = useMemo(()=>{
    return (
      form.tvSize &&
      form.location.trim() &&
      form.name.trim() &&
      form.phone.trim() &&
      form.email.trim()
    )
  },[form])

  const basePrice =
    form.tvSize === "up_to_55"
      ? "From 110 per TV"
      : form.tvSize === "over_55"
      ? "From 140 per TV"
      : ""

  function isZip(v){
    return /^\d{5}$/.test(v.trim())
  }

  async function onSubmit(e){
    e.preventDefault()

    if(!valid) return

    setStatus("sending")

    try{

      const payload = {
        service: form.tvSize === "up_to_55"
          ? "TV up to 55"
          : "TV over 55",

        tvSize: form.tvSize === "up_to_55"
          ? "Up to 55 inches"
          : "Over 55 inches",

        zip: isZip(form.location)
          ? form.location.trim()
          : "",

        address: isZip(form.location)
          ? ""
          : form.location.trim(),

        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      }

      const res = await fetch("/api/quote",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(payload)
      })

      if(!res.ok) throw new Error()

      setStatus("ok")

      setForm({
        tvSize:"",
        location:"",
        name:"",
        phone:"",
        email:"",
      })

      onSubmitted?.()

    }catch{
      setStatus("error")
    }

  }

  return (

    <section
      id="quick-quote"
      className="relative w-full bg-gray-50 text-black py-16"
    >

      {/* glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[350px] bg-red-500/10 blur-3xl"
      />

      <div className="relative max-w-xl mx-auto px-5">

        <motion.form
          onSubmit={onSubmit}
          initial={{opacity:0,y:30}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.5}}
          className="rounded-2xl border border-black/10 bg-white p-6 shadow-lg"
        >

          <h3 className="text-2xl font-bold">
            Quick quote
          </h3>

          <p className="mt-1 text-sm text-black/70">
            Just the basics. We reply with price and availability
          </p>


          {/* TV SIZE */}

          <div className="mt-5">

            <label className="text-sm font-semibold">
              TV size
            </label>

            <div className="mt-2 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={()=>setForm({...form,tvSize:"up_to_55"})}
                className={`rounded-xl border py-3 text-sm font-semibold transition ${
                  form.tvSize === "up_to_55"
                  ? "bg-[#E50914] text-white border-[#E50914]"
                  : "border-black/15 hover:bg-black/5"
                }`}
              >
                Up to 55 in
              </button>

              <button
                type="button"
                onClick={()=>setForm({...form,tvSize:"over_55"})}
                className={`rounded-xl border py-3 text-sm font-semibold transition ${
                  form.tvSize === "over_55"
                  ? "bg-[#E50914] text-white border-[#E50914]"
                  : "border-black/15 hover:bg-black/5"
                }`}
              >
                Over 55 in
              </button>

            </div>

            {basePrice && (
              <p className="mt-2 text-xs text-black/60">
                {basePrice}
              </p>
            )}

          </div>



          {/* INPUTS */}

          <div className="mt-5 space-y-4">

            <Input
              label="ZIP or City"
              value={form.location}
              onChange={(v)=>setForm({...form,location:v})}
              placeholder="Example 37209 or Nashville"
            />

            <Input
              label="Full name"
              value={form.name}
              onChange={(v)=>setForm({...form,name:v})}
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(v)=>setForm({...form,phone:v})}
              placeholder="Mobile for updates"
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(v)=>setForm({...form,email:v})}
            />

          </div>



          {/* BUTTONS */}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">

            <button
              type="submit"
              disabled={!valid || status === "sending"}
              className="rounded-full bg-[#E50914] px-7 py-3 font-semibold text-white hover:shadow-lg hover:shadow-red-500/30 transition disabled:opacity-60"
            >
              {status === "sending"
                ? "Sending..."
                : "Get my quote"}
            </button>

            <Link
              href="/book"
              className="rounded-full border border-black/15 px-7 py-3 font-semibold hover:bg-black/5 transition"
            >
              Book installation
            </Link>

          </div>



          {/* STATUS */}

          <div className="mt-4 min-h-6">

            {status === "ok" && (
              <p className="text-sm font-medium text-emerald-600">
                Thank you. We received your request
              </p>
            )}

            {status === "error" && (
              <p className="text-sm font-medium text-[#E50914]">
                Something went wrong. Please try again
              </p>
            )}

          </div>


          <p className="mt-4 text-xs text-black/60">
            Drywall has no extra charge. Concrete tile stone or metal has a 25 surcharge.
            Cable concealment is 60 per TV. Fireplace handling from 25 extra
          </p>

        </motion.form>

      </div>

    </section>

  )

}


/* INPUT COMPONENT */

function Input({
  label,
  value,
  onChange,
  placeholder="",
  type="text"
}){

  return(

    <div className="flex flex-col">

      <label className="text-sm font-semibold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e)=>onChange(e.target.value)}
        className="mt-1 rounded-xl border border-black/15 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
      />

    </div>

  )

}
