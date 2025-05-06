import React from 'react'
import img3 from '../Assets/BookAppAssects/DocImg.png'
const BookAppointment = () => {
  return (
    <>
      <div className='flex items-center justify-center'> 
        <button className='hover:cursor'>
        <div className='flex justify-between w-auto items-center border-3 rounded-xl border-green-500 shadow-md px-2'>
          <div>
              <h1 className='text-3xl font-bold'>Consult a Doctor</h1>
              <p className='text-xl'>Book Appointment</p>
          </div>
          <div>
              <img src={img3} className='w-28 h-28 p-1 rounded-lg ' />
          </div>
        </div>
        </button>
      </div>
    </>
  )
}

export default BookAppointment