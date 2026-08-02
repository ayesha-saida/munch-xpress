import React from 'react'
import icon from '../assets/google-icon.png'
import { Link } from 'react-router';

export default function RegisterForm() {
  return (
<div className="relative z-10 flex w-full items-start justify-center bg-gray-50 p-6 md:p-10 -mt-10 md:mt-0 md:w-1/2 md:items-center md:bg-transparent">
<div className="mb-10 w-full max-w-md rounded-3xl bg-white p-6 custom-shadow md:rounded-xl md:p-10">
<div className="mb-10 text-center md:text-left">
<h1 className="text-3xl md:text-5xl font-bold text-gray-900">Start Your Journey</h1>
<p className="pt-3 text-lg md:text-xl text-gray-600">Create an account to explore premium flavors.</p>
</div>
<form className="space-y-4">
{/* Full Name */}
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Full Name</label>
<input className="w-full h-14 rounded-xl border border-gray-300 px-4 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Your name" type="text"/>
</div>
{/* Email */}
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Email Address</label>
<input className="w-full h-14 rounded-xl border border-gray-300 px-4 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="your@email.com" type="email"/>
</div>
{/* Password Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Password</label>
<input className="w-full h-14 rounded-xl border border-gray-300 px-4 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="••••••••" type="password"/>
</div>
<div className="space-y-1">
<label className="block text-sm md:text-lg font-medium text-gray-700">Confirm Password</label>
<input className="w-full h-14 rounded-xl border border-gray-300 px-4 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="••••••••" type="password"/>
</div>
</div>
{/* Terms & Privacy */}
<div className="flex items-start gap-2 pt-2">
<div className="pt-1">
<input className="custom-checkbox w-5 h-5 rounded-md border border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer transition-colors" id="terms" type="checkbox"/>
</div>
<label className="text-sm md:text-lg font-medium text-gray-600 leading-relaxed" htmlFor="terms">
  I agree to the <a className="text-orange-500 underline" href="#">Terms of Service</a> and <a className="text-orange-500 underline" href="#">Privacy Policy</a>.
</label>
</div>

{/*CTA Button */}
<button className="mt-4 h-14 w-full rounded-xl bg-orange-500 text-white text-sm md:text-lg font-semibold shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-95">
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
<button className="flex h-14 items-center justify-center p-3 rounded-xl border border-gray-300 transition hover:bg-gray-100 active:scale-95">
<img src={icon} alt="google icon" className='h-6 w-6' />
<span className="text-sm md:text-lg px-2 font-semibold text-gray-900">Continue with Google</span>
</button>
</div>

{/* Log In Link */}
<div className="mt-10 text-center">
<p className="text-sm md:text-lg  text-gray-600">
                        Already have an account? <Link to={'/login'} className="text-orange-500 font-bold hover:underline transition-all">Log in</Link>
</p>
</div>
</div>
</div>
  );
}