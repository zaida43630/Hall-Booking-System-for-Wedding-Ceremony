const express = require("express")
const router = express.Router()
const Payment = require("../models/Payment.model")
const Booking = require("../models/Booking.model")
const Notification = require("../models/Notification.model")
const User = require("../models/User.model") // Import User model
const { authenticateUser, authorizeRoles } = require("../middleware/auth.middleware")

// Get all payments (admin only)
router.get("/admin", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const payments = await Payment.find({}).populate({
      path: "booking",
      populate: {
        path: "user hall",
        select: "name email name location",
      },
    })

    res.status(200).json({ payments, count: payments.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user payments
router.get("/my-payments", authenticateUser, async (req, res) => {
  try {
    // Find bookings for this user
    const bookings = await Booking.find({ user: req.user.userId })
    const bookingIds = bookings.map((booking) => booking._id)

    // Find payments for these bookings
    const payments = await Payment.find({ booking: { $in: bookingIds } }).populate({
      path: "booking",
      populate: {
        path: "hall",
        select: "name location",
      },
    })

    res.status(200).json({ payments, count: payments.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single payment
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: "booking",
      populate: {
        path: "user hall",
        select: "name email phone name location",
      },
    })

    if (!payment) {
      return res.status(404).json({ message: `No payment with id: ${req.params.id}` })
    }

    // Check if user is authorized to view this payment
    if (payment.booking.user._id.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this payment" })
    }

    res.status(200).json({ payment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Process payment
router.post("/process", authenticateUser, async (req, res) => {
  try {
    const { bookingId, paymentMethod, transactionId } = req.body

    // Check if booking exists
    const booking = await Booking.findById(bookingId).populate("hall user")

    if (!booking) {
      return res.status(404).json({ message: `No booking with id: ${bookingId}` })
    }

    // Check if user is authorized to make payment for this booking
    if (booking.user._id.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to make payment for this booking" })
    }

    // Check if booking is already paid
    const existingPayment = await Payment.findOne({
      booking: bookingId,
      status: "completed",
    })

    if (existingPayment) {
      return res.status(400).json({ message: "Payment already completed for this booking" })
    }

    // Create payment
    const payment = await Payment.create({
      booking: bookingId,
      amount: booking.totalAmount,
      paymentMethod,
      transactionId,
      status: "completed",
    })

    // Update booking status
    booking.status = "confirmed"
    await booking.save()

    // Create notification for user
    await Notification.create({
      recipient: booking.user._id,
      title: "Payment Successful",
      message: `Your payment for booking at ${booking.hall.name} has been processed successfully.`,
      type: "payment",
      relatedTo: {
        model: "Payment",
        id: payment._id,
      },
    })

    // Create notification for admin
    const admins = await User.find({ role: "admin" })
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        title: "New Payment",
        message: `A payment has been received for booking at ${booking.hall.name}.`,
        type: "payment",
        relatedTo: {
          model: "Payment",
          id: payment._id,
        },
      })
    }

    res.status(201).json({ payment, booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
