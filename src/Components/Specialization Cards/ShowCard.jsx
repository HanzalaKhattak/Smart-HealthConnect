import React from 'react'
import DocCards from '../../Components/Specialization Cards/cardComponent/DocCards'
import Cardio from '/src/Assets/DocCardsAssets/Cardio.jpg'
import img1 from '/src/Pages/Home/HomeAssets/mandf.png'
const ShowCard = () => {
    const Arr =[
        {
            h1:'Cardiology',
            src:Cardio,
            p:'See More Details about Heart Health.'
        },
        {
            h1:'Neurology',
            src:img1,
            p:'See More Details about Brain Health.'
        },
        {
            h1:'Orthopedics',
            src:img1,
            p:'See More Details about Bone Health.'
        }
    ]
  return (
    <div>
        <h1 className='text-4xl font-bold text-center mt-8'>Our Services</h1>
        <section className='flex flex-wrap justify-center'>
          {DocCards(Arr[0].h1,Arr[0].src,Arr[0].p)} 
          {DocCards(Arr[1].h1,Arr[1].src,Arr[1].p)}
          {DocCards(Arr[2].h1,Arr[2].src,Arr[2].p)}
        </section>
      </div>
  )
}

export default ShowCard