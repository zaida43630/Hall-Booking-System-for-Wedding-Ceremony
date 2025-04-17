"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaMapMarkerAlt, FaUsers, FaRupeeSign, FaCalendarAlt, FaCheck } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import Spinner from "../components/Spinner"

const HallDetails = () => {
  const { id } = useParams()
  const [hall, setHall] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [isAvailable, setIsAvailable] = useState(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const { data } = await axios.get(`/halls/${id}`)
        setHall(data.hall)
      } catch (error) {
        console.error("Error fetching hall details:", error)
        toast.error("Failed to load hall details")
      } finally {
        setLoading(false)
      }
    }

    fetchHall()
  }, [id])

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
    setIsAvailable(null)
  }

  const checkAvailability = async () => {
    if (!selectedDate) {
      toast.error("Please select a date")
      return
    }

    setCheckingAvailability(true)

    try {
      // Calculate end date (next day)
      const startDate = new Date(selectedDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)

      const { data } = await axios.post("/halls/check-availability", {
        hallId: id,
        startDate,
        endDate,
      })

      setIsAvailable(data.isAvailable)

      if (data.isAvailable) {
        toast.success("Hall is available for the selected date!")
      } else {
        toast.error("Hall is not available for the selected date")
      }
    } catch (error) {
      console.error("Error checking availability:", error)
      toast.error("Failed to check availability")
    } finally {
      setCheckingAvailability(false)
    }
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book this hall")
      navigate("/login", { state: { from: { pathname: `/halls/${id}` } } })
      return
    }

    if (!selectedDate) {
      toast.error("Please select a date")
      return
    }

    if (isAvailable === false) {
      toast.error("Hall is not available for the selected date")
      return
    }

    navigate(`/book/${id}`, { state: { selectedDate } })
  }

  if (loading) {
    return <Spinner />
  }

  if (!hall) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Hall not found</h2>
        <p className="mt-2 text-gray-600">The hall you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="mt-4 inline-block text-purple-600 hover:text-purple-800">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Hall Images */}
        <div className="h-64 sm:h-96 bg-gray-300">
          {hall.images && hall.images.length > 0 ? (
            <img src={hall.images[0] || "/placeholder.svg"} alt={hall.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hall.name}</h1>
              <p className="text-gray-600 flex items-center mb-4">
                <FaMapMarkerAlt className="mr-2" />
                {hall.location}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <FaUsers className="mr-2" />
                  <span>Capacity: {hall.capacity} guests</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaRupeeSign className="mr-2" />
                  <span>Price: ₹{hall.pricePerDay} per day</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 mb-6">{hall.description}</p>

              {hall.amenities && hall.amenities.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Amenities</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {hall.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <FaCheck className="mr-2 text-green-500" />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="mt-6 md:mt-0 md:ml-8 bg-gray-50 p-6 rounded-lg shadow-sm w-full md:w-80">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Book This Hall</h2>

              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>
              </div>

              <button
                onClick={checkAvailability}
                disabled={!selectedDate || checkingAvailability}
                className="w-full mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                {checkingAvailability ? "Checking..." : "Check Availability"}
              </button>

              {isAvailable !== null && (
                <div
                  className={`p-3 rounded-md mb-4 ${isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {isAvailable
                    ? "Hall is available for the selected date!"
                    : "Hall is not available for the selected date."}
                </div>
              )}

              <button
                onClick={handleBookNow}
                disabled={!selectedDate || isAvailable === false}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HallDetails
