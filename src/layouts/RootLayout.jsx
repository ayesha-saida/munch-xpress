import React from 'react'
import Navbar from '../shared components/Navbar'
import Footer from '../shared components/Footer'
import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <>
    <Navbar /> 
    <Outlet /> 
    <Footer /> 
    </>
  )
}
