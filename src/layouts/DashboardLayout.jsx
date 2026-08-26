import React from 'react'
import Sidebar from '../shared components/Sidebar'
import { Outlet } from 'react-router'
import Footer from '../shared components/Footer'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Sidebar />

      <div className="flex min-h-screen flex-col lg:pl-64">        
        <main className="flex-1 px-4 pb-10 pt-20 sm:px-6 lg:pt-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
