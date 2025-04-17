"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaEye, FaCreditCard, FaTimes } from "react-icons/fa"
import Spinner from "../components/Spinner"

const UserBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/bookings/my-bookings")
        setBookings(data.bookings)
      } catch (error) {
        console.error("Error fetching bookings:", error)
        toast.error("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      await axios.patch(`/bookings/${bookingId}/cancel`)

      // Update booking status in state
      setBookings((prev) =>
        prev.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelled" } : booking)),
      )

      toast.success("Booking cancelled successfully")
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast.error(error.response?.data?.message || "Failed to cancel booking")
    }
  }

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Your Booking History</h2>

            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "all" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("confirmed")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "confirmed" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilter("cancelled")}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === "cancelled" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No bookings found.</p>
            <Link to="/" className="mt-4 inline-block text-purple-600 hover:text-purple-800">
              Browse Halls
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-900">{booking.hall.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-1" />
                      {booking.hall.location}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
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
                    <p className="mt-1 text-sm font-medium text-gray-900">${booking.totalAmount}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <FaUsers className="mr-2" />
                    <span>{booking.guestCount} Guests</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/halls/${booking.hall._id}`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
                  >
                    <FaEye className="mr-1" />
                    View Hall
                  </Link>

                  {booking.status === "pending" && (
                    <>
                      <Link
                        to={`/payment/${booking._id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:border-purple-700 focus:shadow-outline-purple active:bg-purple-800"
                      >
                        <FaCreditCard className="mr-1" />
                        Complete Payment
                      </Link>

                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-800"
                      >
                        <FaTimes className="mr-1" />
                        Cancel Booking
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserBookings
