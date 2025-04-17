const mongoose = require("mongoose")

const HallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide hall name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide hall description"],
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  capacity: {
    type: Number,
    required: [true, "Please provide hall capacity"],
  },
  pricePerDay: {
    type: Number,
    required: [true, "Please provide price per day"],
  },
  location: {
    type: String,
    required: [true, "Please provide hall location"],
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  availability: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Hall", HallSchema)
