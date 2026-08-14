import React, { useContext, useEffect, useRef, useState } from 'react'
import icon from '../../assets/google-icon.png'
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../context providers/AuthProvider';
import { defaultToast, errorToast, successToast } from '../../shared components/ToastContainer';
import { BeatLoader } from 'react-spinners';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';

export default function LoginForm() {

  const emailRef = useRef(null)
  
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const { loginUser, loading,
          signInWithGoogle, user, 
          updateUserProfile, resetPasswordWithEmail} = useContext(AuthContext)

  useEffect(() => {
    if (!loading && user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <BeatLoader />
  }

   const handleLogin = (e) => {
        e.preventDefault()
    const email = e.target.email.value;
    const password = e.target.password.value;

  console.log({email, password})

     loginUser(email, password)
     .then(result => {
     console.log(result.user)
     successToast('Login Succesfull')
     navigate('/')

    }).catch(error => {
     console.log(error)

       // Firebase specific error handling
        if (error.code === 'auth/user-not-found') {
          errorToast('User not found. Please register first.')
        } else if (error.code === 'auth/wrong-password') {
          errorToast('Wrong password. Please try again.')
        } else if (error.code === 'auth/invalid-email') {
          errorToast('Invalid email address.')
        } else {
          errorToast('Login failed. Please try again.')
        }
    })     

  }
  
    const handleGoogleSignIn = async() => {
      
      try {
      const result = await signInWithGoogle()
      console.log('Google user:', result.user)
      successToast('Login successful 🎉')
      navigate('/')
    } 
    catch (error) {
      console.error(error)
  
      if (error.code === 'auth/popup-closed-by-user') {
        errorToast('Google sign-in was cancelled')
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorToast('An account already exists with this email')
      } else {
        errorToast(error.message || 'Google sign-in failed')
      }
    }
    };

  const handleForgetPassword = async () => {    
  const email = emailRef.current.value
    console.log(email)

   if (!email) {
    errorToast('Please enter your email first')
    return
  }

    try {
      await resetPasswordWithEmail(email)
      successToast('Check your email to reset your password')
  } catch (error) {
      console.log(error)
      errorToast(error.message)
    } 
  }     

  return (
<div className="relative z-10 flex w-full items-start justify-center
 bg-gray-50 p-6 md:p-10 -mt-10 md:mt-0 md:w-1/2 md:items-center md:bg-transparent">

<div className="mb-10 w-full max-w-md rounded-3xl
 bg-white p-6 custom-shadow md:rounded-xl md:p-10">

<div className="mb-10 text-center md:text-left">
<h1 className="text-3xl md:text-5xl font-bold text-gray-900">Welcome Back</h1>
<p className="pt-3 text-lg md:text-xl text-gray-600">Sign in to enjoy your Food Exploring Journey</p>
</div>

<form onSubmit={handleLogin} className="space-y-4">

{/* Email */}
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Email Address</label>
  <input name='email' ref={emailRef} className="w-full h-14 rounded-xl border border-gray-300 px-4
     transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500
     outline-none" placeholder="your@email.com" type="email"/>
</div>

{/* Password */}
<div className="space-y-1 relative">
<label className="block text-sm md:text-lg font-medium text-gray-700">Password</label>
  <input name='password' className="w-full h-14 rounded-xl border border-gray-300 px-4 
  transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500
  outline-none" placeholder="••••••••" type={showPassword ? "text" : "password"}/>

  <span onClick={()=> setShowPassword(!showPassword) } className='absolute right-3.75 top-12.5 cursor-pointer z-50'> 
   {showPassword ? <IoIosEye /> :  <IoIosEyeOff /> }   
   </span>
</div>


{/* Submit Button */}
<button type='submit' className="mt-4 h-14 w-full rounded-xl
 bg-orange-500 text-white text-sm md:text-lg font-semibold shadow-lg 
 shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95">
        Login
</button>

{/* Reset Button */}
<button type='button' className="text-sm md:text-lg hover:underline cursor-pointer" onClick={handleForgetPassword}>
          Forgot Password ?
</button>
</form>

{/* Divider */}
<div className="relative my-10">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200"></div>
  </div>

  <div className="relative flex justify-center">
    <span className="bg-white px-4 text-sm font-medium text-gray-500">
      OR CONTINUE WITH
    </span>
  </div>
</div>

{/* Social Logins */}
<div className='w-full flex justify-center'>

  <button onClick={handleGoogleSignIn} className="flex h-14 items-center justify-center 
  p-3 rounded-xl border border-gray-300 
  transition hover:bg-gray-100 active:scale-95">

<img src={icon} alt="google icon" className='h-6 w-6' />
<span className="text-sm md:text-lg px-2 font-semibold text-gray-900">Continue with Google</span>
</button>
</div>

{/* Log In Link */}
<div className="mt-10 text-center">
  <p className="text-sm md:text-lg  text-gray-600">
    Don't have an account? <Link to={'/register'} 
  className="text-orange-500 font-bold hover:underline transition-all">Sign Up</Link>
  </p>
</div>
</div>
</div>
  )
}
