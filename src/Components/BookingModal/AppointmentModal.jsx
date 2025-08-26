import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaUserMd, FaClipboardList } from 'react-icons/fa';

const AppointmentModal = ({ isOpen, onClose, doctor }) => {
  const [step, setStep] = useState(doctor ? 1 : 0); // Start at step 0 if no doctor selected
  const [selectedDoctor, setSelectedDoctor] = useState(doctor);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'consultation',
    symptoms: '',
    notes: ''
  });

  // Sample doctors list for selection
  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      experience: '12 years',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      hospital: 'City General Hospital'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      experience: '8 years',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      hospital: 'Skin Care Clinic'
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialization: 'Pediatrics',
      experience: '10 years',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      hospital: 'Children\'s Medical Center'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialization: 'Orthopedics',
      experience: '15 years',
      image: 'https://randomuser.me/api/portraits/men/54.jpg',
      hospital: 'Bone & Joint Institute'
    }
  ];

  const availableTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle appointment submission
    console.log('Appointment booked:', {
      doctor: selectedDoctor || doctor,
      ...formData
    });

    // Reset form and close modal
    setFormData({
      date: '',
      time: '',
      type: 'consultation',
      symptoms: '',
      notes: ''
    });
    setStep(doctor ? 1 : 0);
    setSelectedDoctor(doctor);
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      date: '',
      time: '',
      type: 'consultation',
      symptoms: '',
      notes: ''
    });
    setStep(doctor ? 1 : 0);
    setSelectedDoctor(doctor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all animate-fade-in">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Progress Indicator */}
          <div className="flex justify-between mb-8">
            {(doctor ? [1, 2, 3] : [0, 1, 2, 3]).map((i, index) => (
              <div
                key={i}
                className={`flex items-center ${index < (doctor ? 2 : 3) ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= i
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {doctor ? i : i + 1}
                </div>
                {index < (doctor ? 2 : 3) && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > i ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <form onSubmit={handleSubmit}>
            {step === 0 && !doctor && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUserMd className="text-green-600" />
                    Select a Doctor
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setStep(1);
                        }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-green-500 hover:shadow-md ${
                          selectedDoctor?.id === doc.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800">{doc.name}</h4>
                            <p className="text-sm text-green-600">{doc.specialization}</p>
                            <p className="text-xs text-gray-500">{doc.experience} • {doc.hospital}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FaCalendarAlt className="text-green-600" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FaClock className="text-green-600" />
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData({ ...formData, time })}
                        className={`p-2 border rounded-lg text-sm ${
                          formData.time === time
                            ? 'bg-green-600 text-white border-green-600'
                            : 'hover:border-green-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FaUserMd className="text-green-600" />
                    Appointment Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="check-up">Regular Check-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FaClipboardList className="text-green-600" />
                    Symptoms/Reason
                  </label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) =>
                      setFormData({ ...formData, symptoms: e.target.value })
                    }
                    rows="3"
                    placeholder="Describe your symptoms or reason for visit"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">Appointment Summary</h3>
                  <dl className="space-y-2">
                    {(selectedDoctor || doctor) && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Doctor:</dt>
                        <dd className="font-medium">{(selectedDoctor || doctor)?.name}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Date:</dt>
                      <dd className="font-medium">{formData.date}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Time:</dt>
                      <dd className="font-medium">{formData.time}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Type:</dt>
                      <dd className="font-medium capitalize">{formData.type}</dd>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <dt className="text-gray-600 mb-1">Symptoms/Reason:</dt>
                      <dd className="font-medium">{formData.symptoms}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > (doctor ? 1 : 0) && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < (doctor ? 3 : 3) ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 0 && !selectedDoctor) {
                      alert('Please select a doctor first');
                      return;
                    }
                    setStep(step + 1);
                  }}
                  disabled={step === 0 && !selectedDoctor}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
