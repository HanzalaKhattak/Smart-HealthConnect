import React, { useState } from 'react';
import DocCards from '../../Components/Specialization Cards/cardComponent/DocCards';
import Cardio from '/src/Assets/DocCardsAssets/Cardio.jpg';
import img1 from '/src/Pages/Home/HomeAssets/mandf.png';

const ShowCard = () => {
    const specializations = [
        {
        h1: 'Cardiology',
        src: Cardio,
        p: 'See More About Cardiology'
        },
        {
        h1: 'Neurology',
        src: img1,
        p: 'See More About Neurology'
        },
        {
        h1: 'Orthopedics',
        src: img1,
        p: 'See More About Orthopedics'
        },
        {
        h1: 'Pediatrics',
        src: img1,
        p: 'See More About Pediatrics'
        },
        {
        h1: 'Dermatology',
        src: img1,
        p: 'See More About Dermatology'
        },
        {
        h1: 'Gastroenterology',
        src: img1,
        p: 'See More About Gastroenterology'
        },
        {
        h1: 'Endocrinology',
        src: img1,
        p: 'See More About Endocrinology'
        },
        {
        h1: 'Psychiatry',
        src: img1,
        p: 'See More About Psychiatry'
        },
        {
        h1: 'Ophthalmology',
        src: img1,
        p: 'See More About Ophthalmology'
        },
        {
        h1: 'Urology',
        src: img1,
        p: 'See More About Urology'
        },
        {
        h1: 'Obstetrics and Gynecology',
        src: img1,
        p: 'See More About Obstetrics and Gynecology'
        },
        {
        h1: 'Pulmonology',
        src: img1,
        p: 'See More About Pulmonology'
        },
        {
        h1: 'Rheumatology',
        src: img1,
        p: 'See More About Rheumatology'
        },
        {
        h1: 'Hematology',
        src: img1,
        p: 'See More About Hematology'
        },
        {
        h1: 'Nephrology',
        src: img1,
        p: 'See More About Nephrology'
        },
    ];
    

    const [visibleCards, setVisibleCards] = useState(3);
    const handleShowMore = () => {
        setVisibleCards((prev) => Math.min(prev + 3, specializations.length));
    };

    const handleShowLess = () => {
        setVisibleCards((prev) => Math.max(prev - 3, 3));
    };
    
  return (
    <div id='specializations' className="flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Specializations</h1>
      <section className="flex flex-wrap justify-center gap-6 mb-6">
        {specializations.slice(0, visibleCards).map((item) => (
          <DocCards key={item.h1} {...item} />
        ))}
      </section>
        <section className="flex gap-4 mb-6">
            <button
              className="px-4 py-2 rounded-lg text-white bg-green-600 hover:cursor-pointer"
              onClick={handleShowMore}
              disabled={visibleCards >= specializations.length}
            >
              Show More
            </button>
    
            <button
              className='px-4 py-2 rounded-lg text-white bg-red-600 hover:cursor-pointer'
              onClick={handleShowLess}
              disabled={visibleCards <= 3}
            >Show Less</button>
        </section>
    </div>
  );
};

export default ShowCard;
