import React, { useContext, useEffect, useState } from 'react'
import icon from '../../assets/google-icon.png'
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../../context providers/AuthProvider';
import { updateProfile} from 'firebase/auth'
import { defaultToast, errorToast, successToast } from '../../shared components/ToastContainer';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { BeatLoader } from 'react-spinners';

export default function RegisterForm() {
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  const { registerUser, 
          signInWithGoogle,
          user, loading, 
          updateUserProfile} = useContext(AuthContext)

  useEffect(() => {
    if (!loading && user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <BeatLoader />
  }

   const handleRegister = async(e) => {
    e.preventDefault()
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

  console.log({name, email, password, confirmPassword})

  if (password !== confirmPassword) {
    errorToast('Passwords do not match')
    return
  }
  
     /* password validation */
   const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+])[A-Za-z\d@$!%*?&#^()\-_=+]{6,}$/;

    console.log(regExp.test(password));

    if (!regExp.test(password)) {
     errorToast(
        "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character")
      return;
    }

  try {
    const result = await registerUser(email, password)

    await updateUserProfile({
      displayName: name
    })

   successToast('Registration Successfull 🎉')  
   navigate('/')
  }

  catch(e)  {
    console.log(e)

    const errorCode = e.code;
    const errorMessage = e.message;

     if (errorCode === "auth/email-already-in-use") {
          defaultToast(
            "User already exists in the database"
          );
        } else if (errorCode === "auth/weak-password") {
         defaultToast("You have to provide atleast 6 digit password");
        } else if (errorCode === "auth/invalid-email") {
         errorToast("Invalid email format. Please check your email.");
        } else if (errorCode === "auth/user-not-found") {
          defaultToast("User not found. Please sign up first.");
        } else if (errorCode === "auth/wrong-password") {
          errorToast("Wrong password. Please try again.");
        } else if (errorCode === "auth/user-disabled") {
         defaultToast("This user account has been disabled.");
        } else if (errorCode === "auth/too-many-requests") {
          defaultToast("Too many attempts. Please try again later.");
        } else if (errorCode === "auth/operation-not-allowed") {
          errorToast("Operation not allowed. Please contact support.");
        } else if (errorCode === "auth/network-request-failed") {
          defaultToast("Network error. Please check your connection.");
        } else {
          defaultToast(errorMessage || "An unexpected error occurred.");
        }
  };
}

  const handleGoogleSignIn = async() => {    
    try {
    const result = await signInWithGoogle()

    console.log('Google user:', result.user)

    successToast('Registration successful with Google')
    navigate('/')
  } catch (error) {
    console.error(error)

    if (error.code === 'auth/popup-closed-by-user') {
      defaultToast('Google sign-in was cancelled')
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      defaultToast('An account already exists with this email')
    } else {
      defaultToast(error.message || 'Google sign-in failed')
    }
  }
  };

  return (
<div className="relative z-10 flex w-full items-start justify-center
   bg-gray-50 p-6 md:p-10 -mt-10 md:mt-0 md:w-1/2 md:items-center md:bg-transparent">

<div className="mb-10 w-full max-w-md rounded-3xl bg-white p-6 
  custom-shadow md:rounded-xl md:p-10">
<div className="mb-10 text-center md:text-left">
<h1 className="text-3xl md:text-5xl font-bold text-gray-900">Start Your Journey</h1>
<p className="pt-3 text-lg md:text-xl text-gray-600">Create an account to explore premium flavors.</p>
</div>

<form onSubmit={handleRegister} className="space-y-4">
{/* Full Name */}
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Full Name</label>
  <input className="w-full h-14 rounded-xl border border-gray-300 px-4 
  transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500 
  outline-none" name='name' placeholder="Your name" type="text"/>
</div>

{/* Email */}
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Email Address</label>
 
  <input className="w-full h-14 rounded-xl border border-gray-300 px-4
  transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none"
  name='email' placeholder="your@email.com" type="email"/>
</div>

{/* Password Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="space-y-1 relative">
<label className="block text-sm md:text-lg font-medium text-gray-700">Password</label>
  
  <input className="w-full h-14 rounded-xl border border-gray-300 px-4 
  transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500 
  outline-none" name='password' placeholder="••••••••" type={showPassword ? "text" : "password"}/>

<span onClick={()=> setShowPassword(!showPassword) } className='absolute right-3.75 top-12.5 cursor-pointer z-50'> 
 {showPassword ? <IoIosEye /> :  <IoIosEyeOff /> }   
 </span>
</div>


<div className="space-y-1 relative">
<label className="block text-sm md:text-lg font-medium text-gray-700">Confirm Password</label>
  
  <input className="w-full h-14 rounded-xl border
  border-gray-300 px-4 transition focus:border-orange-500 focus:ring-2
  focus:ring-orange-500 outline-none" name='confirmPassword' 
  placeholder="••••••••" type={showConfirmPassword ? "text" : "password"}/>

<span onClick={()=> setShowConfirmPassword(!showConfirmPassword) } className='absolute right-3.75 top-12.5 cursor-pointer z-50'> 
 {showConfirmPassword ? <IoIosEye /> :  <IoIosEyeOff /> }   
 </span>
</div>
</div>


{/*Account creating button */}
<button type='submit'
  className="mt-4 h-14 w-full rounded-xl bg-orange-500
  text-white text-sm md:text-lg font-semibold 
  shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95">
                        Create Account
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
<button onClick={handleGoogleSignIn} className="flex h-14 items-center justify-center p-3 rounded-xl border border-gray-300 transition hover:bg-gray-100 active:scale-95">
<img src={icon} alt="google icon" className='h-6 w-6' />
<span className="text-sm md:text-lg px-2 font-semibold text-gray-900">Continue with Google</span>
</button>
</div>


{/* Log In Link */}
<div className="mt-10 text-center">
  <p className="text-sm md:text-lg  text-gray-600">
  Already have an account? <Link to={'/login'}
   className="text-orange-500 font-bold hover:underline transition-all">Log in</Link>
  </p>
</div>
</div>
</div> 
  );
}