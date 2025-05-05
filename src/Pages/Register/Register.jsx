import React, { useState } from 'react';
import { FaUser, FaUserMd, FaHospital, FaTools } from 'react-icons/fa';

const RegisterForm = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration data:', { userType, ...formData });
    // Handle form submission logic here
  };

  const commonFields = (
    <>
      <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="input" required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="input" required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input" required />
    </>
  );

  const renderAdditionalFields = () => {
    switch (userType) {
      case 'doctor':
        return (
          <>
            <input type="text" name="specialization" placeholder="Specialization" onChange={handleChange} className="input" required />
            <input type="text" name="license" placeholder="Medical License Number" onChange={handleChange} className="input" required />
          </>
        );
      case 'hospitalAdmin':
        return (
          <>
            <input type="text" name="hospitalName" placeholder="Hospital Name" onChange={handleChange} className="input" required />
            <input type="text" name="hospitalID" placeholder="Hospital ID" onChange={handleChange} className="input" required />
          </>
        );
      case 'systemAdmin':
        return (
          <>
            <input type="text" name="adminCode" placeholder="System Admin Code" onChange={handleChange} className="input" required />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Register as</h2>
      <div className="flex justify-around mb-6">
        <button onClick={() => setUserType('patient')} className={`btn ${userType === 'patient' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}><FaUser className="inline mr-2" /> Patient</button>
        <button onClick={() => setUserType('doctor')} className={`btn ${userType === 'doctor' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}><FaUserMd className="inline mr-2" /> Doctor</button>
        <button onClick={() => setUserType('hospitalAdmin')} className={`btn ${userType === 'hospitalAdmin' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}><FaHospital className="inline mr-2" /> Hospital Admin</button>
        <button onClick={() => setUserType('systemAdmin')} className={`btn ${userType === 'systemAdmin' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}><FaTools className="inline mr-2" /> System Admin</button>
      </div>

      {userType && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {commonFields}
          {renderAdditionalFields()}
          <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Register</button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;

/* Tailwind Utility Class Helpers */
/* You can also move these to your CSS if needed */
/* .input and .btn are just shortcuts */
// .input: w-full p-2 border rounded
// .btn: px-3 py-2 rounded shadow hover:shadow-md transition
