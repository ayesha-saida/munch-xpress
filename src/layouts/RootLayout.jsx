import React from 'react'
import Navbar from '../shared components/Navbar'
import Footer from '../shared components/Footer'
import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
    <Navbar /> 
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    <Footer /> 
    </div>
  )
}
