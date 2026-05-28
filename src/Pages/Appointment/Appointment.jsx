import React, { useState, useEffect } from 'react';
import { 
  FaUserMd, FaCalendarAlt, FaClock, FaSearch, FaMapMarkerAlt,
  FaStethoscope, FaCheckCircle, FaStar, FaFilter
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_Doctor, API_Appointment } from '../../Components/apis/apisUrl';
import { Get_All_Doctors, Create_Appointment } from '../../Components/apis/endpoints';
import Toast from '../../Components/Toast/Toast';

const Appointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Date/Time, 3: Patient Details
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    doctorSpecialty: '',
    appointmentDate: '',
    appointmentTime: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    contactNumber: '',
    symptoms: '',
    notes: ''
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  const specialties = ['all', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Medicine'];

  useEffect(() => {
    fetchDoctors();
    loadUserData();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchQuery, selectedSpecialty, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_Doctor + Get_All_Doctors);
      const doctorsData = response.data.Doctors || response.data || [];
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      showToast('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = () => {
    const username = localStorage.getItem('username');
    if (username) {
      setFormData(prev => ({ ...prev, patientName: username }));
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(doc => 
        doc.specialization?.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDoctorSelect = (doctor) => {
    setFormData({
      ...formData,
      doctorId: doctor._id,
      doctorName: doctor.username,
      doctorSpecialty: doctor.specialization
    });
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, appointmentTime: time });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.appointmentDate) {
      showToast('Please select appointment date', 'error');
      return false;
    }
    if (!formData.appointmentTime) {
      showToast('Please select appointment time', 'error');
      return false;
    }
    if (!formData.patientName || !formData.patientAge || !formData.patientGender) {
      showToast('Please fill all patient details', 'error');
      return false;
    }
    if (!formData.contactNumber) {
      showToast('Please provide contact number', 'error');
      return false;
    }
    if (!formData.symptoms) {
      showToast('Please describe your symptoms', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const patientId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!patientId) {
        showToast('Please login to book appointment', 'error');
        navigate('/login');
        return;
      }

      const appointmentData = {
        patientId,
        doctorId: formData.doctorId,
        patientName: formData.patientName,
        patientAge: parseInt(formData.patientAge),
        patientGender: formData.patientGender,
        contactNumber: formData.contactNumber,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        symptoms: formData.symptoms,
        notes: formData.notes
      };

      const response = await axios.post(
        API_Appointment + Create_Appointment, 
        appointmentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.appointment) {
        const appt = response.data.appointment;
        const fee = Number(appt.consultationFee || 0);
        showToast('Appointment booked successfully!', 'success');

        setTimeout(() => {
          if (fee > 0 && appt.paymentStatus !== 'paid') {
            navigate(`/payment/${appt._id}`);
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMsg = error.response?.data?.msg || 'Failed to book appointment. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {toast.show && <Toast message={toast.message} type={toast.type} />}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Book an Appointment</h1>
          <p className="text-gray-600 text-sm sm:text-base">Schedule your consultation with our expert doctors</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <StepIndicator number={1} label="Select Doctor" active={step === 1} completed={step > 1} />
            <div className={`h-1 w-8 sm:w-16 ${step > 1 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <StepIndicator number={2} label="Date & Time" active={step === 2} completed={step > 2} />
            <div className={`h-1 w-8 sm:w-16 ${step > 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <StepIndicator number={3} label="Details" active={step === 3} completed={false} />
          </div>
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by doctor name or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                {/* Specialty Filter */}
                <div className="relative">
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none pr-10 bg-white"
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty === 'all' ? 'All Specialties' : specialty}
                      </option>
                    ))}
                  </select>
                  <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Doctors List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading doctors...</p>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-12">
                  <FaUserMd className="text-gray-300 text-6xl mx-auto mb-4" />
                  <p className="text-gray-600">No doctors found</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard 
                      key={doctor._id} 
                      doctor={doctor} 
                      onSelect={() => handleDoctorSelect(doctor)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Selected Doctor Info */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                <div className="flex items-center gap-3">
                  <FaUserMd className="text-green-600 text-2xl" />
                  <div>
                    <p className="font-semibold text-gray-800">{formData.doctorName}</p>
                    <p className="text-sm text-gray-600">{formData.doctorSpecialty}</p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-green-600" /> Select Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Time Slots */}
              <div className="mb-6">
                <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <FaClock className="text-green-600" /> Select Time Slot
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.appointmentTime === time
                          ? 'bg-green-600 text-white border-green-600 font-semibold'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!formData.appointmentDate || !formData.appointmentTime) {
                      showToast('Please select date and time', 'error');
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Patient Details */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Appointment Summary */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                <h3 className="font-semibold text-gray-800 mb-2">Appointment Summary</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Doctor</p>
                    <p className="font-medium text-gray-800">{formData.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium text-gray-800">{new Date(formData.appointmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-medium text-gray-800">{formData.appointmentTime}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Age *</label>
                    <input
                      type="number"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      placeholder="Enter your age"
                      min="1"
                      max="150"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Gender *</label>
                    <select
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Contact Number *</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="03XX-XXXXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Symptoms / Reason for Visit *</label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Describe your symptoms or reason for consultation"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Additional Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information for the doctor"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  ></textarea>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Confirm Appointment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Step Indicator Component
const StepIndicator = ({ number, label, active, completed }) => (
  <div className="flex flex-col items-center">
    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
      completed ? 'bg-green-600 text-white' : active ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
    }`}>
      {completed ? <FaCheckCircle /> : number}
    </div>
    <p className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium ${
      active ? 'text-green-600' : 'text-gray-500'
    }`}>
      {label}
    </p>
  </div>
);

// Doctor Card Component
const DoctorCard = ({ doctor, onSelect }) => (
  <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer group"
    onClick={onSelect}
  >
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold group-hover:bg-green-600 group-hover:text-white transition-colors">
        {doctor.username?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg mb-1">Dr. {doctor.username}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <FaStethoscope className="text-green-600" />
          <span>{doctor.specialization || 'General Physician'}</span>
        </div>
        {doctor.experience && (
          <p className="text-sm text-gray-500 mb-2">{doctor.experience} experience</p>
        )}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar key={star} className="text-yellow-400 text-xs" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
        </div>
      </div>
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
        Select
      </button>
    </div>
  </div>
);

export default Appointment;
