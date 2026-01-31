import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaNotesMedical, FaEdit, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { API_User } from '../../Components/apis/apisUrl';
import { Get_User, Update_User } from '../../Components/apis/endpoints';

const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    bloodGroup: 'O+',
    allergies: 'None',
    medications: 'None',
    medicalHistory: 'No major illnesses'
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId) {
        setMessage({ type: 'error', text: 'User not found. Please login again.' });
        return;
      }
      
      const response = await axios.get(`${API_User}${Get_User}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data;
      setProfile({
        name: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dob: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        bloodGroup: userData.bloodGroup || 'O+',
        allergies: userData.allergies || 'None',
        medications: userData.medications || 'None',
        medicalHistory: userData.medicalHistory || 'No major illnesses'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use localStorage data as fallback
      setProfile(prev => ({
        ...prev,
        name: localStorage.getItem('username') || '',
        email: ''
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      const updateData = {
        username: profile.name,
        email: profile.email,
        phone: profile.phone,
        dateOfBirth: profile.dob,
        bloodGroup: profile.bloodGroup,
        allergies: profile.allergies,
        medications: profile.medications,
        medicalHistory: profile.medicalHistory
      };
      
      await axios.put(`${API_User}${Update_User}/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update localStorage
      localStorage.setItem('username', profile.name);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-green-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Message Toast */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
        
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Patient Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-600">
                  <FaUser className="text-green-600" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-green-600" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-green-600" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-600">
                  <FaCalendarAlt className="text-green-600" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => setProfile({...profile, dob: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.dob}</p>
                )}
              </div>
            </div>

            {/* Medical Info */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaNotesMedical className="text-green-600" />
                Medical Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-600">Blood Group</label>
                  {isEditing ? (
                    <select
                      value={profile.bloodGroup}
                      onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium">{profile.bloodGroup}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-gray-600">Allergies</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.allergies}
                      onChange={(e) => setProfile({...profile, allergies: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{profile.allergies}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-gray-600">Current Medications</label>
                  {isEditing ? (
                    <textarea
                      value={profile.medications}
                      onChange={(e) => setProfile({...profile, medications: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{profile.medications}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-gray-600">Medical History</label>
                  {isEditing ? (
                    <textarea
                      value={profile.medicalHistory}
                      onChange={(e) => setProfile({...profile, medicalHistory: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{profile.medicalHistory}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                    saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
