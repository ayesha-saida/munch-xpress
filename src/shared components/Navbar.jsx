import React, { useContext } from 'react'
import { AuthContext } from '../context providers/AuthProvider'
import { Link, NavLink } from 'react-router'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { RxHamburgerMenu } from 'react-icons/rx'
import SignOut from './SignOut'
import { CartContext } from '../context providers/CartProvider'


export default function Navbar() {
    const {user, role} = useContext(AuthContext) 
    const { itemCount, cartLoading } = useContext(CartContext)

    const navLinkClass = ({ isActive }) =>
    `bg-transparent hover:bg-transparent hover:underline ${
      isActive
        ? 'text-orange-600 font-semibold'
        : 'text-gray-700'
    }`

    const links = ( <>    
     <li> <NavLink to={'/'}  className={navLinkClass}> Home </NavLink> </li>

     <li> <NavLink to={'/discover'} className={navLinkClass}> Discover </NavLink> </li>
     
       { !user && (
     <li> <NavLink to={'/login'} className={navLinkClass}> Login </NavLink> </li>
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
    <Link to={'/cart'} aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart'}
       className="btn btn-ghost btn-circle">
      <div className="indicator">
        <IoCartOutline className='h-5 w-5 sm:h-7 sm:w-7 text-orange-700' />

        {/* hidden on the first load rather than flashing a 0 that then jumps */}
        {!cartLoading && itemCount > 0 && (
          <span className="badge badge-xs sm:badge-sm indicator-item bg-orange-600 text-white border-none">
            {itemCount}
          </span>
        )}
      </div>
    </Link>

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
          
            <li> <Link to={role === "admin" ? "/dashboard/users" : "/profile"}
             className="justify-between text-sm hover:underline hover:text-orange-500">                          
                      Profile   </Link> </li> 

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

