import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

const LocationPicker = ({ onLocationSelect, initialPosition = null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [currentLocation, setCurrentLocation] = useState([34.0151, 71.5249]); // Default to Peshawar, Pakistan

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          console.log('Error getting location:', error);
          // Keep default location if geolocation fails
        }
      );
    }
  }, []);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const handleLocationSelect = (lat, lng) => {
    onLocationSelect(lat, lng);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Select Hospital/Clinic Location</h3>
        <p className="text-sm text-gray-600 mb-4">
          Click on the map to select your hospital or clinic location
        </p>
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <MapContainer
          center={position || currentLocation}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationSelect={handleLocationSelect}
          />
        </MapContainer>
      </div>
      
      {position && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Selected Location:</h4>
          <p className="text-sm text-green-700">
            Latitude: {position[0].toFixed(6)}<br />
            Longitude: {position[1].toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
