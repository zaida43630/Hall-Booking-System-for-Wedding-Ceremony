const express = require("express")
const router = express.Router()
const Booking = require("../models/Booking.model")
const Hall = require("../models/Hall.model")
const Notification = require("../models/Notification.model")
const { authenticateUser, authorizeRoles } = require("../middleware/auth.middleware")
const User = require("../models/User.model") // Import User model

// Get all bookings (admin)
router.get("/admin", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate("user", "name email").populate("hall", "name location")

    res.status(200).json({ bookings, count: bookings.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user bookings
router.get("/my-bookings", authenticateUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate("hall", "name location images pricePerDay")

    res.status(200).json({ bookings, count: bookings.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single booking
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user", "name email phone").populate("hall")

    if (!booking) {
      return res.status(404).json({ message: `No booking with id: ${req.params.id}` })
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this booking" })
    }

    res.status(200).json({ booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create booking
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { hallId, startDate, endDate, guestCount, specialRequests } = req.body

    // Check if hall exists
    const hall = await Hall.findById(hallId)
    if (!hall) {
      return res.status(404).json({ message: `No hall with id: ${hallId}` })
    }

    // Convert string dates to Date objects
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Calculate number of days
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

    // Calculate total amount
    const totalAmount = days * hall.pricePerDay

    // Check if hall is available for the requested dates
    const existingBookings = await Booking.find({
      hall: hallId,
      status: { $ne: "cancelled" },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    })

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "Hall is not available for the selected dates" })
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.userId,
      hall: hallId,
      startDate: start,
      endDate: end,
      totalAmount,
      guestCount,
      specialRequests,
    })

    // Create notification for user
    await Notification.create({
      recipient: req.user.userId,
      title: "Booking Created",
      message: `Your booking for ${hall.name} has been created successfully. Please complete the payment to confirm your booking.`,
      type: "booking",
      relatedTo: {
        model: "Booking",
        id: booking._id,
      },
    })

    // Create notification for admin
    const admins = await User.find({ role: "admin" })
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        title: "New Booking",
        message: `A new booking has been created for ${hall.name}.`,
        type: "booking",
        relatedTo: {
          model: "Booking",
          id: booking._id,
        },
      })
    }

    res.status(201).json({ booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update booking status (admin only)
router.patch("/:id/status", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.body

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).populate("user hall")

    if (!booking) {
      return res.status(404).json({ message: `No booking with id: ${req.params.id}` })
    }

    // Create notification for user
    await Notification.create({
      recipient: booking.user._id,
      title: "Booking Status Updated",
      message: `Your booking for ${booking.hall.name} has been ${status}.`,
      type: "booking",
      relatedTo: {
        model: "Booking",
        id: booking._id,
      },
    })

    res.status(200).json({ booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Cancel booking
router.patch("/:id/cancel", authenticateUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: `No booking with id: ${req.params.id}` })
    }

    // Check if user is authorized to cancel this booking
    if (booking.user.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" })
    }

    // Check if booking can be cancelled
    if (booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a completed booking" })
    }

    // Update booking status
    booking.status = "cancelled"
    await booking.save()

    // Create notification
    await Notification.create({
      recipient: booking.user,
      title: "Booking Cancelled",
      message: `Your booking has been cancelled successfully.`,
      type: "booking",
      relatedTo: {
        model: "Booking",
        id: booking._id,
      },
    })

    // Notify admin
    const admins = await User.find({ role: "admin" })
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        title: "Booking Cancelled",
        message: `A booking has been cancelled.`,
        type: "booking",
        relatedTo: {
          model: "Booking",
          id: booking._id,
        },
      })
    }

    res.status(200).json({ booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
