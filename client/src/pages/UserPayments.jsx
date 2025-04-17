"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaCalendarAlt, FaCreditCard, FaMoneyBillWave, FaPaypal, FaReceipt } from "react-icons/fa"
import Spinner from "../components/Spinner"

const UserPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get("/payments/my-payments")
        setPayments(data.payments)
      } catch (error) {
        console.error("Error fetching payments:", error)
        toast.error("Failed to load payments")
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

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

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Payments</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
        </div>

        {payments.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No payment records found.</p>
            <Link to="/my-bookings" className="mt-4 inline-block text-purple-600 hover:text-purple-800">
              View My Bookings
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <div key={payment._id} className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <h3 className="ml-2 text-lg font-medium text-gray-900">
                        Payment for {payment.booking.hall.name}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Transaction ID: {payment.transactionId}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Payment Method: {payment.paymentMethod.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : payment.status === "refunded"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                    <p className="mt-1 text-lg font-medium text-gray-900">${payment.amount}</p>
                    <p className="mt-1 text-sm text-gray-500">{new Date(payment.paidAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <FaCalendarAlt className="mr-2" />
                  <span>Booking Date: {new Date(payment.booking.startDate).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/my-bookings`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
                  >
                    <FaReceipt className="mr-1" />
                    View Booking Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPayments
