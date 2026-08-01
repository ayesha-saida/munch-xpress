import React from 'react'

export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-8">
      <div>
        <h2 className="font-bold text-lg">MunchXpress</h2>
        <p>© 2026 MunchXpress. All rights reserved.</p>
      </div>

      <div className="grid grid-flow-col gap-4">
        <a className="link link-hover">Privacy Policy</a>
        <a className="link link-hover">Terms</a>
        <a className="link link-hover">Help</a>
      </div>
    </footer>
  );
}
