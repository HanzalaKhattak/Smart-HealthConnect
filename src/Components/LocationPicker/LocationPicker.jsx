import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';
import { FaSearchLocation, FaMapMarkerAlt, FaLayerGroup } from 'react-icons/fa';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition, onLocationSelect, address }) {
  useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <div className="text-sm">
          <p className="font-semibold mb-1">Selected Location</p>
          {address && <p className="text-gray-600 mb-2">{address}</p>}
          <p className="text-xs text-gray-500">
            Lat: {position[0].toFixed(6)}<br />
            Lng: {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

const LocationPicker = ({ onLocationSelect, initialPosition = null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [currentLocation, setCurrentLocation] = useState([34.0151, 71.5249]); // Default to Peshawar, Pakistan
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [address, setAddress] = useState('');
  const [tileLayer, setTileLayer] = useState('streets'); // streets, satellite, dark
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const searchTimeoutRef = useRef(null);

  const tileLayerOptions = {
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  };

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          if (!initialPosition) {
            setPosition([latitude, longitude]);
            reverseGeocode(latitude, longitude);
          }
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
      reverseGeocode(initialPosition[0], initialPosition[1]);
    }
  }, [initialPosition]);

  // Reverse geocoding - get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  // Forward geocoding - search for location
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=pk`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(query);
    }, 500);
  };

  // Handle search result selection
  const handleSelectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const newPosition = [lat, lng];
    
    setPosition(newPosition);
    setCurrentLocation(newPosition);
    setAddress(result.display_name);
    setSearchQuery('');
    setSearchResults([]);
    onLocationSelect(lat, lng);
  };

  // Handle current location button
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = [latitude, longitude];
          setPosition(newPosition);
          setCurrentLocation(newPosition);
          reverseGeocode(latitude, longitude);
          onLocationSelect(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please check your browser permissions.');
        }
      );
    }
  };

  const handleLocationSelect = (lat, lng) => {
    reverseGeocode(lat, lng);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaMapMarkerAlt className="text-green-600" />
          Select Hospital/Clinic Location
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Search for a location or click on the map to select your hospital/clinic location
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for location (e.g., City Medical Center, Karachi)"
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FaSearchLocation className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSearchResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <p className="font-medium text-gray-800 text-sm">{result.display_name}</p>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
              Searching...
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleCurrentLocation}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <FaMapMarkerAlt /> Use Current Location
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <FaLayerGroup /> Map Layer
            </button>

            {showLayerMenu && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[150px]">
                <button
                  onClick={() => { setTileLayer('streets'); setShowLayerMenu(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                    tileLayer === 'streets' ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Streets
                </button>
                <button
                  onClick={() => { setTileLayer('satellite'); setShowLayerMenu(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                    tileLayer === 'satellite' ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => { setTileLayer('dark'); setShowLayerMenu(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm rounded-b-lg ${
                    tileLayer === 'dark' ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Dark Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg relative">
        <MapContainer
          center={position || currentLocation}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '450px', width: '100%' }}
        >
          <TileLayer
            attribution={tileLayerOptions[tileLayer].attribution}
            url={tileLayerOptions[tileLayer].url}
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationSelect={handleLocationSelect}
            address={address}
          />
          <RecenterMap center={currentLocation} />
        </MapContainer>
      </div>
      
      {position && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg shadow-sm">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-600" />
            Selected Location
          </h4>
          {address && (
            <p className="text-sm text-gray-700 mb-2 font-medium">{address}</p>
          )}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Latitude:</span>
              <p className="font-mono text-green-700 font-medium">{position[0].toFixed(6)}</p>
            </div>
            <div>
              <span className="text-gray-600">Longitude:</span>
              <p className="font-mono text-green-700 font-medium">{position[1].toFixed(6)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
