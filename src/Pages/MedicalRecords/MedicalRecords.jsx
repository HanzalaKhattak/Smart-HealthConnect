import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Toast from '../../Components/Toast/Toast';
import { FaFileMedical, FaTrash, FaUpload } from 'react-icons/fa';

const MedicalRecords = () => {
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recordType, setRecordType] = useState('other');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/v0/medical-records/patient/${userId}`);
      setRecords(data.records || []);
    } catch (err) {
      setToast({ message: err.response?.data?.msg || 'Failed to load', type: 'error', id: Date.now() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return setToast({ message: 'Pick a file', type: 'error', id: Date.now() });
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', title);
      fd.append('description', description);
      fd.append('recordType', recordType);
      await api.post('/api/v0/medical-records/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTitle(''); setDescription(''); setFile(null);
      setToast({ message: 'Uploaded', type: 'success', id: Date.now() });
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.msg || 'Upload failed', type: 'error', id: Date.now() });
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await api.delete(`/api/v0/medical-records/${id}`);
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.msg || 'Delete failed', type: 'error', id: Date.now() });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Medical records</h1>

      {userType === 'patient' && (
        <form onSubmit={upload} className="bg-white rounded-2xl shadow p-6 mb-6 grid sm:grid-cols-2 gap-4">
          <input
            required value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. Blood test Jan 2025)"
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
          />
          <select
            value={recordType} onChange={(e) => setRecordType(e.target.value)}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
          >
            <option value="lab">Lab result</option>
            <option value="imaging">Imaging</option>
            <option value="prescription">Prescription</option>
            <option value="report">Report</option>
            <option value="other">Other</option>
          </select>
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Notes (optional)" rows={2}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 sm:col-span-2"
          />
          <input
            type="file" required onChange={(e) => setFile(e.target.files[0])}
            className="px-4 py-3 border rounded-xl sm:col-span-2"
          />
          <button
            type="submit" disabled={uploading}
            className="sm:col-span-2 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <FaUpload /> {uploading ? 'Uploading…' : 'Upload record'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading…</div>
      ) : records.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No records yet.</div>
      ) : (
        <div className="grid gap-4">
          {records.map(r => (
            <div key={r._id} className="bg-white rounded-2xl shadow p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FaFileMedical />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{r.title}</h3>
                  <p className="text-xs text-gray-500">{r.recordType} • {new Date(r.createdAt).toLocaleDateString()}</p>
                  {r.description && <p className="text-sm text-gray-600 mt-1">{r.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={r.fileUrl} target="_blank" rel="noreferrer"
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >View</a>
                {userType === 'patient' && (
                  <button
                    onClick={() => remove(r._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  ><FaTrash /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
