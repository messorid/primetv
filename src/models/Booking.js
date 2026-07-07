import mongoose from "mongoose"

const TvSchema = new mongoose.Schema({
  size:      String,
  exactSize: String,
  wallType:  String,
  comments:  String,
}, { _id: false })

const BookingSchema = new mongoose.Schema({
  firstName:          { type: String, required: true },
  lastName:           { type: String, required: true },
  email:              { type: String, required: true },
  phone:              { type: String, required: true },
  referral:           String,
  payment:            String,
  date:               String,
  timePreference:     String,
  address: {
    street: String,
    apt:    String,
    city:   String,
    state:  String,
    zip:    String,
  },
  selectedPromo:      String,
  couponCode:         String,
  appliedCouponLabel: String,
  tvs:                [TvSchema],
  status: {
    type:    String,
    enum:    ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema)
