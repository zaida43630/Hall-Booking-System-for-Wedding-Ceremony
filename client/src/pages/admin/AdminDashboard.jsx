"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa"
import Spinner from "../../components/Spinner"

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get("/admin/dashboard")
        setStats(data.stats)
        setRecentBookings(data.recentBookings)
        setRecentPayments(data.recentPayments)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
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
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaMoneyBillWave className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaBuilding className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaHourglassHalf className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.confirmedBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FaTimesCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.cancelledBookings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-purple-600 hover:text-purple-800">
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {recentBookings.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">No bookings yet.</div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking._id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium text-gray-900">{booking.hall.name}</h3>
                      <p className="text-sm text-gray-500">
                        by {booking.user.name} on {new Date(booking.startDate).toLocaleDateString()}
                      </p>
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
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
            <Link to="/admin/payments" className="text-sm text-purple-600 hover:text-purple-800">
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {recentPayments.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">No payments yet.</div>
            ) : (
              recentPayments.map((payment) => (
                <div key={payment._id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium text-gray-900">Payment for {payment.booking.hall.name}</h3>
                      <p className="text-sm text-gray-500">
                        by {payment.booking.user.name} on {new Date(payment.paidAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-md font-medium text-gray-900">${payment.amount}</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/halls" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100">
            <FaBuilding className="text-purple-600 mr-3" />
            <span className="text-purple-800 font-medium">Manage Halls</span>
          </Link>

          <Link to="/admin/bookings" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
            <FaCalendarAlt className="text-blue-600 mr-3" />
            <span className="text-blue-800 font-medium">Manage Bookings</span>
          </Link>

          <Link to="/admin/payments" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100">
            <FaMoneyBillWave className="text-green-600 mr-3" />
            <span className="text-green-800 font-medium">View Payments</span>
          </Link>

          <Link to="/admin/users" className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100">
            <FaUsers className="text-yellow-600 mr-3" />
            <span className="text-yellow-800 font-medium">Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
