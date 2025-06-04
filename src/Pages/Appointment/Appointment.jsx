import React, { useState } from 'react';
import { MdMedicalServices } from 'react-icons/md';
// import img3 from '../Assets/BookAppAssects/DocImg.png';

const Appointment = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', symptoms: '', date: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setFormData({ name: '', age: '', symptoms: '', date: '' });
    }, 4000);
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      {/* Clickable Card */}
      <div
        onClick={() => setShowModal(true)}
        className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl border-2 border-green-500 rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      >
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <MdMedicalServices className="text-3xl" />
            <h2 className="text-3xl font-bold">Consult a Doctor</h2>
          </div>
          <p className="text-xl text-gray-700">Book an appointment quickly and easily.</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-8">
          {/* <img alt="Doctor" className="w-32 h-32 rounded-lg object-contain" /> */}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl relative animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-center text-green-600">
              Book an Appointment
            </h2>

            {submitted ? (
              <p className="text-center text-lg text-green-700 font-medium">
                ✅ Your appointment booking is pending. Please wait for confirmation.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Your Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="text"
                  name="symptoms"
                  placeholder="Describe Symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-red-500 font-medium hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
