import React from 'react'
import img1 from '../Home/HomeAssets/mandf.png'
import AIAgent from '../../Components/AIAgent'
import BookAppointment from '../../Components/BookAppointment'
import HospNearYou from '../../Components/HospNearYou'
import ShowCard from '../../Components/Specialization Cards/ShowCard'
import PharmasNearYou from '../../Components/PharmasNearYou'

const Home = () => {
  return (
    <>
      <section className='bg-red-50 h-96 flex justify-evenly border-3 rounded-xl border-green-500 shadow-md mt-5'>
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
      <HospNearYou />
      <ShowCard />
      <PharmasNearYou/>
    </>
  )
}

export default Home