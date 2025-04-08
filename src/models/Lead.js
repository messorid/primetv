// src/models/Lead.js
import mongoose from 'mongoose'

const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  tvBrand: String,
  tvSize: String,
  wallType: String,
  hideCables: String,
  additionalTv: String,
  comments: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema)
