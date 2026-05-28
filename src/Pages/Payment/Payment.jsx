import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Toast from '../../Components/Toast/Toast';

const Payment = () => {
  const { appointmentId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionFromUrl = params.get('session');

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [session, setSession] = useState(sessionFromUrl || null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/api/v0/appointments/${appointmentId}`);
        if (!cancelled) setAppointment(data.appointment);
      } catch (err) {
        setToast({ message: err.response?.data?.msg || 'Could not load appointment', type: 'error', id: Date.now() });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [appointmentId]);

  const startCheckout = async () => {
    setPaying(true);
    try {
      const { data } = await api.post('/api/v0/payments/checkout', { appointmentId });
      setSession(data.sessionId);
      setToast({ message: 'Mock checkout created. Click "Confirm payment" to simulate paying.', type: 'success', id: Date.now() });
    } catch (err) {
      setToast({ message: err.response?.data?.msg || 'Checkout failed', type: 'error', id: Date.now() });
    } finally {
      setPaying(false);
    }
  };

  const confirm = async () => {
    setPaying(true);
    try {
      const { data } = await api.post('/api/v0/payments/confirm', { appointmentId, sessionId: session });
      setAppointment(data.appointment);
      setToast({ message: 'Payment confirmed!', type: 'success', id: Date.now() });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.msg || 'Confirm failed', type: 'error', id: Date.now() });
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading…</div>;
  if (!appointment) return <div className="p-10 text-center text-gray-500">Appointment not found.</div>;

  const paid = appointment.paymentStatus === 'paid';
  const free = appointment.paymentStatus === 'free' || (appointment.consultationFee || 0) === 0;

  return (
    <div className="max-w-xl mx-auto p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Appointment payment</h1>

        <dl className="text-sm text-gray-700 space-y-2 mb-6">
          <div className="flex justify-between"><dt>Doctor</dt><dd className="font-medium">Dr. {appointment.doctorId?.fullName || appointment.doctorId?.username}</dd></div>
          <div className="flex justify-between"><dt>Date</dt><dd>{new Date(appointment.appointmentDate).toDateString()}</dd></div>
          <div className="flex justify-between"><dt>Time</dt><dd>{appointment.appointmentTime}</dd></div>
          <div className="flex justify-between"><dt>Status</dt><dd>{appointment.status}</dd></div>
          <div className="flex justify-between text-base font-bold border-t pt-3">
            <dt>Total</dt><dd>${appointment.consultationFee || 0}</dd>
          </div>
        </dl>

        {free ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm">
            This appointment is free of charge — no payment required.
          </div>
        ) : paid ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm">
            Payment received. Your appointment is confirmed.
          </div>
        ) : !session ? (
          <button
            onClick={startCheckout} disabled={paying}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60"
          >
            {paying ? 'Creating checkout…' : 'Pay now'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 text-sm">
              Mock checkout session: <code>{session}</code>. In production this would redirect to a Stripe-hosted checkout page.
            </div>
            <button
              onClick={confirm} disabled={paying}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60"
            >
              {paying ? 'Confirming…' : 'Confirm payment (simulate)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
