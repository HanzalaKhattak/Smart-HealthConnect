import React from 'react'
import img2 from '../Assets/AIAgentAssets/AIAgent.png'

const AIAgent = () => {
  return (
    <>
      <div className='flex items-center justify-center '>
            <div className='flex justify-evenly items-center w-200 border-3 rounded-xl border-green-500'>
              <div>
              <p className='text-2xl'><b className='font-bold text-3xl'>Hello</b>, I am an AI Assistant at your service.</p>
              <p className='text-xl'>Tell me about your symptoms, and I will suggest the appropriate doctors.</p>
              </div>
              <div>
                  <img src={img2} className='w-30' />
              </div>
            </div>
      </div>
    </>
  )
}

export default AIAgent