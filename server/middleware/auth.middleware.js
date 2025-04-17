const jwt = require("jsonwebtoken")
const User = require("../models/User.model")

const authenticateUser = async (req, res, next) => {
  // Check for token in cookies or headers
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Authentication invalid" })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to request object
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    }

    next()
  } catch (error) {
    return res.status(401).json({ message: "Authentication invalid" })
  }
}

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized to access this route" })
    }
    next()
  }
}

module.exports = {
  authenticateUser,
  authorizeRoles,
}
