import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../context providers/AuthProvider'
import { successToast } from './ToastContainer'


export default function SignOut() {    
  const navigate = useNavigate()
  const {logOut, user} = useContext(AuthContext)     

  const handleLogOut = () => {
    const userName = user?.displayName || 'User'
 //   console.log("logout button clicked")
     
    logOut().then(() => {
      successToast(`${userName} you're signing out!`)  
      navigate('/login')
    }).catch((error) => {
       errorToast(error)
    });
  }

  return (
    <div>
            {/* logout Button */}
  <button type='submit' className="text-sm  
    hover:text-orange-600 hover:bg-white 
    hover:underline cursor-pointer" onClick={handleLogOut}>
            Logout
      </button>    
    </div>
  )
}
