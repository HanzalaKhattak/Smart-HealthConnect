import { BrowserRouter, Route, Routes } from "react-router-dom";
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
// import ProtectedRoute from "./Components/ProtectedRoute"; // new import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route path="/about" element={<About />} />
            <Route path="/pharmas" element={<PharmasNearYou />} />
            <Route path="/nearby" element={<NearbyPharmas />} />
            <Route path="/hospital-near-you" element={<HospNearYou />} />
            <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
            <Route path="/specializations" element={<DocCards />} />
            <Route path="/AiConsultant" element={<AiConsultant />} />
            <Route path="/ai" element={<AIAgent />} />
            <Route path="/doctors/:specialization" element={<Doctors />} />
            <Route path="/appointment" element={<Appointment/>}/>
            {/* <Route path="/protectedRoute" element={<ProtectedRoutesErrorpage />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
