const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_User = `${API_BASE}/api/v0/users`;

export const API_Doctor = `${API_BASE}/api/v0/doctors`;

export const API_HospitalAdmin = `${API_BASE}/api/v0/hospitalAdmin`;

export const API_SuperAdmin = `${API_BASE}/api/v0/superAdmin`;

export const API_Appointment = `${API_BASE}/api/v0/appointments`;