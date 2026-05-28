import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Toast from '../../Components/Toast/Toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('patient');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/v0/users/password/forgot', { email, role });
      setDone(true);
      setToast({ message: 'If an account exists, a reset link was sent.', type: 'success', id: Date.now() });
    } catch (err) {
      setToast({ message: err.response?.data?.msg || 'Something went wrong', type: 'error', id: Date.now() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Forgot password</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your email and we'll send you a link to reset your password.
        </p>
        {done ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm">
            If an account exists for <b>{email}</b>, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <select
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="hospitalAdmin">Hospital admin</option>
              <option value="systemAdmin">System admin</option>
            </select>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit" disabled={submitting}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
        <div className="mt-6 text-center text-sm text-gray-600">
          <Link to="/login" className="text-green-700 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
