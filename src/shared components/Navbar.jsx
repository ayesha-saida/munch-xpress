import React, { useContext } from 'react'
import { AuthContext } from '../context providers/AuthProvider'
import { Link, NavLink } from 'react-router'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { RxHamburgerMenu } from 'react-icons/rx'
import SignOut from './SignOut'

export default function Navbar() {
    const {user} = useContext(AuthContext) 

    const links = ( <>    
     <li> <NavLink to={'/'} className="hover:text-orange-600 hover:underline"> Home </NavLink> </li>
     <li> <NavLink to={'/discover'} className="hover:text-orange-600 hover:underline"> Discover </NavLink> </li>
     <li> <NavLink to={'/restaurants'} className="hover:text-orange-600 hover:underline"> Restaurants </NavLink> </li>

       { !user && (
     <li> <NavLink to={'/login'} className="hover:text-orange-600 hover:underline">Login</NavLink> </li>
    )}
  </>)  

  return (
<div className="navbar bg-base-100 shadow-sm fixed top-0 z-50">

  <div className="navbar-start">
    {/* Logo */}
    <p className="font-semibold p-3 text-xl sm:text-2xl text-orange-600">
          MunchXpress </p>
  </div>

  {/* Center navbar for dekstop */}
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1 sm:text-xl">{links}</ul>
  </div>


  {/* navbar end after logged in */}
   <div className="navbar-end sm:space-x-3 space-x-0">
 
  {user && <div>
    <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
                <IoCartOutline className='h-5 w-5 sm:h-7 sm:w-7 text-orange-700' />
              {/* <span className="badge badge-sm indicator-item text-orange-600"> 0 </span> */}
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-sm dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
          </div>
      </div>

    <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div>
            <FaRegUserCircle className='h-5 w-5 sm:h-6 sm:w-6 text-orange-700' />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100
            rounded-box z-1 mt-3 w-52 p-2 shadow">
          
            <li><a className="justify-between text-sm hover:underline hover:text-orange-500">
                Profile </a> </li>

            <li> <SignOut/>  </li>
          </ul>
      </div> 
    </div>}

  {/* Mobile Hamburger for navbar items located in center */}
   <div className="dropdown lg:hidden"> 
      <div tabIndex={0} role="button" className="btn btn-ghost">
          <RxHamburgerMenu className='h-5 w-5 text-orange-700' />
      </div>

      <ul
        tabIndex="-1"
          className="menu menu-sm dropdown-content bg-base-100 
          text-base-content rounded-box z-50 mt-3 
          w-52 p-2 shadow left-1/2 -translate-x-1/2">
          {links}        
      </ul>
  </div>

 </div>

</div>
  )
}

