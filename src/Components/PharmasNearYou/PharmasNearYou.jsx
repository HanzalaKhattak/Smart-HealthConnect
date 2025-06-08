import React from 'react'
import pharmaIcon from '../../Assets/PharmaNearYouAssets/pharmacyIcon.png'
import { useNavigate } from 'react-router-dom'

  const PharmasNearYou = () => {
    const navigate = useNavigate();    const handleClick = () => {
      navigate('/find-pharmacies');
    };
  return (
    <>
        <div className='flex items-center flex-col justify-center mt-8 animate-fade-in'>
          <button className='hover:cursor group' onClick={handleClick}>
            <div className='flex justify-evenly items-center w-auto border-2 rounded-xl border-green-500 px-8 py-4 bg-white shadow hover:shadow-lg transition-all duration-200 group-hover:scale-105'>
              <div>
                <p className='text-2xl font-bold text-green-700'> <span className='text-3xl'>Search</span> pharmacies nearest to you.</p>
                <p className='text-xl text-gray-600'>Get Medicine quickly as possible.</p>
              </div>
              <div>
                  <img src={pharmaIcon} className='w-28 p-2 drop-shadow group-hover:scale-110 transition-transform' alt='Pharmacy Icon' />
              </div>
            </div>
          </button>
        </div>
        </>
    )
}

export default PharmasNearYou