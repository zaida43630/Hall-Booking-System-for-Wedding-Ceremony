const mongoose = require("mongoose")

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hall",
    required: true,
  },
  startDate: {
    type: Date,
    required: [true, "Please provide booking start date"],
  },
  endDate: {
    type: Date,
    required: [true, "Please provide booking end date"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Please provide total amount"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  guestCount: {
    type: Number,
    required: [true, "Please provide guest count"],
  },
  specialRequests: {
    type: String,
    maxlength: [500, "Special requests cannot be more than 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Booking", BookingSchema)
