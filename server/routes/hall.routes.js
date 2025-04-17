const express = require("express")
const router = express.Router()
const Hall = require("../models/Hall.model")
const Booking = require("../models/Booking.model") // Import Booking model
const { authenticateUser, authorizeRoles } = require("../middleware/auth.middleware")

// Get all halls
router.get("/", async (req, res) => {
  try {
    const halls = await Hall.find({})
    res.status(200).json({ halls, count: halls.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single hall
router.get("/:id", async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id)
    if (!hall) {
      return res.status(404).json({ message: `No hall with id: ${req.params.id}` })
    }
    res.status(200).json({ hall })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create hall (admin only)
router.post("/", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const hall = await Hall.create(req.body)
    res.status(201).json({ hall })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update hall (admin only)
router.patch("/:id", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!hall) {
      return res.status(404).json({ message: `No hall with id: ${req.params.id}` })
    }

    res.status(200).json({ hall })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete hall (admin only)
router.delete("/:id", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const hall = await Hall.findByIdAndDelete(req.params.id)

    if (!hall) {
      return res.status(404).json({ message: `No hall with id: ${req.params.id}` })
    }

    res.status(200).json({ message: "Hall removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Check hall availability
router.post("/check-availability", async (req, res) => {
  try {
    const { hallId, startDate, endDate } = req.body

    // Convert string dates to Date objects
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Find bookings that overlap with the requested dates
    const bookings = await Booking.find({
      hall: hallId,
      status: { $ne: "cancelled" },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    })

    const isAvailable = bookings.length === 0

    res.status(200).json({ isAvailable })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
