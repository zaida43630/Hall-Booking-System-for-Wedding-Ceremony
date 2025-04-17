"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaCreditCard, FaMoneyBill, FaCheckCircle } from "react-icons/fa"
import Spinner from "../components/Spinner"

const PaymentPage = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(`/bookings/${bookingId}`)
        setBooking(data.booking)

        // If booking is already paid, show success
        if (data.booking.status === "confirmed") {
          setPaymentSuccess(true)
        }
      } catch (error) {
        console.error("Error fetching booking details:", error)
        toast.error("Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target
    setCardDetails({
      ...cardDetails,
      [name]: value,
    })
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (paymentMethod === "credit_card") {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast.error("Please fill in all card details")
        return
      }

      // Validate card number (simple check for demo)
      if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("Invalid card number")
        return
      }

      // Validate CVV
      if (cardDetails.cvv.length !== 3) {
        toast.error("Invalid CVV")
        return
      }
    }

    setProcessing(true)

    try {
      // Generate a mock transaction ID
      const transactionId = "TXN" + Date.now().toString().slice(-8)

      // Process payment
      const { data } = await axios.post("/payments/process", {
        bookingId,
        paymentMethod,
        transactionId,
      })

      setPaymentSuccess(true)
      toast.success("Payment successful!")

      // Wait 3 seconds before redirecting
      setTimeout(() => {
        navigate("/my-bookings")
      }, 3000)
    } catch (error) {
      console.error("Error processing payment:", error)
      toast.error(error.response?.data?.message || "Payment failed")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <Spinner />
  }

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
        <p className="mt-2 text-gray-600">The booking you're trying to pay for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate("/my-bookings")}
          className="mt-4 inline-block text-purple-600 hover:text-purple-800"
        >
          View My Bookings
        </button>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 text-center">
            <FaCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your booking for {booking.hall.name} has been confirmed.</p>
            <p className="text-sm text-gray-500 mb-6">You will be redirected to your bookings page shortly...</p>
            <button
              onClick={() => navigate("/my-bookings")}
              className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Payment</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div
                    className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      paymentMethod === "credit_card"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handlePaymentMethodChange("credit_card")}
                  >
                    <FaCreditCard className="mx-auto text-2xl mb-2 text-gray-700" />
                    <span className="text-sm font-medium">Credit Card</span>
                  </div>

                  <div
                    className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      paymentMethod === "paypal" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handlePaymentMethodChange("paypal")}
                  >
                    <img src="../icons/phonepe.svg" alt="PhonePe" className="mx-auto w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">PhonePe</span>
                  </div>

                  <div
                    className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      paymentMethod === "bank_transfer"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handlePaymentMethodChange("bank_transfer")}
                  >
                    <FaMoneyBill className="mx-auto text-2xl mb-2 text-gray-700" />
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {paymentMethod === "credit_card" && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardDetailsChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={cardDetails.cardName}
                          onChange={handleCardDetailsChange}
                          placeholder="John Doe"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={handleCardDetailsChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardDetailsChange}
                            placeholder="123"
                            maxLength="3"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <p className="text-gray-700 mb-4">You will be redirected to PhonePe to complete your payment.</p>
                    </div>
                  )}

                  {paymentMethod === "bank_transfer" && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        Please transfer the total amount to the following bank account:
                      </p>
                      <div className="space-y-2 mb-4">
                        <p className="flex justify-between">
                          <span className="font-medium">Bank Name:</span>
                          <span>Wedding Hall Bank</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Account Number:</span>
                          <span>1234567890</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Account Name:</span>
                          <span>Wedding Hall Booking</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Reference:</span>
                          <span>Booking #{bookingId.slice(-6)}</span>
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Your booking will be confirmed once we receive your payment.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate("/my-bookings")}
                      className="mr-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                      {processing ? "Processing..." : `Pay ₹${booking.totalAmount}`}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden sticky top-6">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hall:</span>
                    <span className="font-medium">{booking.hall.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span>{booking.guestCount}</span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{booking.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
