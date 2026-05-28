import React, { useEffect, useRef, useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const FindHospitals = () => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setLoading(false);
      },
      () => {
        setError('Location access denied. Please enable location services.');
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (location && mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current).setView(
        [location.latitude, location.longitude],
        15
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.circleMarker([location.latitude, location.longitude], {
        radius: 10, color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.8
      }).bindPopup('You are here').addTo(map);

      markersLayer.current = L.layerGroup().addTo(map);
      mapInstance.current = map;

      // Auto-search hospitals on load
      searchNearby(location.latitude, location.longitude, '');
    }
  }, [location]);

  const searchNearby = async (lat, lng, query) => {
    setSearching(true);
    setResults([]);
    try {
      const radius = 5000;
      const isGeneric = !query || /hospital|clinic|doctor/i.test(query);
      const tag = isGeneric
        ? '"amenity"~"hospital|clinic|doctors"'
        : `"name"~"${query}",i`;

      const overpassQuery = `
        [out:json][timeout:10];
        (
          node[${tag}](around:${radius},${lat},${lng});
          way[${tag}](around:${radius},${lat},${lng});
        );
        out center body;
      `;

      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        body: `data=${encodeURIComponent(overpassQuery)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const data = await res.json();
      const places = data.elements.map(el => ({
        id: el.id,
        name: el.tags?.name || 'Hospital/Clinic',
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
        address: el.tags?.['addr:street'] || '',
        phone: el.tags?.phone || '',
        emergency: el.tags?.emergency === 'yes',
      })).filter(p => p.lat && p.lng);

      setResults(places);
      showMarkers(places);
    } catch (err) {
      console.error('Overpass search failed:', err);
      try {
        const searchTerm = query || 'hospital';
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&lat=${lat}&lon=${lng}&limit=20&bounded=1&viewbox=${lng - 0.05},${lat + 0.05},${lng + 0.05},${lat - 0.05}`
        );
        const data = await res.json();
        const places = data.map(p => ({
          id: p.place_id,
          name: p.display_name.split(',')[0],
          lat: parseFloat(p.lat),
          lng: parseFloat(p.lon),
          address: p.display_name,
          phone: '',
          emergency: false,
        }));
        setResults(places);
        showMarkers(places);
      } catch (e) {
        console.error('Nominatim fallback also failed:', e);
      }
    } finally {
      setSearching(false);
    }
  };

  const showMarkers = (places) => {
    if (!markersLayer.current) return;
    markersLayer.current.clearLayers();
    places.forEach(p => {
      const popup = `<b>${p.name}</b>${p.emergency ? ' 🚨' : ''}${p.address ? '<br/>' + p.address : ''}${p.phone ? '<br/>📞 ' + p.phone : ''}`;
      L.marker([p.lat, p.lng]).bindPopup(popup).addTo(markersLayer.current);
    });
    if (places.length && mapInstance.current) {
      const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
      mapInstance.current.fitBounds(bounds.pad(0.1));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location) return;
    searchNearby(location.latitude, location.longitude, searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Find a hospital near you</h1>
      <p className="text-gray-600 mb-6">Locate hospitals and clinics near your location using OpenStreetMap.</p>

      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or leave empty for all nearby..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button type="submit" disabled={searching || !location} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          {searching ? <FaSpinner className="animate-spin" /> : 'Search'}
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <FaSpinner className="animate-spin text-green-600 text-3xl" />
          <span className="ml-3 text-gray-600">Getting your location...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {location && (
        <>
          <div ref={mapRef} className="rounded-xl overflow-hidden shadow-md border" style={{ height: '450px' }} />
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">Found {results.length} result{results.length !== 1 ? 's' : ''} nearby</p>
            <p className="text-xs text-gray-400">Data from OpenStreetMap (free & open-source)</p>
          </div>

          {results.length > 0 && (
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.slice(0, 12).map(p => (
                <div key={p.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => mapInstance.current?.setView([p.lat, p.lng], 17)}>
                  <p className="font-semibold text-gray-800 text-sm">{p.name} {p.emergency ? '🚨' : ''}</p>
                  {p.address && <p className="text-xs text-gray-500 truncate">{p.address}</p>}
                  {p.phone && <p className="text-xs text-green-600 mt-1">📞 {p.phone}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FindHospitals;
