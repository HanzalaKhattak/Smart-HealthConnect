import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Home from './Pages/Home/Home';
import Layout from './Components/Layout';
import './index.css';

const About = lazy(() => import('./Pages/About/About'));
const Register = lazy(() => import('./Pages/Register/Register'));
const Login = lazy(() => import('./Pages/Login/Login'));
const ForgotPassword = lazy(() => import('./Pages/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('./Pages/ResetPassword/ResetPassword'));
const AiConsultant = lazy(() => import('./Components/AIAgent/AiConsultant'));
const ProtectedRoute = lazy(() => import('./Pages/protectedRouteError/ProtectedRoutesErrorpage'));
const Appointment = lazy(() => import('./Pages/Appointment/Appointment'));
const UserDashboard = lazy(() => import('./Pages/UserDashboard/UserDashboard'));
const DoctorDashboard = lazy(() => import('./Pages/DoctorDashboard/DoctorDashboard'));
const HospitalAdmin = lazy(() => import('./Pages/HospitalAdmin/HospitalAdmin'));
const SystemAdminDashboard = lazy(() => import('./Pages/SystemAdminDashboard/SystemAdminDashboard'));
const FAQ = lazy(() => import('./Pages/FAQ/FAQ'));
const ContactUs = lazy(() => import('./Pages/Contact/ContactUs'));
const NotFound = lazy(() => import('./Pages/NotFound/NotFound'));
const PatientProfile = lazy(() => import('./Pages/Profile/PatientProfile'));
const DoctorEditProfile = lazy(() => import('./Pages/DoctorProfile/DoctorEditProfile'));
const VideoSession = lazy(() => import('./Pages/VideoSession/VideoSession'));
const FindDoctors = lazy(() => import('./Pages/FindDoctors/FindDoctors'));
const FindHospitals = lazy(() => import('./Pages/FindHospitals/FindHospitals'));
const FindPharmacies = lazy(() => import('./Pages/FindPharmacies/FindPharmacies'));
const Payment = lazy(() => import('./Pages/Payment/Payment'));
const MedicalRecords = lazy(() => import('./Pages/MedicalRecords/MedicalRecords'));

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans">
      <BrowserRouter>
        <Suspense fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        }>
          <Routes>
            {/* Public auth routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Authenticated routes WITHOUT Navbar/Footer */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/profile" element={<PatientProfile />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor/edit-profile" element={<DoctorEditProfile />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/ai-consultation" element={<AiConsultant />} />
              <Route path="/session/:appointmentId" element={<VideoSession />} />
            </Route>

            <Route element={<Layout />}>
              {/* Public Routes within Layout */}
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/find-doctors" element={<FindDoctors />} />
              <Route path="/find-hospitals" element={<FindHospitals />} />
              <Route path="/find-pharmacies" element={<FindPharmacies />} />

              {/* Patient routes */}
              <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/book-appointment" element={<Appointment />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/payment/:appointmentId" element={<Payment />} />
                <Route path="/medical-records" element={<MedicalRecords />} />
              </Route>

              {/* Doctor routes */}
              <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              </Route>

              {/* Hospital admin routes */}
              <Route element={<ProtectedRoute allowedRoles={['hospitalAdmin']} />}>
                <Route path="/hospital-admin" element={<HospitalAdmin />} />
              </Route>

              {/* System admin routes */}
              <Route element={<ProtectedRoute allowedRoles={['systemAdmin']} />}>
                <Route path="/system-admin" element={<SystemAdminDashboard />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
