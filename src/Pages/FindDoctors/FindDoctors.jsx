import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { FaUserMd, FaStar } from 'react-icons/fa';

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/v0/doctors/getAllDoctors', {
          params: specialization ? { specialization } : {},
        });
        if (!cancelled) setDoctors(data.Doctors || []);
      } catch { /* ignore */ }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [specialization]);

  const filtered = useMemo(() => {
    if (!q) return doctors;
    const s = q.toLowerCase();
    return doctors.filter(d =>
      (d.fullName || d.username || '').toLowerCase().includes(s) ||
      (d.specialization || '').toLowerCase().includes(s),
    );
  }, [doctors, q]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Find a doctor</h1>
      <p className="text-gray-600 mb-6">Browse approved specialists and book an appointment.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or specialization"
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
        />
        <select
          value={specialization} onChange={(e) => setSpecialization(e.target.value)}
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
        >
          <option value="">All specializations</option>
          {['Cardiologist','Dermatologist','Neurologist','Pediatrician','Orthopedic','General Physician','Psychiatrist','Dentist','ENT'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading doctors…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No doctors found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(d => (
            <div key={d._id} className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5">
              <div className="flex items-center gap-4 mb-3">
                {d.avatar ? (
                  <img src={d.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl">
                    <FaUserMd />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-800">Dr. {d.fullName || d.username}</h3>
                  <p className="text-sm text-green-700">{d.specialization}</p>
                  {d.rating > 0 && (
                    <p className="text-xs text-yellow-600 flex items-center gap-1">
                      <FaStar /> {d.rating.toFixed(1)} ({d.ratingCount})
                    </p>
                  )}
                </div>
              </div>
              {d.bio && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{d.bio}</p>}
              <div className="text-sm text-gray-600 mb-3 space-y-1">
                {d.experience && <p>Experience: {d.experience}</p>}
                {d.consultationFee > 0 && <p>Fee: ${d.consultationFee}</p>}
                {d.hospitalId?.name && <p>Hospital: {d.hospitalId.name}</p>}
              </div>
              <Link
                to={`/book-appointment?doctorId=${d._id}`}
                className="block text-center py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
              >
                Book appointment
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindDoctors;
