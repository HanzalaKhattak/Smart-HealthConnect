const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_BASE_URL = API_BASE;
export const API_User = `${API_BASE}/api/v0/users`;
export const API_Doctor = `${API_BASE}/api/v0/doctors`;
export const API_HospitalAdmin = `${API_BASE}/api/v0/hospitalAdmin`;
export const API_SuperAdmin = `${API_BASE}/api/v0/superAdmin`;
export const API_Appointment = `${API_BASE}/api/v0/appointments`;
export const API_Hospital = `${API_BASE}/api/v0/hospitals`;
export const API_Notification = `${API_BASE}/api/v0/notifications`;
export const API_Review = `${API_BASE}/api/v0/reviews`;
export const API_MedicalRecord = `${API_BASE}/api/v0/medical-records`;
export const API_Payment = `${API_BASE}/api/v0/payments`;
export const API_AI = `${API_BASE}/api/v0/ai`;
