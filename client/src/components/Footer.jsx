import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Wedding Hall Booking</h3>
            <p className="text-gray-300 mb-4">
              Find and book the perfect venue for your special day. We offer a wide selection of beautiful halls for
              your wedding ceremony.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-purple-400">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-purple-400">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-purple-400">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-300 hover:text-white">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span className="text-gray-300">123 Wedding Street, Delhi, India</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                <span className="text-gray-300">+1 234 567 890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span className="text-gray-300">info@weddinghalls.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-300">&copy; {currentYear} Wedding Hall Booking System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
