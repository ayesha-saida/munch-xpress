import React from 'react'
import burgerImg from "../../assets/carousel picture/burger_with_melting_cheese.png"
import LoginForm from './LoginForm'

export default function Login() {
  return (
<main className="min-h-screen bg-stone-50 pt-16 flex flex-col sm:flex-row">

{/* Desktop Left / Mobile Top Image Section */} 
<div className="relative w-full h-[35vh] md:h-auto md:w-1/2 overflow-hidden bg-gray-300">
<img 
src={burgerImg}
alt="burger_with_melting_cheese" 
className="w-full h-full object-cover md:clip-none" />
</div>

{/* Login Form Section */}
<LoginForm /> 
      </main>

  )
}
