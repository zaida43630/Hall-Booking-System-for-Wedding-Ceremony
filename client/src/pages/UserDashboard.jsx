"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaCalendarAlt, FaMoneyBillWave, FaBell, FaUser } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"

const UserDashboard = () => {
  const { user } = useAuth()

  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalSpent: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch bookings
        const bookingsResponse = await axios.get("/bookings/my-bookings")
        const bookings = bookingsResponse.data.bookings

        // Calculate stats
        const totalBookings = bookings.length
        const pendingBookings = bookings.filter((b) => b.status === "pending").length
        const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length
        const totalSpent = bookings
          .filter((b) => b.status !== "cancelled")
          .reduce((sum, booking) => sum + booking.totalAmount, 0)

        setStats({
          totalBookings,
          pendingBookings,
          confirmedBookings,
          totalSpent,
        })

        // Get recent bookings
        setRecentBookings(bookings.slice(0, 3))

        // Fetch notifications
        const notificationsResponse = await axios.get("/notifications")
        setNotifications(notificationsResponse.data.notifications.slice(0, 5))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const markAllNotificationsAsRead = async () => {
    try {
      await axios.patch("/notifications/read-all")

      // Update notifications state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      
      toast.success("All notifications marked as read")

    } catch (error) {
      console.error("Error marking notifications as read:", error)
      toast.error("Failed to mark notifications as read")
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.confirmedBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaMoneyBillWave className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">₹{stats.totalSpent}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link to="/my-bookings" className="text-sm text-purple-600 hover:text-purple-800">
                View All
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {recentBookings.length === 0 ? (
                <div className="px-6 py-4 text-center text-gray-500">You don't have any bookings yet.</div>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking._id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-md font-medium text-gray-900">{booking.hall.name}</h3>
                        <p className="text-sm text-gray-500">{new Date(booking.startDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Guests: {booking.guestCount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-md font-medium text-gray-900">${booking.totalAmount}</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Link
                        to={`/payment/${booking._id}`}
                        className={`text-sm text-purple-600 hover:text-purple-800 ${
                          booking.status !== "pending" ? "hidden" : ""
                        }`}
                      >
                        Complete Payment
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {recentBookings.length > 0 && (
              <div className="px-6 py-4 bg-gray-50">
                <Link to="/my-bookings" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                  View all bookings
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-100 text-gray-600 mr-4">
                  <FaUser className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Account Type</h4>
                  <p className="mt-1 text-sm text-gray-900">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
              <div className="flex items-center">
                <button onClick={markAllNotificationsAsRead} className="text-sm text-purple-600 hover:text-purple-800">
                  Mark all as read
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-6 py-4 text-center text-gray-500">No notifications yet.</div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification._id} className={`px-6 py-4 ${notification.read ? "" : "bg-purple-50"}`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaBell className={`h-5 w-5 ${notification.read ? "text-gray-400" : "text-purple-600"}`} />
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${notification.read ? "text-gray-900" : "text-purple-900"}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-6 py-4 bg-gray-50">
                <Link to="/notifications" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <Link
                  to="/"
                  className="flex items-center p-3 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                  <FaCalendarAlt className="mr-3" />
                  <span>Browse Halls</span>
                </Link>
                <Link
                  to="/my-bookings"
                  className="flex items-center p-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  <FaCalendarAlt className="mr-3" />
                  <span>View My Bookings</span>
                </Link>
                <Link
                  to="/my-payments"
                  className="flex items-center p-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100"
                >
                  <FaMoneyBillWave className="mr-3" />
                  <span>View My Payments</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
