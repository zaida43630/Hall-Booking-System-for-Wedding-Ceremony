"use client"

import { useEffect } from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FaUserCircle, FaBell } from "react-icons/fa"
import { HiMenu, HiX } from "react-icons/hi"
import axios from "axios"

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  // Fetch unread notifications count
  const fetchUnreadCount = async () => {
    if (isAuthenticated) {
      try {
        const { data } = await axios.get("/notifications")
        const unread = data.notifications.filter((n) => !n.read).length
        setUnreadCount(unread)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }
  }

  // Fetch unread count on component mount and when auth state changes
  useEffect(() => {
    fetchUnreadCount()

    // Set up interval to check for new notifications
    const interval = setInterval(fetchUnreadCount, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const handleLogout = async () => {
    await logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-purple-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Wedding Hall Booking</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600">
                  Dashboard
                </Link>
                <Link to="/my-bookings" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600">
                  My Bookings
                </Link>

                {isAdmin && (
                  <Link to="/admin/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600">
                    Admin
                  </Link>
                )}

                <div className="relative">
                  <Link to="/notifications" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600">
                    <FaBell className="inline-block mr-1" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </div>

                <div className="flex items-center ml-4">
                  <span className="mr-2">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-purple-800 hover:bg-purple-900"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-600 focus:outline-none"
            >
              {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                <Link
                  to="/notifications"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{unreadCount}</span>
                  )}
                </Link>

                <div className="pt-4 pb-3 border-t border-purple-800">
                  <div className="flex items-center px-5">
                    <FaUserCircle className="h-8 w-8 text-white" />
                    <div className="ml-3">
                      <div className="text-base font-medium">{user?.name}</div>
                      <div className="text-sm font-medium text-purple-300">{user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-purple-800 hover:bg-purple-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
