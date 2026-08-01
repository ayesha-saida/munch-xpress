import React from 'react'

export default function Navbar() {
  return (
 <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50">
      <div className="flex-1">
        <button className="btn btn-ghost btn-circle">
          ☰
        </button>

        <a className="btn btn-ghost text-2xl lg:text-3xl text-orange-600">
          MunchXpress
        </a>
      </div>

      <div className="flex-none">
        <button className="btn btn-ghost lg:text-2xl text-xl text-black">Skip</button>
      </div>
    </div>
  )
}

