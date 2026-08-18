import React from 'react'
import sushi from '../../assets/various food/sushi.jpg'
import pizza from '../../assets/various food/Cheese Corn Pizza.jpg'
import burger from '../../assets/various food/burger.jpg'
import salad from '../../assets/various food/salad.jpg'

const cuisines = [
  {
    title: "Sushi",
    image: sushi,
  },
  {
    title: "Italian Gourmet",
    image: pizza,    
  },
  {
    title: "Craft Burgers",
    image: burger,
  },
  {
    title: "Artisan Salads",
    image: salad,
  },
];

export default function TrendingCuisines() {
  return (
     <section className="mx-auto w-[calc(100%-72px)] max-w-240 py-6 font-sans">
      
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-[-0.4px] text-gray-900 sm:text-3xl">
            Trending Cuisines
          </h2>

          <p className="mt-1 text-sm text-gray-500 sm:text-lg">
            Selected based on this week's favorites
          </p>
        </div>

        <button
          type="button"
          className="w-fit border-0 bg-transparent p-0 text-sm text-orange-600 hover:underline sm:pt-1 sm:text-lg"
        >
          View all categories
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_1fr]">
        
        {/* Sushi */}
        <div className="relative row-span-2 h-100 overflow-hidden rounded-[20px]">
          <img
            src={cuisines[0].image}
            alt="Sushi"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-[13px] bg-white/90 px-4.5 py-2.5 shadow-md backdrop-blur-md">
            <span className="text-orange-700">
              {cuisines[0].icon}
            </span>

            <div>
              <p className="text-sm font-medium text-gray-700">
                Sushi
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="grid grid-rows-[190px_190px] gap-5">
          
          {/* Italian */}
          <div className="relative overflow-hidden rounded-[20px]">
            <img
              src={cuisines[1].image}
              alt="Italian Gourmet"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

            <div className="absolute bottom-3.25 left-3.5 flex items-center gap-2 rounded-xl bg-white/90 px-3.5 py-2 shadow-md backdrop-blur-md">
              <span className="text-orange-700">
                {cuisines[1].icon}
              </span>

              <p className="text-sm font-medium text-gray-700">
                Italian Gourmet
              </p>
            </div>
          </div>

          {/* Burger + Salad */}
          <div className="grid grid-cols-2 gap-5">
            
            {/* Burger */}
            <div className="relative overflow-hidden rounded-[20px]">
              <img
                src={cuisines[2].image}
                alt="Craft Burgers"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

              <div className="absolute bottom-3.25 left-3.25 rounded-xl bg-white/90 px-3.5 py-2 shadow-md backdrop-blur-md">
                <p className="text-sm font-medium text-gray-700">
                  Craft Burgers
                </p>
              </div>
            </div>

            {/* Salad */}
            <div className="relative overflow-hidden rounded-[20px]">
              <img
                src={cuisines[3].image}
                alt="Artisan Salads"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

              <div className="absolute bottom-3.25 left-3.25 rounded-xl bg-white/90 px-3.5 py-2 shadow-md backdrop-blur-md">
                <p className="text-sm font-medium text-gray-700">
                  Artisan Salads
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>


    </section>
  );
}

