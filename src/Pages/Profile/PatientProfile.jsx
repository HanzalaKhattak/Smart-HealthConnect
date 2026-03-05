import React, { useState, useEffect } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaNotesMedical,
  FaEdit, FaSpinner, FaUserMd, FaHospital, FaIdCard,
  FaBriefcase, FaMapMarkerAlt, FaShieldAlt
} from 'react-icons/fa';
import axios from 'axios';
import { API_User, API_Doctor, API_HospitalAdmin } from '../../Components/apis/apisUrl';
import { Get_User, Update_User, Get_Specific_Doctor, Update_Doctor } from '../../Components/apis/endpoints';

/* ─── role config ─────────────────────────────────────────── */
const ROLE_META = {
  patient: {
    label: 'Patient',
    icon: <FaUser />,
    color: 'from-green-600 to-green-700',
    badge: 'bg-green-100 text-green-800',
  },
  doctor: {
    label: 'Doctor',
    icon: <FaUserMd />,
    color: 'from-blue-600 to-blue-700',
    badge: 'bg-blue-100 text-blue-800',
  },
  hospitalAdmin: {
    label: 'Hospital Admin',
    icon: <FaHospital />,
    color: 'from-purple-600 to-purple-700',
    badge: 'bg-purple-100 text-purple-800',
  },
  systemAdmin: {
    label: 'System Admin',
    icon: <FaShieldAlt />,
    color: 'from-red-600 to-red-700',
    badge: 'bg-red-100 text-red-800',
  },
};

/* ─── reusable field ──────────────────────────────────────── */
const Field = ({ label, icon, value, name, type = 'text', editing, onChange, readOnly = false, options }) => (
  <div className="space-y-1">
    <label className="flex items-center gap-2 text-sm text-gray-500">
      <span>{icon}</span>
      {label}
    </label>
    {editing && !readOnly ? (
      options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-current focus:outline-none"
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-current focus:outline-none"
        />
      )
    ) : (
      <p className="text-gray-800 font-medium">{value || <span className="text-gray-400 italic">—</span>}</p>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════ */
const PatientProfile = () => {
  const userType = localStorage.getItem('userType') || 'patient';
  const meta = ROLE_META[userType] || ROLE_META.patient;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState({ type: '', text: '' });
  const [profile, setProfile]     = useState({});

  /* ── fetch on mount ── */
  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    const token  = localStorage.getItem('token');

    try {
      if (userType === 'doctor') {
        const res = await axios.get(`${API_Doctor}${Get_Specific_Doctor}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data.Doctor || res.data;
        setProfile({
          username:       d.username       || '',
          email:          d.email          || '',
          specialization: d.specialization || '',
          experience:     d.experience     || '',
          licenseNumber:  d.licenseNumber  || '',
          hospitalName:   d.hospitalName   || '',
          latitude:       d.latitude       || '',
          longitude:      d.longitude      || '',
          isApproved:     d.isApproved,
          status:         d.status         || '',
        });

      } else if (userType === 'hospitalAdmin') {
        const res = await axios.get(`${API_HospitalAdmin}/getSpecificHospAdmin/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data.HospitalAdmin || res.data;
        setProfile({
          username:    d.username    || localStorage.getItem('username')    || '',
          email:       d.email      || localStorage.getItem('userInfo')     || '',
          hospitalName: d.hospitalName || localStorage.getItem('hospitalName') || '',
          hospitalId:  d.hospitalId  || '',
        });

      } else if (userType === 'systemAdmin') {
        setProfile({
          username: localStorage.getItem('username') || '',
          email:    localStorage.getItem('userInfo')  || '',
        });

      } else {
        // patient (default)
        const res = await axios.get(`${API_User}${Get_User}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data;
        setProfile({
          username:       d.username    || '',
          email:          d.email       || '',
          phone:          d.phone       || '',
          dob:            d.dateOfBirth ? d.dateOfBirth.split('T')[0] : '',
          bloodGroup:     d.bloodGroup  || 'O+',
          allergies:      d.allergies   || 'None',
          medications:    d.medications || 'None',
          medicalHistory: d.medicalHistory || 'No major illnesses',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile({
        username: localStorage.getItem('username') || '',
        email:    localStorage.getItem('userInfo')  || '',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── generic field change ── */
  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ── save ── */
  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    const userId = localStorage.getItem('userId');
    const token  = localStorage.getItem('token');

    try {
      if (userType === 'doctor') {
        await axios.put(`${API_Doctor}${Update_Doctor}/${userId}`, {
          username:       profile.username,
          email:          profile.email,
          specialization: profile.specialization,
          experience:     profile.experience,
          licenseNumber:  profile.licenseNumber,
          hospitalName:   profile.hospitalName,
          latitude:       profile.latitude,
          longitude:      profile.longitude,
        }, { headers: { Authorization: `Bearer ${token}` } });

      } else if (userType === 'hospitalAdmin') {
        await axios.put(`${API_HospitalAdmin}/updateHospAdmin/${userId}`, {
          username:    profile.username,
          email:       profile.email,
          hospitalName: profile.hospitalName,
        }, { headers: { Authorization: `Bearer ${token}` } });

      } else if (userType !== 'systemAdmin') {
        // patient
        await axios.put(`${API_User}${Update_User}/${userId}`, {
          username:       profile.username,
          email:          profile.email,
          phone:          profile.phone,
          dateOfBirth:    profile.dob,
          bloodGroup:     profile.bloodGroup,
          allergies:      profile.allergies,
          medications:    profile.medications,
          medicalHistory: profile.medicalHistory,
        }, { headers: { Authorization: `Bearer ${token}` } });
      }

      localStorage.setItem('username', profile.username);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  /* ── loading screen ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-green-600 text-4xl" />
      </div>
    );
  }

  const canEdit = userType !== 'systemAdmin';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Toast */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

          {/* ── Header ── */}
          <div className={`bg-gradient-to-r ${meta.color} px-6 py-5`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-3 text-white text-xl">
                  {meta.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.username || 'My Profile'}</h1>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>
              </div>

              {canEdit && (
                <button
                  onClick={() => { setIsEditing(!isEditing); setMessage({ type: '', text: '' }); }}
                  className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              )}
            </div>
          </div>

          {/* ── Body ── */}
          <div className="p-6 space-y-6">

            {/* ──── PATIENT ──── */}
            {(userType === 'patient' || !ROLE_META[userType]) && (
              <>
                <section>
                  <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaUser className="text-green-600" /> Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Full Name"    icon={<FaUser className="text-green-600" />}        name="username" value={profile.username} editing={isEditing} onChange={handleChange} />
                    <Field label="Email"         icon={<FaEnvelope className="text-green-600" />}    name="email"    value={profile.email}    editing={isEditing} onChange={handleChange} type="email" />
                    <Field label="Phone"         icon={<FaPhone className="text-green-600" />}       name="phone"    value={profile.phone}    editing={isEditing} onChange={handleChange} type="tel" />
                    <Field label="Date of Birth" icon={<FaCalendarAlt className="text-green-600" />} name="dob"      value={profile.dob}      editing={isEditing} onChange={handleChange} type="date" />
                  </div>
                </section>

                <div className="border-t pt-5">
                  <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaNotesMedical className="text-green-600" /> Medical Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Blood Group"         icon={<FaNotesMedical className="text-green-600" />} name="bloodGroup"     value={profile.bloodGroup}     editing={isEditing} onChange={handleChange} options={['A+','A-','B+','B-','AB+','AB-','O+','O-']} />
                    <Field label="Allergies"            icon={<FaNotesMedical className="text-green-600" />} name="allergies"      value={profile.allergies}      editing={isEditing} onChange={handleChange} />
                    <Field label="Current Medications"  icon={<FaNotesMedical className="text-green-600" />} name="medications"    value={profile.medications}    editing={isEditing} onChange={handleChange} />
                    <Field label="Medical History"      icon={<FaNotesMedical className="text-green-600" />} name="medicalHistory" value={profile.medicalHistory}  editing={isEditing} onChange={handleChange} />
                  </div>
                </div>
              </>
            )}

            {/* ──── DOCTOR ──── */}
            {userType === 'doctor' && (
              <>
                <section>
                  <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaUserMd className="text-blue-600" /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Full Name" icon={<FaUser className="text-blue-600" />}     name="username" value={profile.username} editing={isEditing} onChange={handleChange} />
                    <Field label="Email"     icon={<FaEnvelope className="text-blue-600" />} name="email"    value={profile.email}    editing={isEditing} onChange={handleChange} type="email" />
                  </div>
                </section>

                <div className="border-t pt-5">
                  <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaIdCard className="text-blue-600" /> Professional Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Specialization"    icon={<FaUserMd className="text-blue-600" />}       name="specialization" value={profile.specialization} editing={isEditing} onChange={handleChange} />
                    <Field label="Experience"         icon={<FaBriefcase className="text-blue-600" />}    name="experience"     value={profile.experience}     editing={isEditing} onChange={handleChange} />
                    <Field label="License Number"     icon={<FaIdCard className="text-blue-600" />}       name="licenseNumber"  value={profile.licenseNumber}  editing={isEditing} onChange={handleChange} />
                    <Field label="Hospital / Clinic"  icon={<FaHospital className="text-blue-600" />}     name="hospitalName"   value={profile.hospitalName}   editing={isEditing} onChange={handleChange} />
                    <Field label="Latitude"           icon={<FaMapMarkerAlt className="text-blue-600" />} name="latitude"       value={profile.latitude}       editing={false}     onChange={handleChange} readOnly />
                    <Field label="Longitude"          icon={<FaMapMarkerAlt className="text-blue-600" />} name="longitude"      value={profile.longitude}      editing={false}     onChange={handleChange} readOnly />
                  </div>
                </div>

                <div className="border-t pt-4 flex gap-3 flex-wrap">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${profile.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {profile.isApproved ? 'Approved' : 'Pending Approval'}
                  </span>
                  {profile.status && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                      {profile.status}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* ──── HOSPITAL ADMIN ──── */}
            {userType === 'hospitalAdmin' && (
              <section>
                <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaHospital className="text-purple-600" /> Admin Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Username"      icon={<FaUser className="text-purple-600" />}     name="username"    value={profile.username}    editing={isEditing} onChange={handleChange} />
                  <Field label="Email"         icon={<FaEnvelope className="text-purple-600" />} name="email"       value={profile.email}       editing={isEditing} onChange={handleChange} type="email" />
                  <Field label="Hospital Name" icon={<FaHospital className="text-purple-600" />} name="hospitalName" value={profile.hospitalName} editing={isEditing} onChange={handleChange} />
                  <Field label="Hospital ID"   icon={<FaIdCard className="text-purple-600" />}   name="hospitalId"  value={profile.hospitalId}  editing={false}     onChange={handleChange} readOnly />
                </div>
              </section>
            )}

            {/* ──── SYSTEM ADMIN ──── */}
            {userType === 'systemAdmin' && (
              <section>
                <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-red-600" /> Admin Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Username" icon={<FaUser className="text-red-600" />}    name="username" value={profile.username} editing={false} onChange={handleChange} />
                  <Field label="Email"    icon={<FaEnvelope className="text-red-600" />} name="email"    value={profile.email}    editing={false} onChange={handleChange} />
                </div>
                <p className="mt-4 text-xs text-gray-400 italic">System admin profiles are managed by the system.</p>
              </section>
            )}

            {/* ── Save button ── */}
            {isEditing && canEdit && (
              <div className="flex justify-end border-t pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    saving ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {saving ? <><FaSpinner className="animate-spin" /> Saving...</> : 'Save Changes'}
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
