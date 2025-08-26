import React, { useState } from 'react';
import { FaUser, FaUserMd, FaHospital, FaTools } from 'react-icons/fa';
import { API_User, API_Doctor, API_HospitalAdmin } from '../../Components/apis/apisUrl';
import { Add_User, Register_Doctor, Register_HospitalAdmin } from '../../Components/apis/endpoints';

import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const Nav = useNavigate();
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({});
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration data:', {...formData });
    // Submit form data to the backend here
    const newUserData = { userType, ...formData };
    console.log("newUser", newUserData)
    let url = '';

    if(userType === 'doctor'){
      url = API_Doctor + Register_Doctor;
    }else if(userType === 'hospitalAdmin'){
      url = API_HospitalAdmin + Register_HospitalAdmin;
    }else {
      url = API_User + Add_User;
    }
    axios.post(url, newUserData)
    .then((res)=>{
      console.log(res);
      Nav('/')
    }).catch((err)=>{console.log(err)});

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
    <div className="max-w-xl mx-auto p-8 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Register as</h2>

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
          {commonFields}
          {renderAdditionalFields()}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
