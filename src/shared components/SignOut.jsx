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
  <button type='submit' className="mt-4 h-14 w-full rounded-xl
  bg-orange-500 text-white text-sm md:text-lg font-semibold shadow-lg
    shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95
    hover:underline cursor-pointer" onClick={handleLogOut}>
            Logout
      </button>    
    </div>
  )
}
