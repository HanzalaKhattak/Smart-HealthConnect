import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Pages/Home/Home"
import About from "./Pages/About/About"
import NavBar from "./Components/NavBar"
import Register from "./Pages/Register/Register"
import Login from "./Pages/Login/Login"
import Layout from "./Components/Layout"

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
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
