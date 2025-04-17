"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaCalendarAlt, FaMoneyBillWave, FaInfoCircle, FaBellSlash } from "react-icons/fa"
import Spinner from "../components/Spinner"

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get("/notifications")
        setNotifications(data.notifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        toast.error("Failed to load notifications")
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/notifications/${notificationId}/read`)
      
      // Update notification in state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.patch("/notifications/read-all")

      // Update all notifications in state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return <FaCalendarAlt className="h-5 w-5" />
      case "payment":
        return <FaMoneyBillWave className="h-5 w-5" />
      default:
        return <FaInfoCircle className="h-5 w-5" />
    }
  }

  if (loading) {
    return <Spinner />
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FaBellSlash className="mr-2" />
            Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Notifications</h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {unreadCount} unread
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 ${notification.read ? "" : "bg-purple-50"}`}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <div className="flex">
                  <div className={`flex-shrink-0 ${notification.read ? "text-gray-400" : "text-purple-600"}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${notification.read ? "text-gray-900" : "text-purple-900"}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{notification.message}</p>

                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification._id)
                        }}
                        className="mt-2 text-xs text-purple-600 hover:text-purple-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserNotifications
