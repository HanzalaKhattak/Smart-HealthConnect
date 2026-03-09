import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaChevronDown, FaUser, FaQuestionCircle, FaBars, FaTimes } from 'react-icons/fa'

const NavBar = () => {
  const [tokenIs, settoken] = useState(null)
  const [user, setusername] = useState(null)
  const [userType, setUserType] = useState(null)
  const [showServicesMenu, setShowServicesMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Check auth state on mount and when location changes
  useEffect(() => {
    checkAuthState();
  }, [location.pathname])

  const checkAuthState = () => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const type = localStorage.getItem('userType')
    settoken(token)
    setusername(username)
    setUserType(type)
  }

  const handlelogout = () => {
    localStorage.clear()
    settoken(null)
    setusername(null)
    setUserType(null)
    navigate('/')
  }

  const getDashboardPath = () => {
    switch(userType) {
      case 'doctor': return '/doctor-dashboard';
      case 'hospitalAdmin': return '/hospital-admin';
      case 'systemAdmin': return '/system-admin';
      default: return '/dashboard';
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className='sticky top-0 z-50 bg-white shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-green-600">Smart HealthConnect</h1>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-gray-700 text-2xl p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-6'>
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
                    <Link to={getDashboardPath()} className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                      Profile
                    </Link>
                    <hr className="my-1" />
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg ${isActive('/') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}>
              Home
            </Link>

            {/* Services Accordion */}
            <div>
              <button
                className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setShowServicesMenu(!showServicesMenu)}
              >
                <span>Services</span>
                <FaChevronDown className={`h-4 w-4 transition-transform ${showServicesMenu ? 'rotate-180' : ''}`} />
              </button>
              {showServicesMenu && (
                <div className="ml-4 space-y-1">
                  <Link to="/ai-consultation" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-green-600 text-sm">AI Health Consultation</Link>
                  <Link to="/book-appointment" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-green-600 text-sm">Book Appointment</Link>
                  <Link to="/find-doctors" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-green-600 text-sm">Find Doctors</Link>
                  <Link to="/find-hospitals" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-green-600 text-sm">Find Hospitals</Link>
                  <Link to="/find-pharmacies" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-green-600 text-sm">Find Pharmacies</Link>
                </div>
              )}
            </div>

            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg ${isActive('/about') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}>
              About
            </Link>
            <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg ${isActive('/faq') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}>
              FAQ
            </Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg ${isActive('/contact') ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}>
              Contact
            </Link>

            <hr className="my-2" />

            {tokenIs ? (
              <>
                <Link to={getDashboardPath()} onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <FaUser className="inline mr-2" /> Dashboard
                </Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Profile
                </Link>
                <button
                  onClick={() => { handlelogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar