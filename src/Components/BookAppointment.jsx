import React from 'react';
import { MdMedicalServices } from 'react-icons/md';
import img3 from '../Assets/BookAppAssects/DocImg.png';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const navigate = useNavigate();
  const handleClick = () =>{
    navigate('/appointment')
  }
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl border-2 border-green-500 rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer" onClick={handleClick}>
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <MdMedicalServices className="text-3xl" />
            <h2 className="text-3xl font-bold">Consult a Doctor</h2>
          </div>
          <p className="text-xl text-gray-700">Book an appointment quickly and easily.</p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-8">
          <img src={img3} alt="Doctor Consultation" className="w-40 h-32 rounded-lg object-contain" />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
