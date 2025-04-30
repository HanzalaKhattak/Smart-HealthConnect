import React from 'react'
import img1 from '../Home/HomeAssets/mandf.png'

const Home = () => {
  return (
    <>
      <section className='bg-red-50 w-full h-92 flex justify-evenly'>
            <section className='flex flex-col items-center justify-center '>
              <p className='text-8xl'>We <span className='text-green-600'>Care</span> about</p>
              <p className='text-8xl'> Your <span className='text-green-600'>Health</span></p>
            </section>
            <section>
              <img src={img1} alt="Female Doc" className='h-92' />
            </section>
      </section>
    </>
  )
}

export default Home