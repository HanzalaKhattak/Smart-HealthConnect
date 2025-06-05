import React, { Suspense } from 'react'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
  </div>
)

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default Layout