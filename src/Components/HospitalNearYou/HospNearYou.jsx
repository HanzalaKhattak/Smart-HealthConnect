import React from 'react'
import img4 from '../../Assets/HospNearYouAssects/HospIcon.png'
import { useNavigate } from 'react-router-dom'

const HospNearYou = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/nearby-hospitals');
  };
  return (
    <>
      <div className='flex items-center justify-center mt-8 hover:pointer-none:' >
                  <button className='hover:cursor' onClick={handleClick}>
                  <div className='flex justify-evenly items-center w-200 border-3 rounded-xl border-green-500'>
                    <div>
                    <p className='text-2xl'><b className='font-bold text-3xl'>Search</b>  Hospitals near you.</p>
                    <p className='text-xl'>Get help of your location to search for the nearest Hospital.</p>
                    </div>
                    <div>
                        <img src={img4} className='w-30' />
                    </div>
                  </div>
                  </button>
            </div>
    </>
  )
}

export default HospNearYou