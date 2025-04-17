const express = require("express")
const router = express.Router()
const User = require("../models/User.model")
const Booking = require("../models/Booking.model")
const Payment = require("../models/Payment.model")
const Hall = require("../models/Hall.model")
const { authenticateUser, authorizeRoles } = require("../middleware/auth.middleware")

// Get dashboard stats
router.get("/dashboard", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments({ role: "customer" })

    // Count total bookings
    const totalBookings = await Booking.countDocuments()

    // Count bookings by status
    const pendingBookings = await Booking.countDocuments({ status: "pending" })
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" })
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" })
    const completedBookings = await Booking.countDocuments({ status: "completed" })

    // Calculate total revenue
    const payments = await Payment.find({ status: "completed" })
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)

    // Get recent bookings
    const recentBookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("hall", "name location")

    // Get recent payments
    const recentPayments = await Payment.find({ status: "completed" })
      .sort({ paidAt: -1 })
      .limit(5)
      .populate({
        path: "booking",
        populate: {
          path: "user hall",
          select: "name email name location",
        },
      })

    res.status(200).json({
      stats: {
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        totalRevenue,
      },
      recentBookings,
      recentPayments,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all users (admin only)
router.get("/users", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password")
    res.status(200).json({ users, count: users.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
