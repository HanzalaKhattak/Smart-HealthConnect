import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Pages/Home/Home"
import About from "./Pages/About/About"
import NavBar from "./Components/NavBar"
import Register from "./Pages/Register/Register"
import Login from "./Login/Login"




function App() {
  return(
    <>
    <BrowserRouter>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>}/>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
