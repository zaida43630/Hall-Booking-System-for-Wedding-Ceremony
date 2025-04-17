"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEye,
  FaFilter,
} from "react-icons/fa"
import Spinner from "../../components/Spinner"

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [statusUpdate, setStatusUpdate] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/bookings/admin")
      setBookings(data.bookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
    setStatusUpdate(booking.status)
    setShowModal(true)
  }

  const handleStatusChange = (e) => {
    setStatusUpdate(e.target.value)
  }

  const updateBookingStatus = async () => {
    if (!selectedBooking || statusUpdate === selectedBooking.status) {
      setShowModal(false)
      return
    }

    try {
      await axios.patch(`/bookings/${selectedBooking._id}/status`, { status: statusUpdate })

      // Update booking in state
      setBookings((prev) =>
        prev.map((booking) => (booking._id === selectedBooking._id ? { ...booking, status: statusUpdate } : booking)),
      )

      toast.success(`Booking status updated to ${statusUpdate}`)
      setShowModal(false)
    } catch (error) {
      console.error("Error updating booking status:", error)
      toast.error(error.response?.data?.message || "Failed to update booking status")
    }
  }

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaHourglassHalf className="mr-1" />
            Pending
          </span>
        )
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Confirmed
          </span>
        )
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" />
            Cancelled
          </span>
        )
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaCheckCircle className="mr-1" />
            Completed
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Bookings</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">All Bookings</h2>

            <div className="flex items-center">
              <FaFilter className="mr-2 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Booking ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hall
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking._id.substring(booking._id.length - 6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                      <div className="text-sm text-gray-500">{booking.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.hall.name}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-1" />
                        {booking.hall.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-1" />
                        {new Date(booking.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        <FaUsers className="inline mr-1" />
                        {booking.guestCount} guests
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <FaEye className="inline mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Booking Details */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Booking Details</h3>
                </div>

                <div className="grid grid-cols-1 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Booking ID</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking._id}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedBooking.user.name} ({selectedBooking.user.email})
                    </p>
                    {selectedBooking.user.phone && (
                      <p className="mt-1 text-sm text-gray-900">Phone: {selectedBooking.user.phone}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Hall</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedBooking.hall.name} - {selectedBooking.hall.location}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Booking Date</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedBooking.startDate).toLocaleDateString()} to{" "}
                      {new Date(selectedBooking.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Guest Count</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.guestCount} guests</p>
                  </div>

                  {selectedBooking.specialRequests && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Special Requests</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.specialRequests}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                    <p className="mt-1 text-sm text-gray-900">${selectedBooking.totalAmount}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <div className="mt-1">
                      <select
                        value={statusUpdate}
                        onChange={handleStatusChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={updateBookingStatus}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update Status
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBookings
