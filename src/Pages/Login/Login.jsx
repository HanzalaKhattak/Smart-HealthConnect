import React, { useState } from 'react';
import { FaUser, FaUserMd, FaHospital, FaTools } from 'react-icons/fa';
import { API_User, API_Doctor, API_HospitalAdmin, API_SuperAdmin } from '../../Components/apis/apisUrl';
import { Login_User, Doctor_Login, HospitalAdmin_Login, SuperAdmin_Login } from '../../Components/apis/endpoints';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const Nav = useNavigate();
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({});
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert("Please fill all the fields");
      return;
    }

    const loginData = {
      email: formData.email,
      password: formData.password
    };

    // Add specialization for doctor login
    if (userType === 'doctor' && formData.specialization) {
      loginData.specialization = formData.specialization;
    }

    if(userType === 'hospitalAdmin' && formData.hospitalName && formData.hospitalId) {
      loginData.hospitalName = formData.hospitalName;
      loginData.hospitalId = formData.hospitalId;
    }

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
        setMsg(data.msg || "Login successful");
        
        // Store token and user info based on user type
        if (userType === 'doctor') {
          localStorage.setItem('token', data.Doctor_Token || data.token);
          localStorage.setItem('username', data?.LoginDoctor?.username);
          localStorage.setItem('userInfo', data.LoginDoctor?.email);
          localStorage.setItem('userType', 'doctor');
          Nav('/doctor-dashboard');
        } if(userType === 'hospitalAdmin'){
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.LoginHospitalAdmin.username);
          localStorage.setItem('userInfo', data.LoginHospitalAdmin.email);
          localStorage.setItem('userType', 'hospitalAdmin');
          Nav('/hospital-admin')
        } if(userType === 'systemAdmin'){
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.LoginSuperAdmin.username);
          localStorage.setItem('userInfo', data.LoginSuperAdmin.email);
          localStorage.setItem('userType', 'systemAdmin')
          Nav('/system-admin');
        } else {
          localStorage.setItem('token', data.User_Token || data.token);
          localStorage.setItem('username', data.LoginUser?.username || data.username);
          localStorage.setItem('userInfo', data.LoginUser?.email || data.email);
          localStorage.setItem('userType', userType);
          Nav('/dashboard');
        }
        
      }
    } catch (err) {
      console.log("Login error:", err);
      setMsg("Login failed. Please check your credentials.");
    }
  };
  return (
    <div className="max-w-xl mx-auto p-8 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Login as</h2>
      
      {msg && (
        <div className="mb-4 p-3 text-center text-green-600 bg-green-100 rounded-lg">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => setUserType('patient')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
            userType === 'patient'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <FaUser /> Patient
        </button>

        <button
          type="button"
          onClick={() => setUserType('doctor')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
            userType === 'doctor'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <FaUserMd /> Doctor
        </button>

        <button
          type="button"
          onClick={() => setUserType('hospitalAdmin')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
            userType === 'hospitalAdmin'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <FaHospital /> Hospital Admin
        </button>

        <button
          type="button"
          onClick={() => setUserType('systemAdmin')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
            userType === 'systemAdmin'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <FaTools /> System Admin
        </button>
      </div>

      {userType && (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {userType === 'doctor' && (
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          )}

          {userType === 'hospitalAdmin' && (
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
          )}
          
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login