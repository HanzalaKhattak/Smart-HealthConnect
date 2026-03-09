import React, { useState } from 'react';
import { FaUser, FaUserMd, FaHospital, FaTools, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { API_User, API_Doctor, API_HospitalAdmin, API_SuperAdmin } from '../../Components/apis/apisUrl';
import { Add_User, Register_Doctor, Register_HospitalAdmin, Register_SuperAdin } from '../../Components/apis/endpoints';
import Toast from '../../Components/Toast/Toast';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {
  const Nav = useNavigate();
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (message, type) => {
    setToast({ message, type, id: Date.now() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userType) {
      showToast('Please select a user type', 'error');
      return;
    }

    setIsLoading(true);
    console.log('Registration data:', {...formData });
    const newUserData = { userType, ...formData };
    console.log("newUser", newUserData)
    let url = '';

    if(userType === 'doctor'){
      url = API_Doctor + Register_Doctor;
    }else if(userType === 'hospitalAdmin'){
      url = API_HospitalAdmin + Register_HospitalAdmin;
    }else if(userType === 'systemAdmin'){
      url = API_SuperAdmin + Register_SuperAdin;
    }else {
      url = API_User + Add_User;
    }

    try {
      const res = await axios.post(url, newUserData);
      console.log(res);
      showToast('Registration successful! Redirecting to login...', 'success');
      setTimeout(() => {
        Nav('/login');
      }, 2000);
    } catch (err) {
      console.log(err);
      const errorMsg = err.response?.data?.msg || 'Registration failed. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const commonFields = (
    <>
      <input
        type="text"
        name="username"
        placeholder="Full Name"
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
    </>
  );

  const renderAdditionalFields = () => {
    switch (userType) {
      case 'doctor':
        return (
          <>
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              name="licenseNumber"
              placeholder="Medical License Number"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </>
        );
      case 'hospitalAdmin':
        return (
          <>
            <input
              type="text"
              name="hospitalName"
              placeholder="Hospital Name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              name="hospitalId"
              placeholder="Hospital ID"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </>
        );
      case 'systemAdmin':
        return (
          <>
            <input
              type="text"
              name="adminCode"
              placeholder="System Admin Code"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-xl w-full p-5 sm:p-8 bg-white shadow-xl rounded-2xl animate-fade-in">
        {/* Back to Home Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 sm:mb-6 transition-colors">
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Join Smart HealthConnect today</p>

        {/* User Type Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">I want to register as:</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                userType === 'patient'
                  ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              <FaUser /> Patient
            </button>

            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                userType === 'doctor'
                  ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              <FaUserMd /> Doctor
            </button>

            <button
              type="button"
              onClick={() => setUserType('hospitalAdmin')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                userType === 'hospitalAdmin'
                  ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              <FaHospital /> Hospital Admin
            </button>

            <button
              type="button"
              onClick={() => setUserType('systemAdmin')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                userType === 'systemAdmin'
                  ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              <FaTools /> System Admin
            </button>
          </div>
        </div>

        {/* Registration Form */}
        {userType ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {commonFields}
            {renderAdditionalFields()}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p>Please select a user type above to continue</p>
          </div>
        )}

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
