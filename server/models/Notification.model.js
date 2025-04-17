const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide notification title"],
  },
  message: {
    type: String,
    required: [true, "Please provide notification message"],
  },
  type: {
    type: String,
    enum: ["booking", "payment", "system", "reminder"],
    default: "system",
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedTo: {
    model: {
      type: String,
      enum: ["Booking", "Payment", null],
      default: null,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Notification", NotificationSchema)
