import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api/axios';
import { FaUserMd, FaStar, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';

// Fix default Leaflet marker icons (broken in bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SPECIALIZATIONS = [
  'Cardiologist','Dermatologist','Neurologist','Pediatrician',
  'Orthopedic','General Physician','Psychiatrist','Dentist','ENT',
];

// Green = nearby (within 5km), Orange = further away
const makeIcon = (nearby, selected) => L.divIcon({
  className: '',
  html: `<div style="
    background:${selected ? '#2563eb' : nearby ? '#16a34a' : '#ea580c'};
    color:#fff;border-radius:50%;
    width:${selected ? 42 : 36}px;height:${selected ? 42 : 36}px;
    display:flex;align-items:center;justify-content:center;
    font-size:${selected ? 20 : 17}px;
    box-shadow:0 2px ${selected ? 10 : 6}px rgba(0,0,0,${selected ? 0.4 : 0.3});
    border:${selected ? '3px solid #fff' : 'none'};
  ">🩺</div>`,
  iconSize: selected ? [42, 42] : [36, 36],
  iconAnchor: selected ? [21, 21] : [18, 18],
  popupAnchor: [0, selected ? -24 : -20],
});

// Haversine distance in km
const distKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const FindDoctors = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});   // doctorId → { marker, nearby }
  const radiusCircleRef = useRef(null);
  const userDotRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(true);
  const [allDoctors, setAllDoctors] = useState([]);   // raw from DB
  const [displayed, setDisplayed] = useState([]);      // filtered + with distKm
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const listRef = useRef(null);

  // ── 1. Try to get patient location (non-blocking) ───────
  useEffect(() => {
    if (!navigator.geolocation) { setLocating(false); return; }
    const timer = setTimeout(() => setLocating(false), 8000); // fallback timeout
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        clearTimeout(timer);
        setLocating(false); // continue without location — still show all doctors
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
    return () => clearTimeout(timer);
  }, []);

  // ── 2. Fetch ALL approved doctors once on mount ─────────
  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/v0/doctors/getAllDoctors');
        if (!cancelled) setAllDoctors(data.Doctors || []);
      } catch {
        if (!cancelled) setAllDoctors([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  // ── 3. Compute distances + apply specialization filter ──
  useEffect(() => {
    let list = allDoctors;

    // Specialization filter
    if (specialization) {
      list = list.filter(d =>
        (d.specialization || '').toLowerCase().includes(specialization.toLowerCase())
      );
    }

    // Attach distance and sort
    list = list
      .map(d => {
        const dLat = parseFloat(d.latitude);
        const dLng = parseFloat(d.longitude);
        if (!isNaN(dLat) && !isNaN(dLng) && location) {
          const km = distKm(location.lat, location.lng, dLat, dLng);
          return { ...d, distKm: +km.toFixed(2), nearby: km <= 5 };
        }
        return { ...d, distKm: null, nearby: false };
      })
      .sort((a, b) => {
        if (a.distKm == null && b.distKm == null) return 0;
        if (a.distKm == null) return 1;
        if (b.distKm == null) return -1;
        return a.distKm - b.distKm;
      });

    setDisplayed(list);
  }, [allDoctors, specialization, location]);

  // ── 4. Init map (as soon as the div is ready) ───────────
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Default center: Pakistan (fallback if no GPS)
    const center = location ? [location.lat, location.lng] : [30.3753, 69.3451];
    const zoom = location ? 13 : 5;

    const map = L.map(mapRef.current, { zoomControl: true }).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors', maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;
  // We only want this to run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef.current]);

  // ── 5. Update "you are here" + 5km ring when location arrives
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !location) return;

    // Remove old user dot + ring
    userDotRef.current?.remove();
    radiusCircleRef.current?.remove();

    userDotRef.current = L.circleMarker([location.lat, location.lng], {
      radius: 10, color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.85, weight: 2,
    }).bindPopup('<b>📍 You are here</b>').addTo(map);

    radiusCircleRef.current = L.circle([location.lat, location.lng], {
      radius: 5000,
      color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.06,
      dashArray: '6 6', weight: 1.5,
    }).addTo(map);

    map.setView([location.lat, location.lng], 13, { animate: true });
  }, [location]);

  // ── 6. Place / refresh markers whenever displayed list changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach(({ marker }) => marker.remove());
    markersRef.current = {};

    const bounds = [];

    displayed.forEach((d) => {
      const dLat = parseFloat(d.latitude);
      const dLng = parseFloat(d.longitude);
      if (isNaN(dLat) || isNaN(dLng)) return;

      bounds.push([dLat, dLng]);

      const popup = `
        <div style="min-width:170px;font-family:sans-serif;line-height:1.5">
          <p style="font-weight:700;margin:0 0 2px">Dr. ${d.fullName || d.username}</p>
          <p style="margin:0 0 2px;color:#16a34a;font-size:12px">${d.specialization}</p>
          ${d.distKm != null
            ? `<p style="margin:0 0 3px;font-size:11px;color:#555">
                📍 ${d.distKm} km away
                ${d.nearby ? '<span style="color:#16a34a;font-weight:600"> · Nearby</span>' : ''}
              </p>`
            : ''}
          ${d.hospitalId?.name ? `<p style="margin:0 0 3px;font-size:11px">🏥 ${d.hospitalId.name}</p>` : ''}
          ${d.consultationFee > 0 ? `<p style="margin:0;font-size:11px">💰 Rs. ${d.consultationFee}</p>` : ''}
        </div>`;

      const marker = L.marker([dLat, dLng], { icon: makeIcon(d.nearby, false) })
        .bindPopup(popup)
        .addTo(map)
        .on('click', () => selectDoctor(d._id));

      markersRef.current[d._id] = { marker, nearby: d.nearby };
    });

    // Auto-fit map to show all markers (only when we have markers and no user has panned)
    if (bounds.length > 0 && !location) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else if (bounds.length > 0 && location) {
      // Fit to include both user and all doctors
      const allBounds = [...bounds, [location.lat, location.lng]];
      map.fitBounds(allBounds, { padding: [40, 40], maxZoom: 14 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed]);

  // ── 7. Select a doctor ───────────────────────────────────
  const selectDoctor = (id) => {
    setSelectedId(id);

    // Update all marker icons
    Object.entries(markersRef.current).forEach(([did, { marker, nearby }]) => {
      marker.setIcon(makeIcon(nearby, did === id));
    });

    const entry = markersRef.current[id];
    if (entry && mapInstance.current) {
      mapInstance.current.setView(entry.marker.getLatLng(), 16, { animate: true });
      entry.marker.openPopup();
    }

    const card = document.getElementById(`doc-card-${id}`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const withCoords = displayed.filter(d => !isNaN(parseFloat(d.latitude)));
  const nearbyCount = displayed.filter(d => d.nearby).length;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ── Header / Filter bar ───────────────────────────── */}
      <div className="bg-white border-b px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 flex-shrink-0 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaUserMd className="text-green-600" /> Find Doctors
          </h1>
          <p className="text-xs text-gray-500">
            {loading ? 'Loading…' : (
              <>
                {withCoords.length} doctor{withCoords.length !== 1 ? 's' : ''} on map
                {location && nearbyCount > 0 && (
                  <> · <span className="text-green-600 font-medium">{nearbyCount} within 5 km</span></>
                )}
                {!location && !locating && (
                  <> · <span className="text-orange-500">Enable GPS for distance info</span></>
                )}
              </>
            )}
          </p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
          {/* Legend */}
          <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 mr-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600"></span> ≤5 km
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500 ml-2"></span> &gt;5 km
          </span>
          <FaFilter className="text-gray-400 shrink-0" />
          <select
            value={specialization}
            onChange={(e) => { setSpecialization(e.target.value); setSelectedId(null); }}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">All Specializations</option>
            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ── Map + Sidebar ────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          {(loading || locating) && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white rounded-full shadow px-4 py-1.5 text-sm text-gray-600 z-10 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              {locating ? 'Getting location…' : 'Loading doctors…'}
            </div>
          )}
        </div>

        {/* Desktop sidebar */}
        <div
          ref={listRef}
          className="hidden md:flex flex-col w-80 bg-white border-l overflow-y-auto flex-shrink-0"
        >
          <div className="px-4 py-3 border-b bg-gray-50 flex-shrink-0">
            <p className="font-semibold text-gray-700 text-sm">
              {loading ? 'Loading doctors…' : `${displayed.length} doctor${displayed.length !== 1 ? 's' : ''}`}
            </p>
            {!loading && displayed.length > 0 && withCoords.length < displayed.length && (
              <p className="text-xs text-orange-500 mt-0.5">
                {displayed.length - withCoords.length} doctor{displayed.length - withCoords.length > 1 ? 's' : ''} have no location set
              </p>
            )}
          </div>

          {!loading && displayed.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center text-gray-500">
              <FaUserMd className="text-4xl text-gray-300 mb-3" />
              <p className="text-sm">No {specialization || ''} doctors registered yet.</p>
            </div>
          )}

          <div className="divide-y">
            {displayed.map((d) => {
              const isSelected = d._id === selectedId;
              const hasCoords = !isNaN(parseFloat(d.latitude)) && !isNaN(parseFloat(d.longitude));
              return (
                <div
                  key={d._id}
                  id={`doc-card-${d._id}`}
                  onClick={() => hasCoords && selectDoctor(d._id)}
                  className={`p-4 transition-colors ${
                    hasCoords ? 'cursor-pointer' : 'opacity-60'
                  } ${isSelected ? 'bg-green-50 border-l-4 border-green-600' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-start gap-3">
                    {d.avatar ? (
                      <img src={d.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl flex-shrink-0">
                        <FaUserMd />
                      </div>
                    )}
                    <div className="min-w-0 w-full">
                      <p className="font-semibold text-gray-800 text-sm truncate">Dr. {d.fullName || d.username}</p>
                      <p className="text-xs text-green-700 font-medium">{d.specialization}</p>

                      {d.rating > 0 && (
                        <p className="text-xs text-yellow-600 flex items-center gap-1 mt-0.5">
                          <FaStar className="text-yellow-400" />
                          {d.rating.toFixed(1)}
                          <span className="text-gray-400">({d.ratingCount})</span>
                        </p>
                      )}

                      <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                        {d.distKm != null ? (
                          <p className="flex items-center gap-1">
                            <FaMapMarkerAlt className={d.nearby ? 'text-green-500' : 'text-orange-400'} />
                            {d.distKm} km away
                            {d.nearby && <span className="text-green-600 font-medium">· Nearby</span>}
                          </p>
                        ) : (
                          !location && hasCoords && <p className="text-gray-400">Location not available</p>
                        )}
                        {!hasCoords && <p className="text-orange-400">No location set</p>}
                        {d.experience && <p>Exp: {d.experience}</p>}
                        {d.consultationFee > 0 && <p>Fee: Rs. {d.consultationFee}</p>}
                        {d.hospitalId?.name && <p>🏥 {d.hospitalId.name}</p>}
                      </div>

                      <Link
                        to={`/book-appointment?doctorId=${d._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-block text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile: horizontal scrollable cards below map ─── */}
      <div className="md:hidden bg-white border-t flex-shrink-0">
        <div className="px-3 py-2 border-b text-xs font-semibold text-gray-600">
          {loading ? 'Loading…' : `${displayed.length} doctor${displayed.length !== 1 ? 's' : ''}`}
        </div>
        {!loading && displayed.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-3">No doctors registered.</p>
        )}
        <div className="flex gap-3 overflow-x-auto px-3 py-3">
          {displayed.map((d) => {
            const isSelected = d._id === selectedId;
            const hasCoords = !isNaN(parseFloat(d.latitude));
            return (
              <div
                key={d._id}
                onClick={() => hasCoords && selectDoctor(d._id)}
                className={`flex-shrink-0 w-52 border rounded-xl p-3 transition ${
                  isSelected ? 'border-green-500 bg-green-50' : 'bg-white hover:shadow-md'
                } ${!hasCoords ? 'opacity-60' : 'cursor-pointer'}`}
              >
                <p className="font-semibold text-gray-800 text-sm truncate">Dr. {d.fullName || d.username}</p>
                <p className="text-xs text-green-700">{d.specialization}</p>
                {d.distKm != null && (
                  <p className={`text-xs flex items-center gap-1 mt-1 ${d.nearby ? 'text-green-600' : 'text-orange-500'}`}>
                    <FaMapMarkerAlt /> {d.distKm} km
                  </p>
                )}
                <Link
                  to={`/book-appointment?doctorId=${d._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 block text-center text-xs px-2 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Book
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FindDoctors;
