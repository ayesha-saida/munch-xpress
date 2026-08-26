import { useContext } from 'react'
import { AuthContext } from '../../context providers/AuthProvider'
import Loading from '../../shared components/Loading'
import AdminDashboard from './Admin/AdminDashboard'

export default function DashboardHome() {
  const { role, roleLoading, syncUser } = useContext(AuthContext)

  if (roleLoading) {
    return <Loading />
  }

  if (role === 'admin') {
    return <AdminDashboard />
  }

  return (
    <section className="rounded-[20px] bg-white p-6 text-center custom-shadow sm:p-8">
      <h2 className="text-xl font-medium text-gray-900">
        We couldn't load your account
      </h2>

      <p className="mx-auto mt-2 max-w-md text-[13px] leading-4.75 text-gray-600">
        You're signed in, but the server didn't send your account details back,
        so we don't know which dashboard to show you.
      </p>

      <button
        type="button"
        onClick={() => syncUser()}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-xl
          bg-orange-500 px-8 text-sm font-semibold text-white transition
          hover:bg-orange-600 active:scale-95">
        Try again
      </button>
    </section>
  )
}
