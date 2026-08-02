import React from 'react'

export default function Footer() {
  return (
    <footer className="footer footer-center bg-neutral-200 text-base-content p-8">
      <div>
        <h2 className="font-bold text-orange-600 text-2xl">MunchXpress</h2>
        <p className='text-gray-600 text-lg'>© 2026 MunchXpress. All rights reserved.</p>
      </div>

      <div className="flex flex-col sm:flex-row md:space-x-3 text-neutral-900 text-lg md:text-2xl">
        <a className="link link-hover">Privacy Policy</a>
        <a className="link link-hover">Terms</a>
        <a className="link link-hover">Help</a>
      </div>
    </footer>
  );
}
