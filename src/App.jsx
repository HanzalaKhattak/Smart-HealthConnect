import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Pages/Home/Home"
import About from "./Pages/About/About"
import Register from "./Pages/Register/Register"
import Login from "./Pages/Login/Login"
import Layout from "./Components/Layout"
import DocCards from "./Components/Specialization Cards/cardComponent/DocCards"
import Doctors from "./Pages/Doctors/Doctors"
import PharmasNearYou from "./Components/PharmasNearYou/PharmasNearYou"
import NearbyPharmas from "./Components/PharmasNearYou/NearbyPharmas"
import HospNearYou from "./Components/HospitalNearYou/HospNearYou"
import NearbyHospitals from "./Components/HospitalNearYou/NearbyHospitals"

function App() {
  return(
    <>
    <BrowserRouter>

      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login />}/>


        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>}/>
          <Route path='/' element={<PharmasNearYou />} />
          <Route path='/nearby' element={<NearbyPharmas />} /> 
          <Route path='/hospital-near-you' element={<HospNearYou />} />
          <Route path='/nearby-hospitals' element={<NearbyHospitals />} />
          <Route path="/" element={<DocCards />} />
        <Route path="/doctors/:specialization" element={<Doctors />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
