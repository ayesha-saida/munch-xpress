import React from 'react'
import backgroundImage from '../assets/bg_food_img.jpg'
import { IoMdSearch } from 'react-icons/io'

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-64px)] overflow-hidden">

      {/* Background image */}
      <img
        src={backgroundImage}
        alt="background image for hero section"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/55"></div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-64px)] 
      w-full max-w-7xl items-center px-5 py-10 sm:px-8 md:px-10 lg:px-12">

        <div className="w-full max-w-162.5">

          {/* Heading */}
          <h1 className="max-w-162.5 text-4xl font-bold
            leading-[1.05]  tracking-tight text-gray-900
            sm:text-5xl md:text-6xl lg:text-7xl">

            Craving something{' '}

            <span className="text-orange-700"> delicious?  </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-140 text-base 
           leading-6 text-gray-800 sm:text-lg 
           sm:leading-7 md:text-xl md:leading-8">
            Order from your favorite local restaurants and get it
            delivered fast with MunchXpress.
          </p>

          {/* Search / Explore */}
          <div className="mt-7 w-full max-w-140
            rounded-2xl bg-white p-2
            shadow-xl sm:mt-8 sm:p-3">

            <div className="flex flex-col gap-2 sm:flex-row">

              {/* Search input */}
              <label
                className="flex h-14 min-w-0 flex-1 items-center gap-3 
                rounded-xl px-3 text-gray-500 sm:px-4">
                <IoMdSearch
                  className="h-6 w-6 shrink-0
                   text-orange-700" />

                <input
                  type="search"
                  placeholder="Find what you desire"
                  className="min-w-0 w-full bg-transparent text-sm
                  text-gray-800 outline-none sm:text-base "/>

              </label>

              {/* Explore button */}
              <button
                type="button"
                className="h-14 w-full shrink-0 rounded-xl bg-orange-700
                  px-8 font-semibold text-white transition hover:bg-orange-800
                  sm:w-auto sm:px-10">   Explore
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
