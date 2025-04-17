"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { FaSearch, FaCalendarAlt, FaUsers, FaMapMarkerAlt } from "react-icons/fa"
import Spinner from "../components/Spinner"

const Home = () => {
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    guests: "",
  })

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const { data } = await axios.get("/halls")
        setHalls(data.halls)
      } catch (error) {
        console.error("Error fetching halls:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHalls()
  }, [])

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Search params:", searchParams)
  }

  // Filter halls based on search params
  const filteredHalls = halls.filter((hall) => {
    let match = true

    if (searchParams.location && !hall.location.toLowerCase().includes(searchParams.location.toLowerCase())) {
      match = false
    }

    if (searchParams.guests && hall.capacity < Number.parseInt(searchParams.guests)) {
      match = false
    }

    return match
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">Find Your Perfect Wedding Venue</h1>
            <p className="mt-4 text-xl max-w-3xl mx-auto">
              Book beautiful halls for your special day with ease and confidence.
            </p>
          </div>

          {/* Search Form */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={searchParams.location}
                    onChange={handleSearchChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-black"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleSearchChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-500"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUsers className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="guests"
                    placeholder="Number of Guests"
                    value={searchParams.guests}
                    onChange={handleSearchChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-black"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <FaSearch className="mr-2" />
                  Search Halls
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Halls Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Available Wedding Halls</h2>

          {loading ? (
            <Spinner />
          ) : filteredHalls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No halls found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHalls.map((hall) => (
                <div key={hall._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-300">
                    {hall.images && hall.images.length > 0 ? (
                      <img
                        src={hall.images[0] || "/placeholder.svg"}
                        alt={hall.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{hall.name}</h3>
                    <p className="text-gray-500 mb-4 flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      {hall.location}
                    </p>
                    <p className="text-gray-700 mb-4 line-clamp-2">{hall.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-purple-600 font-bold">₹{hall.pricePerDay} / day</p>
                      <p className="text-gray-500 flex items-center">
                        <FaUsers className="mr-1" />
                        Up to {hall.capacity} guests
                      </p>
                    </div>
                    <Link
                      to={`/halls/${hall._id}`}
                      className="mt-4 block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Why Choose Our Platform</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Easy Booking Process</h3>
              <p className="mt-2 text-gray-500">
                Our platform makes it simple to find and book the perfect wedding hall for your special day.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Payments</h3>
              <p className="mt-2 text-gray-500">
                Our secure payment system ensures your booking and payment information is always protected.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">24/7 Support</h3>
              <p className="mt-2 text-gray-500">
                Our customer support team is available around the clock to assist you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Book Your Wedding Hall?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of happy couples who have found their perfect wedding venue through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-100"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-purple-800"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
