import React from 'react'
import img4 from '../../Assets/HospNearYouAssects/HospIcon.png'
import { useNavigate } from 'react-router-dom'

const HospNearYou = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/find-hospitals');
  };
  return (
    <>
      <div className='flex items-center justify-center mt-8 animate-fade-in'>
        <button className='hover:cursor group' onClick={handleClick}>
          <div className='flex justify-evenly items-center w-auto border-2 rounded-xl border-green-500 px-8 py-4 bg-white shadow hover:shadow-lg transition-all duration-200 group-hover:scale-105'>
            <div>
              <p className='text-2xl font-bold text-green-700'> <span className='text-3xl'>Search</span>  Hospitals near you.</p>
              <p className='text-xl text-gray-600'>Get help of your location to search for the nearest Hospital.</p>
            </div>
            <div>
              <img src={img4} className='w-28 drop-shadow group-hover:scale-110 transition-transform' alt='Hospital Icon' />
            </div>
          </div>
        </button>
      </div>
    </>
  )
}

export default HospNearYou