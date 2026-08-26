import { useContext } from 'react'
import { Navigate } from 'react-router'
import { AuthContext } from '../context providers/AuthProvider'
import Loading from '../shared components/Loading'

export default function AdminRoute({ children }) {
  const { user, loading, role, roleLoading } = useContext(AuthContext)

  if (loading || roleLoading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to={'/login'} />
  }

  if (role !== 'admin') {
    return <Navigate to={'/'} />
  }

  return children
}
