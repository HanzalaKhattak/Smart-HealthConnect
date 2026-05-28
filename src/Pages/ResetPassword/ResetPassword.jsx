import React, { useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Toast from '../../Components/Toast/Toast';

const ResetPassword = () => {
  const { token } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const role = params.get('role') || 'patient';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setToast({ message: 'Passwords do not match', type: 'error', id: Date.now() });
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/v0/users/password/reset', { token, role, password });
      setToast({ message: 'Password reset. Redirecting to login…', type: 'success', id: Date.now() });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.msg || 'Reset failed', type: 'error', id: Date.now() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Reset password</h2>
        <p className="text-gray-500 mb-6 text-sm">Set a new password for your account.</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="New password" minLength={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password" minLength={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit" disabled={submitting}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Reset password'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          <Link to="/login" className="text-green-700 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
