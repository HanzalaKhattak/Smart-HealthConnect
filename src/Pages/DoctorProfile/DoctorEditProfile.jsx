import React, { useState } from 'react';
import LocationPicker from "../../Components/LocationPicker/LocationPicker";
import { Update_Doctor } from '../../Components/apis/endpoints';
import { API_Doctor } from '../../Components/apis/apisUrl';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const updateDoctorProfile = async (profileData) => {
    try {
      setLoading(true);
      setMessage('');
      
      // Get doctor ID from localStorage or wherever you store it
      const doctorId = localStorage.getItem('userId') || 'DOCTOR_ID_HERE'; // Replace with actual doctor ID
      const token = localStorage.getItem('token');
      
      // Replace :DoctorId with actual doctor ID in the endpoint
      const endpoint = Update_Doctor.replace(':DoctorId', doctorId);
      const url = API_Doctor + endpoint;
      
      const response = await axios.put(url, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile updated successfully:', response.data);
      setMessage('Profile updated successfully!');
      return response.data;
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Updated profile data:', formData);
    
    try {
      await updateDoctorProfile(formData);
      // Clear form fields after successful submission
      setFormData({
        username: '',
        email: '',
        specialization: '',
        licenseNumber: '',
        hospitalName: '',
        latitude: '',
        longitude: ''
      });
      // Optionally redirect or show success message
    } catch (err) {
      // Error is already handled in updateDoctorProfile function
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Doctor Profile</h2>
      
      {message && (
        <div className={`mb-4 p-3 text-center rounded-lg ${
          message.includes('successfully') 
            ? 'text-green-600 bg-green-100' 
            : 'text-red-600 bg-red-100'
        }`}>
          {message}
        </div>
      )}
      
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
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg font-semibold transition duration-200 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default DoctorEditProfile;
