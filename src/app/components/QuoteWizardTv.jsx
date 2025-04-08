'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'

export default function QuoteWizardTv() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef(null)

  const [tvDetails, setTvDetails] = useState([
    { tvType: '', tvSize: '', wallType: '', hideCables: '', comments: '' }
  ])

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: ''
  })

  const handleTvChange = (index, e) => {
    const { name, value } = e.target
    const newTvDetails = [...tvDetails]
    newTvDetails[index] = { ...newTvDetails[index], [name]: value }
    setTvDetails(newTvDetails)
  }

  const addAnotherTv = () => {
    setTvDetails(prev => [...prev, { tvType: '', tvSize: '', wallType: '', hideCables: '', comments: '' }])
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const calculateTvCost = (tv) => {
    let cost = 0
    if (tv.tvSize === '<55') cost += 99
    if (tv.tvSize === '>=55') cost += 120
    if (tv.wallType === 'Brick' || tv.wallType === 'Concrete') cost += 25
    if (tv.hideCables === 'Yes') cost += 60
    return cost
  }

  const totalTvCost = (() => {
    const smallTvs = tvDetails.filter(tv => tv.tvSize === '<55')
    if (tvDetails.length === 2 && smallTvs.length === 2) {
      return 170
    }
    return tvDetails.reduce((total, tv) => total + calculateTvCost(tv), 0)
  })()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      tvDetails,
      totalCost: totalTvCost,
      ...formData
    }

    try {
      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const dbRes = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!emailRes.ok) throw new Error('Email failed')

      toast.success('Quote sent successfully!')
      setSubmitted(true)
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Error sending your quote. Please try again.')
    }
  }

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [step])

  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="bg-white py-20 px-4" id="quote" ref={formRef}>
      <div className="max-w-xl mx-auto text-black">
        {submitted ? (
          <motion.div initial="hidden" animate="visible" transition={{ duration: 0.5 }} className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you!</h2>
            <p className="text-black">We received your request and will contact you soon.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial="hidden" animate="visible" exit="hidden" variants={variants} transition={{ duration: 0.5 }} className="bg-gray-100 rounded-xl p-6 text-center text-black">
                <h2 className="text-3xl font-bold mb-4">Get a Free Quote</h2>
                <p className="mb-6">Let us know about your TV installation needs.</p>
                <button onClick={() => setStep(2)} className="bg-[#e50914] text-white px-6 py-3 rounded-full hover:scale-105 transition-transform">Start</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.form key="step2" initial="hidden" animate="visible" exit="hidden" variants={variants} transition={{ duration: 0.5 }} className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
                <h3 className="text-xl font-semibold text-black">TV Details</h3>
                {tvDetails.map((tv, index) => (
                  <div key={index} className="border p-4 rounded-lg space-y-3 mb-4">
                    <select name="tvType" value={tv.tvType} onChange={(e) => handleTvChange(index, e)} className="w-full border rounded p-2 text-black" required>
                      <option value="">Select TV Type</option>
                      <option value="SmartTV">SmartTV</option>
                      <option value="Standard">Standard</option>
                      <option value="FrameTv">FrameTv</option>
                      <option value="Other">Other</option>
                    </select>
                    <select name="tvSize" value={tv.tvSize} onChange={(e) => handleTvChange(index, e)} className="w-full border rounded p-2 text-black" required>
                      <option value="">Select TV Size</option>
                      <option value="<55">Less than 55 inches ($99)</option>
                      <option value=">=55">55 inches or larger ($120)</option>
                    </select>
                    <select name="wallType" value={tv.wallType} onChange={(e) => handleTvChange(index, e)} className="w-full border rounded p-2 text-black" required>
                      <option value="">Select Wall Type</option>
                      <option value="Drywall">Drywall</option>
                      <option value="Brick">Brick (+$25)</option>
                      <option value="Concrete">Concrete (+$25)</option>
                      <option value="Other">Other</option>
                    </select>
                    <select name="hideCables" value={tv.hideCables} onChange={(e) => handleTvChange(index, e)} className="w-full border rounded p-2 text-black" required>
                      <option value="">Hide Cables?</option>
                      <option value="Yes">Yes (+$60)</option>
                      <option value="No">No</option>
                    </select>
                    <textarea name="comments" value={tv.comments} onChange={(e) => handleTvChange(index, e)} placeholder="Additional Comments (optional)" className="w-full border rounded p-2 mt-1 text-black" rows="2" />
                  </div>
                ))}
                <button type="button" onClick={addAnotherTv} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Another TV</button>
                <div className="bg-gray-100 p-4 rounded">
                  <h4 className="font-semibold text-black">Current Total Estimate: ${totalTvCost.toFixed(2)}</h4>
                  <p className="text-sm text-black">(Calculated per TV options selected. Prices may vary depending on TV type. Frame TVs may have an extra charge.)</p>
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-500 underline">Back</button>
                  <button type="submit" className="bg-[#e50914] text-white px-4 py-2 rounded hover:bg-red-600">Next</button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form key="step3" initial="hidden" animate="visible" exit="hidden" variants={variants} transition={{ duration: 0.5 }} className="space-y-4 text-black" onSubmit={handleSubmit}>
                <h3 className="text-xl font-semibold">Your Info</h3>
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full border rounded p-2 text-black" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border rounded p-2 text-black" required />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2 text-black" required />
                <label className="block text-black">Preferred Installation Date</label>
                <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} className="w-full border rounded p-2 mt-1 text-black" required />
                <div className="flex justify-between">
                  <button type="button" onClick={() => setStep(2)} className="text-sm text-blue-500 underline">Back</button>
                  <button type="submit" className="bg-[#e50914] text-white px-6 py-2 rounded hover:bg-red-600">Submit</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
