import React, { useState } from 'react';
import { MdMedicalServices } from 'react-icons/md';
import img3 from '../Assets/BookAppAssects/DocImg.png';
import AppointmentModal from './BookingModal/AppointmentModal';

const BookAppointment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[50vh] p-4 animate-fade-in">
        <div
          onClick={handleClick}
          className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl border-2 border-green-500 rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:border-green-600"
        >
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <MdMedicalServices className="text-3xl group-hover:scale-110 transition-transform" />
              <h2 className="text-3xl font-bold group-hover:text-green-700 transition">Book an Appointment</h2>
            </div>
            <p className="text-xl text-gray-700">Find and schedule appointments with top healthcare professionals.</p>
            <p className="text-sm text-green-600 mt-2">Click to get started →</p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-8">
            <img
              src={img3}
              alt="Doctor Consultation"
              className="w-40 h-32 rounded-lg object-contain drop-shadow group-hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={null} // No specific doctor selected from home page
      />
    </>
  );
};

export default BookAppointment;
