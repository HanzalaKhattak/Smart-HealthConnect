import React from 'react'
import img1 from '../Home/HomeAssets/mandf.png'
import AIAgent from '../../Components/AIAgent'
import BookAppointment from '../../Components/BookAppointment'

const Home = () => {
  return (
    <>
      <section className='bg-red-50 w-full h-96 flex justify-evenly'>
            <section className='flex flex-col items-center justify-center '>
              <p className='text-8xl'>We <span className='text-green-600'>Care</span> about</p>
              <p className='text-8xl'> Your <span className='text-green-600'>Health</span></p>
              <button className='bg-green-500 text-white rounded py-1 px-3 mt-3'>Discover More</button>
            </section>
            <section>
              <img src={img1} alt="Female Doc" className='h-92' />
            </section>
      </section>
      <span className='flex items-center justify-evenly mt-8'>
      <AIAgent />
      <BookAppointment />
      </span>
    </>
  )
}

export default Home