import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from 'react';
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Layout from "./Components/Layout";
import DocCards from "./Components/Specialization Cards/cardComponent/DocCards";
import Doctors from "./Pages/Doctors/Doctors";
import PharmasNearYou from "./Components/PharmasNearYou/PharmasNearYou";
import NearbyPharmas from "./Components/PharmasNearYou/NearbyPharmas";
import HospNearYou from "./Components/HospitalNearYou/HospNearYou";
import NearbyHospitals from "./Components/HospitalNearYou/NearbyHospitals";
import AIAgent from "./Components/AIAgent/AIAgent";
import AiConsultant from "./Components/AIAgent/AiConsultant";
import ProtectedRoute from "./Pages/protectedRouteError/protectedRoutesErrorpage";
import Appointment from "./Pages/Appointment/Appointment";
import UserDashboard from "./Pages/UserDashboard/UserDashboard";
import DoctorDashboard from "./Pages/DoctorDashboard/DoctorDashboard";
import HospitalAdmin from "./Pages/HospitalAdmin/HospitalAdmin";
import SystemAdminDashboard from "./Pages/SystemAdminDashboard/SystemAdminDashboard";
import FAQ from "./Pages/FAQ/FAQ";
import ContactUs from "./Pages/Contact/ContactUs";
import NotFound from "./Pages/NotFound/NotFound";
import PatientProfile from "./Pages/Profile/PatientProfile";
import './index.css'; // Ensure Tailwind is imported

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
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
              {/* Public Routes within Layout */}
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<ContactUs />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* User Features */}
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<PatientProfile />} />
                <Route path="/ai-consultation" element={<AiConsultant />} />
                <Route path="/book-appointment" element={<Appointment />} />
                <Route path="/find-doctors" element={<DocCards />} />
                <Route path="/doctors/:specialization" element={<Doctors />} />

                {/* Location Services */}
                <Route path="/find-pharmacies" element={<NearbyPharmas />} />
                <Route path="/find-hospitals" element={<NearbyHospitals />} />

                {/* Role-based Dashboards */}
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/hospital-admin" element={<HospitalAdmin />} />
                <Route path="/system-admin" element={<SystemAdminDashboard />} />
              </Route>

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
