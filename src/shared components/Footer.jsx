import React from 'react'

export default function Footer() {
  return (
    <footer className="footer footer-center bg-[#e3e2e2] text-base-content p-8">
      <div>
        <h2 className="font-bold text-[#994700] text-2xl">MunchXpress</h2>
        <p className='text-[#636262] text-lg'>© 2026 MunchXpress. All rights reserved.</p>
      </div>

      <div className="grid grid-flow-col gap-6 text-[#1c1b1b] text-2xl">
        <a className="link link-hover">Privacy Policy</a>
        <a className="link link-hover">Terms</a>
        <a className="link link-hover">Help</a>
      </div>
    </footer>
  );
}
