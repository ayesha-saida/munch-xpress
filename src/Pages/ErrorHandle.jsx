import React from 'react'
import { Link } from 'react-router'

const ErrorPage = () => {
  return (
    <div  className='min-h-screen flex items-center justify-center'>
       <div className='text-center'>
        <h1 className='text-orange-700 text-6xl'> 404 </h1>
        <p className='text-3xl'> Page not found </p>
              <Link to={'/'}>
              <button className='btn bg-orange-700 text-white text-lg p-2 rounded m-3'>
               Back to Home Page
              </button>
              </Link>
      </div>
    </div>
  )
}

export default ErrorPage