import { useContext, useEffect, useState } from 'react'
import icon from '../../assets/google-icon.png'
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context providers/AuthProvider';
import { errorToast, successToast } from '../../shared components/ToastContainer';
import FieldError from '../../shared components/FieldError';
import { inputClass } from '../../utils/formStyle';
import { BeatLoader } from 'react-spinners';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';

export default function LoginForm() {

  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const { loginUser, loading,
          signInWithGoogle, user,
          resetPasswordWithEmail} = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (!loading && user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <BeatLoader />
  }

   const handleLogin = async ({ email, password }) => {
    try {
      await loginUser(email, password)

      successToast('Login Succesfull')
      navigate('/')
    } catch (error) {
     console.log(error)

       // Firebase specific error handling
        if (error.code === 'auth/user-not-found') {
          errorToast('User not found. Please register first.')
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorToast('Wrong password. Please try again.')
        } else if (error.code === 'auth/invalid-email') {
          errorToast('Invalid email address.')
        } else {
          errorToast('Login failed. Please try again.')
        }
    }
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
  const email = getValues('email')

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

<form onSubmit={handleSubmit(handleLogin)} noValidate className="space-y-4">

{/* Email */}
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Email Address</label>
  <input
    {...register('email', {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Enter a valid email address',
      },
    })}
    className={inputClass(errors.email)} placeholder="your@email.com" type="email"/>

  <FieldError error={errors.email} />
</div>

{/* Password */}
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Password</label>

{/* Wrapper is the positioning context, so the toggle centres on the input
    itself and stays put when the label line height changes at md. */}
<div className="relative">
  <input
    {...register('password', { required: 'Password is required' })}
    className={`${inputClass(errors.password)} pr-12`}
    placeholder="••••••••" type={showPassword ? "text" : "password"}/>

  <button type='button' onClick={()=> setShowPassword(!showPassword) }
    aria-label={showPassword ? 'Hide password' : 'Show password'}
    aria-pressed={showPassword}
    className='absolute inset-y-0 right-0 flex w-12 items-center justify-center
    rounded-r-xl text-xl text-gray-500 cursor-pointer transition hover:text-gray-700'>
   {showPassword ? <IoIosEye /> :  <IoIosEyeOff /> }
   </button>
</div>

  <FieldError error={errors.password} />
</div>


{/* Submit Button */}
<button type='submit' disabled={isSubmitting} className="mt-4 h-14 w-full rounded-xl
 bg-orange-500 text-white text-sm md:text-lg font-semibold shadow-lg
 shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95
 disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? 'Logging in...' : 'Login'}
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
