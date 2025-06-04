import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

const NavBar = () => {
  const [tokenIs, settoken] = useState(null)
  const [user, setusername] = useState(null)
  // const Nav = useNavigate();


  useEffect(()=>{
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  console.log(token)
  settoken(token)
  setusername(username)
  },[tokenIs])

  const handlelogout = () =>{
    // localStorage.setItem('token',null)
    localStorage.clear();
    settoken(null);
    
  }

  return (
    <>
      <nav className='flex justify-between items-center bg-gray-100 pt-4 py-4 px-5'>
        <section>
          <h1 className="text-3xl font-bold text-green-600">Smart HealthConnect</h1>
        </section>
        <section>
          <ul className='flex gap-4'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            {
              tokenIs ? <>
              <li>{user?user:null}</li>
                <li><button className='bg-green-500 rounded py-1 px-3 text-white' onClick={handlelogout}>Logout</button></li>
              </> : <>
                <li><button className='bg-green-500 rounded py-1 px-3 text-white'><Link to="/register">Register </Link></button></li>
                <li><button className='bg-green-500 rounded py-1 px-3 text-white'><Link to='/login'>Login</Link></button></li>

              </>
            }
          </ul>
        </section>
      </nav>
    </>
  )
}

export default NavBar