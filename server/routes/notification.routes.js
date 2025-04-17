const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification.model")
const { authenticateUser } = require("../middleware/auth.middleware")

// Get user notifications
router.get("/", authenticateUser, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.userId }).sort({ createdAt: -1 })

    res.status(200).json({ notifications, count: notifications.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark notification as read
router.patch("/:id/read", authenticateUser, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: `No notification with id: ${req.params.id}` })
    }

    // Check if user is authorized to update this notification
    if (notification.recipient.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this notification" })
    }

    notification.read = true
    await notification.save()

    res.status(200).json({ notification })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark all notifications as read
router.patch("/read-all", authenticateUser, async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.userId, read: false }, { read: true })

    res.status(200).json({ message: "All notifications marked as read" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
