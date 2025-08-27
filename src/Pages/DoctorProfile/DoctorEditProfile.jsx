import React, { useState } from 'react';
import LocationPicker from "../../Components/LocationPicker/LocationPicker";

const DoctorEditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    specialization: '',
    licenseNumber: '',
    hospitalName: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated profile data:', formData);
    // Here you would send the data to your backend API
    // The latitude and longitude will be included in the formData
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Doctor Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            
            <input
              type="text"
              name="licenseNumber"
              placeholder="Medical License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            
            <input
              type="text"
              name="hospitalName"
              placeholder="Hospital/Clinic Name"
              value={formData.hospitalName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            
            {/* Location Coordinates Display */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                readOnly
              />
              
              <input
                type="text"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                readOnly
              />
            </div>
          </div>
          
          {/* Right Column - Map */}
          <div className="overflow-hidden rounded-xl">
            <LocationPicker 
              onLocationSelect={handleLocationSelect}
              initialPosition={formData.latitude && formData.longitude ? [parseFloat(formData.latitude), parseFloat(formData.longitude)] : null}
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default DoctorEditProfile;
