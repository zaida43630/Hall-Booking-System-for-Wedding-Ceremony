"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaUsers, FaDollarSign } from "react-icons/fa"
import Spinner from "../../components/Spinner"

const AdminHalls = () => {
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingHall, setEditingHall] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    pricePerDay: "",
    location: "",
    amenities: "",
    images: "",
    availability: true,
  })

  useEffect(() => {
    fetchHalls()
  }, [])

  const fetchHalls = async () => {
    try {
      const { data } = await axios.get("/halls")
      setHalls(data.halls)
    } catch (error) {
      console.error("Error fetching halls:", error)
      toast.error("Failed to load halls")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Format amenities as array
      const formattedData = {
        ...formData,
        amenities: formData.amenities.split(",").map((item) => item.trim()),
        images: formData.images ? formData.images.split(",").map((item) => item.trim()) : [],
      }

      if (editingHall) {
        // Update existing hall
        await axios.patch(`/halls/${editingHall._id}`, formattedData)
        toast.success("Hall updated successfully")
      } else {
        // Create new hall
        await axios.post("/halls", formattedData)
        toast.success("Hall created successfully")
      }

      // Reset form and refresh halls
      resetForm()
      fetchHalls()
    } catch (error) {
      console.error("Error saving hall:", error)
      toast.error(error.response?.data?.message || "Failed to save hall")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (hall) => {
    setEditingHall(hall)
    setFormData({
      name: hall.name,
      description: hall.description,
      capacity: hall.capacity,
      pricePerDay: hall.pricePerDay,
      location: hall.location,
      amenities: hall.amenities.join(", "),
      images: hall.images.join(", "),
      availability: hall.availability,
    })
    setShowModal(true)
  }

  const handleDelete = async (hallId) => {
    if (!window.confirm("Are you sure you want to delete this hall?")) {
      return
    }

    setLoading(true)

    try {
      await axios.delete(`/halls/${hallId}`)
      toast.success("Hall deleted successfully")
      fetchHalls()
    } catch (error) {
      console.error("Error deleting hall:", error)
      toast.error(error.response?.data?.message || "Failed to delete hall")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      capacity: "",
      pricePerDay: "",
      location: "",
      amenities: "",
      images: "",
      availability: true,
    })
    setEditingHall(null)
    setShowModal(false)
  }

  if (loading && halls.length === 0) {
    return <Spinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Halls</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <FaPlus className="mr-2" />
          Add New Hall
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Capacity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
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
              {halls.map((hall) => (
                <tr key={hall._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                        {hall.images && hall.images.length > 0 ? (
                          <img
                            src={hall.images[0] || "/placeholder.svg"}
                            alt={hall.name}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center text-gray-400">N/A</div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{hall.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{hall.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-1" />
                      {hall.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaUsers className="mr-1" />
                      {hall.capacity} guests
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 font-medium">
                      <FaDollarSign className="mr-1" />
                      {hall.pricePerDay}/day
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hall.availability ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {hall.availability ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(hall)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(hall._id)} className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Hall */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingHall ? "Edit Hall" : "Add New Hall"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Hall Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                        Capacity (guests)
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        id="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
                        Price Per Day ($)
                      </label>
                      <input
                        type="number"
                        name="pricePerDay"
                        id="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">
                        Amenities (comma separated)
                      </label>
                      <input
                        type="text"
                        name="amenities"
                        id="amenities"
                        value={formData.amenities}
                        onChange={handleChange}
                        placeholder="WiFi, Parking, Air Conditioning"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                        Image URLs (comma separated)
                      </label>
                      <input
                        type="text"
                        name="images"
                        id="images"
                        value={formData.images}
                        onChange={handleChange}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center">
                        <input
                          id="availability"
                          name="availability"
                          type="checkbox"
                          checked={formData.availability}
                          onChange={handleChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">
                          Available for booking
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingHall ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminHalls
