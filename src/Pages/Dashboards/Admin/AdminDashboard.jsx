import React, { useContext } from 'react'
import { AuthContext } from '../../../context providers/AuthProvider'
import Loading from '../../../shared components/Loading'

export default function AdminDashboard() {
    const {user, role, loading, syncUser} = useContext(AuthContext)

  return (
    <section className="rounded-[20px] bg-white p-6 custom-shadow sm:p-8">
      <h2 className="text-xl font-medium text-gray-900">Admin Dashboard</h2>   
    </section>
  )
}
