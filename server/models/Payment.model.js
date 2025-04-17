const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  amount: {
    type: Number,
    required: [true, "Please provide payment amount"],
  },
  paymentMethod: {
    type: String,
    required: [true, "Please provide payment method"],
    enum: ["credit_card", "debit_card", "bank_transfer", "paypal"],
  },
  transactionId: {
    type: String,
    required: [true, "Please provide transaction ID"],
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Payment", PaymentSchema)
