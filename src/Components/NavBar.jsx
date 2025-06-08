import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaChevronDown, FaUser, FaQuestionCircle } from 'react-icons/fa'

const NavBar = () => {
  const [tokenIs, settoken] = useState(null)
  const [user, setusername] = useState(null)
  const [showServicesMenu, setShowServicesMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    settoken(token)
    setusername(username)
  }, [])

  const handlelogout = () => {
    localStorage.clear()
    settoken(null)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className='sticky top-0 z-50 bg-white shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-green-600">Smart HealthConnect</h1>
          </Link>

          <div className='flex items-center space-x-6'>
            {/* Main Navigation */}
            <Link to="/"
              className={`hover:text-green-600 ${isActive('/') ? 'text-green-600' : 'text-gray-700'}`}>
              Home
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600"
                onMouseEnter={() => setShowServicesMenu(true)}
                onMouseLeave={() => setShowServicesMenu(false)}
              >
                <span>Services</span>
                <FaChevronDown className="h-4 w-4" />
              </button>

              {showServicesMenu && (
                <div
                  className="absolute top-full right-0 w-56 bg-white border rounded-lg shadow-lg py-2 mt-1"
                  onMouseEnter={() => setShowServicesMenu(true)}
                  onMouseLeave={() => setShowServicesMenu(false)}
                >                  <Link to="/ai-consultation" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                    AI Health Consultation
                  </Link>
                  <Link to="/book-appointment" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                    Book Appointment
                  </Link>
                  <Link to="/find-doctors" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                    Find Doctors
                  </Link>
                  <Link to="/find-hospitals" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                    Find Hospitals
                  </Link>
                  <Link to="/find-pharmacies" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                    Find Pharmacies
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about"
              className={`hover:text-green-600 ${isActive('/about') ? 'text-green-600' : 'text-gray-700'}`}>
              About
            </Link>

            <Link to="/faq"
              className={`hover:text-green-600 ${isActive('/faq') ? 'text-green-600' : 'text-gray-700'}`}>
              FAQ
            </Link>

            <Link to="/contact"
              className={`hover:text-green-600 ${isActive('/contact') ? 'text-green-600' : 'text-gray-700'}`}>
              Contact
            </Link>

            {/* User Menu */}
            {tokenIs ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <FaUser />
                  <span>{user}</span>
                  <FaChevronDown className="h-4 w-4" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute top-full right-0 w-48 bg-white border rounded-lg shadow-lg py-2 mt-1"
                    onMouseEnter={() => setShowUserMenu(true)}
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                      Profile
                    </Link>
                    <button
                      onClick={handlelogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-green-600 hover:text-green-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar