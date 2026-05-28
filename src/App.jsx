import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import Layout from './Components/Layout';
import AiConsultant from './Components/AIAgent/AiConsultant';
import ProtectedRoute from './Pages/protectedRouteError/ProtectedRoutesErrorpage';
import Appointment from './Pages/Appointment/Appointment';
import UserDashboard from './Pages/UserDashboard/UserDashboard';
import DoctorDashboard from './Pages/DoctorDashboard/DoctorDashboard';
import HospitalAdmin from './Pages/HospitalAdmin/HospitalAdmin';
import SystemAdminDashboard from './Pages/SystemAdminDashboard/SystemAdminDashboard';
import FAQ from './Pages/FAQ/FAQ';
import ContactUs from './Pages/Contact/ContactUs';
import NotFound from './Pages/NotFound/NotFound';
import PatientProfile from './Pages/Profile/PatientProfile';
import DoctorEditProfile from './Pages/DoctorProfile/DoctorEditProfile';
import VideoSession from './Pages/VideoSession/VideoSession';
import FindDoctors from './Pages/FindDoctors/FindDoctors';
import FindHospitals from './Pages/FindHospitals/FindHospitals';
import FindPharmacies from './Pages/FindPharmacies/FindPharmacies';
import Payment from './Pages/Payment/Payment';
import MedicalRecords from './Pages/MedicalRecords/MedicalRecords';
import './index.css';

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
