const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const path = require("path")

// Routes
const authRoutes = require("./routes/auth.routes")
const hallRoutes = require("./routes/hall.routes")
const bookingRoutes = require("./routes/booking.routes")
const paymentRoutes = require("./routes/payment.routes")
const notificationRoutes = require("./routes/notification.routes")
const adminRoutes = require("./routes/admin.routes")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/halls", hallRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/admin", adminRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
