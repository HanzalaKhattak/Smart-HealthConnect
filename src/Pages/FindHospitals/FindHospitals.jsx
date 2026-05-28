import React from 'react';
import HospNearYou from '../../Components/HospitalNearYou/HospNearYou';

const FindHospitals = () => (
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Find a hospital near you</h1>
    <p className="text-gray-600 mb-6">Locate the closest hospitals based on your current location.</p>
    <HospNearYou />
  </div>
);

export default FindHospitals;
