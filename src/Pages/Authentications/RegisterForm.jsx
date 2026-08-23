import { useContext, useEffect, useState } from 'react'
import icon from '../../assets/google-icon.png'
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context providers/AuthProvider';
import { defaultToast, errorToast, successToast } from '../../shared components/ToastContainer';
import FieldError from '../../shared components/FieldError';
import { inputClass } from '../../utils/formStyle';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { BeatLoader } from 'react-spinners';

/* at least one lowercase, one uppercase, one digit, one special, min 6 */
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+])[A-Za-z\d@$!%*?&#^()\-_=+]{6,}$/

export default function RegisterForm() {

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  const { registerUser,
          signInWithGoogle,
          user, loading,
          updateUserProfile} = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (!loading && user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <BeatLoader />
  }

   const handleRegister = async ({ name, email, password }) => {
  try {
    await registerUser(email, password)

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

<form onSubmit={handleSubmit(handleRegister)} noValidate className="space-y-4">
{/* Full Name */}
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Full Name</label>
  <input
    {...register('name', {
      required: 'Name is required',
      minLength: { value: 2, message: 'Name is too short' },
    })}
    className={inputClass(errors.name)} placeholder="Your name" type="text"/>

  <FieldError error={errors.name} />
</div>

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

{/* Password Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Password</label>

{/* Wrapper is the positioning context, so the toggle centres on the input
    itself and stays put when the label line height changes at md. */}
<div className="relative">
  <input
    {...register('password', {
      required: 'Password is required',
      minLength: { value: 6, message: 'Use at least 6 characters' },
      pattern: {
        value: passwordPattern,
        message: 'Add an uppercase, a lowercase, a number and a special character',
      },
    })}
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


<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Confirm Password</label>

<div className="relative">
  <input
    {...register('confirmPassword', {
      required: 'Please confirm your password',
      validate: (value) => value === getValues('password') || 'Passwords do not match',
    })}
    className={`${inputClass(errors.confirmPassword)} pr-12`}
    placeholder="••••••••" type={showConfirmPassword ? "text" : "password"}/>

<button type='button' onClick={()=> setShowConfirmPassword(!showConfirmPassword) }
  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
  aria-pressed={showConfirmPassword}
  className='absolute inset-y-0 right-0 flex w-12 items-center justify-center
  rounded-r-xl text-xl text-gray-500 cursor-pointer transition hover:text-gray-700'>
 {showConfirmPassword ? <IoIosEye /> :  <IoIosEyeOff /> }
 </button>
</div>

  <FieldError error={errors.confirmPassword} />
</div>
</div>


{/*Account creating button */}
<button type='submit' disabled={isSubmitting}
  className="mt-4 h-14 w-full rounded-xl bg-orange-500
  text-white text-sm md:text-lg font-semibold
  shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95
  disabled:cursor-not-allowed disabled:opacity-60">
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
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
