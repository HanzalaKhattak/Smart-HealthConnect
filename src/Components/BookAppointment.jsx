import React from 'react'
import img3 from '../Assets/BookAppAssects/docimg.jpg'
const BookAppointment = () => {
  return (
    <>
      <div className='flex items-center justify-center '> 
        <div className='flex justify-between w-100 items-center border-3 rounded-xl border-green-500 shadow-md p-1'>
          <div>
              <h1 className='text-3xl font-bold'>Consult a Doctor</h1>
              <p className='text-xl'>Book Appointment</p>
          </div>
          <div>
              <img src={img3} className='w-28 h-28 rounded-lg ' />
          </div>
        </div>
      </div>
    </>
  )
}

export default BookAppointment