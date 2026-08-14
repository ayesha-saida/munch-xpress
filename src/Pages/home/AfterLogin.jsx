import { useContext, useState } from 'react'
import userImg from '../../assets/user-icon.png'
import { AuthContext } from '../../context providers/AuthProvider.jsx';
import { useNavigate } from 'react-router';
import SignOut from '../../shared components/SignOut.jsx';

export default function AfterLogin() {

  const {user} = useContext(AuthContext)  
  //console.log(user)   

  return (
    <main className="min-h-screen bg-stone-50 pt-16 flex flex-col sm:flex-row">

    <h1 className='text-6xl p-6'>After Login</h1>

    {user && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold">
              Welcome, {user.displayName}!
            </h2>

              <img
                src={userImg}
                alt={user.displayName}
                className="mt-4 h-20 w-20 rounded-full"
              />
          </div>
        )}

        <SignOut /> 

</main>
  )
}
