import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaNotesMedical, FaEdit } from 'react-icons/fa';

const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Muhammad Hanzala Khan',
    email: 'muhammadhanzlahkhan1@gmail.com',
    phone: '+92 300 1234567',
    dob: '2003-08-26',
    bloodGroup: 'B-',
    allergies: 'None',
    medications: 'None',
    medicalHistory: 'No major illnesses'
  });

  const handleSave = () => {
    setIsEditing(false);
    // API call to save profile changes
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
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
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
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
