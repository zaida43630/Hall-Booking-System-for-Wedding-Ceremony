"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaCalendarAlt, FaUsers, FaInfoCircle } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"

const BookingForm = () => {
  const { hallId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [hall, setHall] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    startDate: location.state?.selectedDate || "",
    endDate: "",
    guestCount: "",
    specialRequests: "",
  })

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const { data } = await axios.get(`/halls/${hallId}`)
        setHall(data.hall)

        // Set default guest count to half of capacity
        setFormData((prev) => ({
          ...prev,
          guestCount: Math.floor(data.hall.capacity / 2),
        }))
      } catch (error) {
        console.error("Error fetching hall details:", error)
        toast.error("Failed to load hall details")
      } finally {
        setLoading(false)
      }
    }

    fetchHall()
  }, [hallId])

  // Calculate end date when start date changes
  useEffect(() => {
    if (formData.startDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)

      setFormData((prev) => ({
        ...prev,
        endDate: endDate.toISOString().split("T")[0],
      }))
    }
  }, [formData.startDate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select dates for your booking")
      return
    }

    if (!formData.guestCount) {
      toast.error("Please enter the number of guests")
      return
    }

    // Validate guest count
    if (formData.guestCount > hall.capacity) {
      toast.error(`Guest count exceeds hall capacity of ${hall.capacity}`)
      return
    }

    setSubmitting(true)

    try {
      const { data } = await axios.post("/bookings", {
        hallId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        guestCount: formData.guestCount,
        specialRequests: formData.specialRequests,
      })

      toast.success("Booking created successfully!")
      navigate(`/payment/${data.booking._id}`)
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error(error.response?.data?.message || "Failed to create booking")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Spinner />
  }

  if (!hall) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Hall not found</h2>
        <p className="mt-2 text-gray-600">The hall you're trying to book doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/")} className="mt-4 inline-block text-purple-600 hover:text-purple-800">
          Back to Home
        </button>
      </div>
    )
  }

  // Calculate total price
  const startDate = new Date(formData.startDate)
  const endDate = new Date(formData.endDate)
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  const totalPrice = days * hall.pricePerDay

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Book {hall.name}</h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate}
                      required
                      disabled
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-100"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Bookings are for 24 hours from the start date</p>
                </div>

                <div>
                  <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUsers className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="guestCount"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleChange}
                      min="1"
                      max={hall.capacity}
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Maximum capacity: {hall.capacity} guests</p>
                </div>

                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaInfoCircle className="text-gray-400" />
                    </div>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows="3"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Any special arrangements or requirements..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hall:</span>
                    <span className="font-medium">{hall.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span>{hall.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span>
                      {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>1 day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span>{formData.guestCount || 0}</span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Price:</span>
                      <span>₹{isNaN(totalPrice) ? 0 : totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-800">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/halls/${hallId}`)}
                  className="mr-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm
