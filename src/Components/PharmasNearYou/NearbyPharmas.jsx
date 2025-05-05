import React, { useEffect, useState } from 'react';

const Nearby = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      () => {
        setError('Location access denied or unavailable.');
      }
    );
  }, []);

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Nearby Pharmacies/Hospitals</h2>
      {error && <p className='text-red-500'>{error}</p>}
      {location ? (
        <iframe
          title='Nearby Pharmacies'
          width='100%'
          height='500'
          frameBorder='0'
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY&q=pharmacy&center=${location.latitude},${location.longitude}&zoom=14`}
          allowFullScreen
        ></iframe>
      ) : (
        !error && <p>Fetching your location...</p>
      )}
    </div>
  );
};

export default Nearby;
