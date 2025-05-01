import React from 'react'
import  {Link}  from 'react-router-dom'

const NavBar = () => {
  return (
    <>
      <nav className='flex justify-between items-center bg-gray-100 pt-4 py-4 px-5'>
        <section>
            <h1 className='text-4xl'>SHC</h1>
        </section>
        <section>
        <ul className='flex gap-4'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><button className='bg-green-500 rounded py-1 px-3 text-white'><Link to="/register">Register </Link></button></li>
            <li><button className='bg-green-500 rounded py-1 px-3 text-white'><Link to='/login'>Login</Link></button></li>
        </ul>
        </section>
      </nav>
    </>
  )
}

export default NavBar