"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Spinner from "./Spinner"

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <Spinner />
  }

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" />
}

export default AdminRoute
