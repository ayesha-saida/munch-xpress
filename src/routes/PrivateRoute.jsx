import React, { useContext } from 'react'
import { Navigate } from 'react-router'
import { AuthContext } from '../context providers/AuthProvider'
import Loading from '../shared components/Loading'

export default function PrivateRoute({children}) {

     const {user, loading} = useContext(AuthContext)
         if (loading) {
              return <Loading /> 
          } 
         if (user) {
              return children
         }     
  
    return  <Navigate to={'/login'} /> 
}
