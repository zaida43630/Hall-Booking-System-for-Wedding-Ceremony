"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
  FaCalendarAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaPaypal,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaFilter,
} from "react-icons/fa"
import Spinner from "../../components/Spinner"

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get("/payments/admin")
      setPayments(data.payments)
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast.error("Failed to load payments")
    } finally {
      setLoading(false)
    }
  }

  // Filter payments based on selected filter
  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true
    return payment.status === filter
  })

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "credit_card":
        return <FaCreditCard className="text-blue-500" />
      case "paypal":
        return <FaPaypal className="text-blue-700" />
      case "bank_transfer":
        return <FaMoneyBillWave className="text-green-600" />
      default:
        return <FaMoneyBillWave className="text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaHourglassHalf className="mr-1" />
            Pending
          </span>
        )
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Completed
          </span>
        )
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" />
            Failed
          </span>
        )
      case "refunded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaMoneyBillWave className="mr-1" />
            Refunded
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Records</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">All Payments</h2>

            <div className="flex items-center">
              <FaFilter className="mr-2 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No payment records found.</p>
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
                    Transaction ID
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
                    Booking
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Method
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
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.transactionId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.booking.user.name}</div>
                      <div className="text-sm text-gray-500">{payment.booking.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.booking.hall.name}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-1" />
                        {new Date(payment.booking.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="ml-1 capitalize">
                          {payment.paymentMethod.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.paidAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPayments
