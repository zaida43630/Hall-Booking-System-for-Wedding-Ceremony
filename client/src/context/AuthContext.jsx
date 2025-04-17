"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)

  // Configure axios
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  // Set token in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      localStorage.setItem("token", token)
    } else {
      delete axios.defaults.headers.common["Authorization"]
      localStorage.removeItem("token")
    }
  }, [token])

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          const { data } = await axios.get("/auth/me")
          setUser(data.user)
        } catch (error) {
          console.error("Error fetching user:", error)
          setUser(null)
          setToken(null)
        }
      }
      setLoading(false)
    }

    checkUser()
  }, [token])

  // Register user
  const register = async (userData) => {
    try {
      const { data } = await axios.post("/auth/register", userData)
      setUser(data.user)
      setToken(data.token)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  // Login user
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/auth/login", credentials)
      setUser(data.user)
      setToken(data.token)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  // Logout user
  const logout = async () => {
    try {
      await axios.post("/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setToken(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
