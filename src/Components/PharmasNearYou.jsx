import React from 'react'
import pharmaIcon from '../Assets/PharmaNearYouAssets/pharmacyIcon.png'

const PharmasNearYou = () => {
  return (
    <>
        <div className='flex items-center justify-center'>
                <div className='flex justify-evenly items-center w-auto border-3 rounded-xl border-green-500 px-8'>
                  <div>
                  <p className='text-2xl'> <b className='font-bold text-3xl'>Search</b> pharmacies nearest to you.</p>
                  <p className='text-xl'>Get Medicine quickly as possible.</p>
                  </div>
                  <div>
                      <img src={pharmaIcon} className='w-30 p-2' /> 
                  </div>
                </div>
          </div>
        </>
    )
}

export default PharmasNearYou