import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NearbyHospitals = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const apiKey = "https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=rect%3A10.716463143326969%2C48.755151258420966%2C10.835314015356737%2C48.680903341613316&limit=20&apiKey=f731437e095d4fc48f98699fce8340db"; // ← Replace this with your actual API key

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = position.coords;
        setLocation(coords);
      },
      () => {
        setError('Location access denied or unavailable.');
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!location) return;

      try {
        const { latitude, longitude } = location;
        const response = await axios.get('https://api.geoapify.com/v2/places', {
          params: {
            categories: 'healthcare.hospital',
            filter: `circle:${longitude},${latitude},5000`, // 5km radius
            limit: 10,
            apiKey: apiKey,
          },
        });

        setHospitals(response.data.features);
      } catch (error) {
        setError('Failed to fetch nearby hospitals.');
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [location]);

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Nearby Hospitals</h2>
      {error && <p className='text-red-500'>{error}</p>}
      {loading && !error && <p>Fetching your location and nearby hospitals...</p>}
      {!loading && hospitals.length === 0 && !error && <p>No hospitals found nearby.</p>}
      <ul className='space-y-3'>
        {hospitals.map((hospital, index) => (
          <li key={index} className='border rounded p-3 shadow'>
            <h3 className='text-lg font-semibold'>{hospital.properties.name || 'Unnamed Hospital'}</h3>
            <p>{hospital.properties.address_line1}</p>
            <p>{hospital.properties.address_line2}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearbyHospitals;
