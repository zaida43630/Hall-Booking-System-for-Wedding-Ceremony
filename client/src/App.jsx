import { Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Spinner from "./components/Spinner"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

// Lazy load pages
const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const HallDetails = lazy(() => import("./pages/HallDetails"))
const BookingForm = lazy(() => import("./pages/BookingForm"))
const PaymentPage = lazy(() => import("./pages/PaymentPage"))
const UserDashboard = lazy(() => import("./pages/UserDashboard"))
const UserBookings = lazy(() => import("./pages/UserBookings"))
const UserPayments = lazy(() => import("./pages/UserPayments"))
const UserNotifications = lazy(() => import("./pages/UserNotifications"))
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))
const AdminHalls = lazy(() => import("./pages/admin/AdminHalls"))
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"))
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"))
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"))
const NotFound = lazy(() => import("./pages/NotFound"))

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/halls/:id" element={<HallDetails />} />

            {/* Protected Routes (User) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/book/:hallId" element={<BookingForm />} />
              <Route path="/payment/:bookingId" element={<PaymentPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/my-bookings" element={<UserBookings />} />
              <Route path="/my-payments" element={<UserPayments />} />
              <Route path="/notifications" element={<UserNotifications />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/halls" element={<AdminHalls />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
