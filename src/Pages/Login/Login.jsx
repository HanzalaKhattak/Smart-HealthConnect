import React, { useState } from 'react';
import { FaUser, FaUserMd, FaHospital, FaTools, FaSpinner, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_User, API_Doctor, API_HospitalAdmin, API_SuperAdmin } from '../../Components/apis/apisUrl';
import { Login_User, Doctor_Login, HospitalAdmin_Login, SuperAdmin_Login } from '../../Components/apis/endpoints';
import Toast from '../../Components/Toast/Toast';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const Nav = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.email || !formData.password) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setIsLoading(true);

    const loginData = {
      email: formData.email,
      password: formData.password
    };

    let url = '';
    
    if (userType === 'doctor') {
      url = API_Doctor + Doctor_Login;
    } else if(userType === 'hospitalAdmin'){
      url = API_HospitalAdmin + HospitalAdmin_Login;
    }else if(userType === 'systemAdmin'){
      url = API_SuperAdmin + SuperAdmin_Login;
    }else{
      // For all other user types (patient, hospitalAdmin, systemAdmin), use the user login endpoint
      url = API_User + Login_User;
    }

    try {
      const res = await axios.post(url, loginData);
      console.log("Login response:", res);
      const data = res.data;
      
      if (data) {
        showToast('Login successful! Redirecting...', 'success');

        const finalizeLogin = (account, type, redirectTo, tokenOverride) => {
          const token = tokenOverride || data.token || data.User_Token;
          localStorage.setItem('token', token);
          localStorage.setItem('username', account?.fullName || account?.username || '');
          localStorage.setItem('userInfo', account?.email || '');
          localStorage.setItem('userId', account?._id || '');
          localStorage.setItem('userType', type);
          if (account?.hospitalName) localStorage.setItem('hospitalName', account.hospitalName);
          login({ id: account?._id, username: account?.fullName || account?.username, email: account?.email, userType: type });
          setTimeout(() => Nav(redirectTo), 1200);
        };

        if (userType === 'doctor') {
          finalizeLogin(data.LoginDoctor, 'doctor', '/doctor-dashboard');
        } else if (userType === 'hospitalAdmin') {
          finalizeLogin(data.LoginHospitalAdmin, 'hospitalAdmin', '/hospital-admin');
        } else if (userType === 'systemAdmin') {
          finalizeLogin(data.LoginSuperAdmin, 'systemAdmin', '/system-admin');
        } else {
          finalizeLogin(data.LoginUser, 'patient', '/dashboard', data.User_Token || data.token);
        }
      }
    } catch (err) {
      console.log('Login error:', err);
      if (err.response?.data?.pendingApproval) {
        showToast(err.response.data.wrn || 'Your account is awaiting approval.', 'error');
      } else {
        const errorMsg = err.response?.data?.wrn || err.response?.data?.msg || 'Login failed. Please check your credentials.';
        showToast(errorMsg, 'error');
      }
    } finally {
      setIsLoading(false);
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

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Sign in to continue to Smart HealthConnect</p>

        {/* User Type Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">I am a:</p>
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

        {/* Login Form */}
        {userType ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-green-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p>Please select your account type above to continue</p>
          </div>
        )}

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:text-green-700 hover:underline">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login