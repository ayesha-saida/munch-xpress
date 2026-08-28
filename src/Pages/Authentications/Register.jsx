import React from 'react'
import saladImg from "../../assets/carousel picture/bowl_of_fresh_salad.png"
import RegisterForm from "./RegisterForm";

export default function Register() {
  return (
      <main className="min-h-screen bg-stone-50 pt-16 flex flex-col sm:flex-row">
  {/* Desktop Left / Mobile Top Image Section */} 

  <div className="relative w-full h-[35vh] md:h-auto md:w-1/2 overflow-hidden bg-gray-300">
    <img 
    src={saladImg}
    alt="Fresh salad bowl with grilled chicken and citrus" 
    className="w-full h-full object-cover md:clip-none" />

  <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent md:hidden"></div>

    {/* Desktop Branding Overlay */}
    <div className="hidden md:flex absolute inset-0 bg-overlay
        items-center justify-center text-white text-center">
      <div className="max-w-md backdrop-blur-md bg-glass p-xl rounded-xl 
           border border-glass-border">
        <h2 className="text-xl mb-md">Savor Every Moment.</h2>
        <p className="text-lg text-neutral-100">
          Experience artisanal cuisine delivered to your doorstep with uncompromising quality.</p>
      </div>
    </div>
  </div>

{/* Registration Form Section */}
<RegisterForm /> 
      </main>
  );
}