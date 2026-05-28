import React from 'react';
import PharmasNearYou from '../../Components/PharmasNearYou/PharmasNearYou';

const FindPharmacies = () => (
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Find a pharmacy near you</h1>
    <p className="text-gray-600 mb-6">Search for pharmacies close to your location.</p>
    <PharmasNearYou />
  </div>
);

export default FindPharmacies;
