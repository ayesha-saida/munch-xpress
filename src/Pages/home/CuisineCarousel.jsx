import React, { useRef } from "react";

import pizza from '../../assets/various food/Melting Cheese Pizza.jpg'
import burger from '../../assets/various food/burger 2.jpg'
import biriyani from '../../assets/various food/Chicken Biryani.jpg'
import cakes from '../../assets/dessert/1008102697847658829.jpg'
import fast_food from '../../assets/various food/fast_food.jpg'
import momos from '../../assets/momo/Dumpling momos with sauce.jpg'
import shawarma from '../../assets/shorma/Beef & Cheese Wrap.jpg'

const cuisines = [
  { name: "Pizza", image: pizza },
  { name: "Biryani", image: biriyani },
  { name: "Burgers", image: burger },
  { name: "Dessert", image: cakes },
  { name: "Fast Food", image: fast_food },
  { name: "Momos", image: momos },
  { name: "Shawarma", image: shawarma },
];

const CuisineCarousel = () => {
  const carouselRef = useRef(null);

  const scrollNext = () => {
    carouselRef.current?.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden bg-base-200 py-8 md:py-10">

      {/* Heading */}
      <h2
        className="
          mb-7 px-5 text-lg
          sm:text-2xl font-medium leading-tight
          md:mb-11
          md:px-[4.5%]
          md:text-5xl">
       Select your cuisines
      </h2>

      {/* Carousel */}
      <div className="relative w-full">

        {/* Cuisine cards */}
        <div
          ref={carouselRef}
          className="
            flex
            gap-5
            overflow-x-auto
            px-5 pb-3

            scroll-smooth
            touch-pan-x

            [scrollbar-none]
            [&::-webkit-scrollbar]:hidden

            md:gap-12
            md:px-[5%]
          "
        >
          {cuisines.map((cuisine) => (
            <div
              key={cuisine.name}
              className="
                w-27.5
                shrink-0
                cursor-pointer
                text-center

                md:w-36
              "
            >
              {/* Image */}
              <div
                className="
                  h-27.5 w-27.5
                  overflow-hidden
                  rounded-[10px]
                  bg-gray-100

                  md:h-36
                  md:w-36
                  md:rounded-xl
                "
              >
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-300
                    hover:scale-105
                  "
                />
              </div>

              {/* Name */}
              <h3
                className="
                  mt-2
                  text-base
                  font-medium
                  text-orange-700

                  md:mt-4
                  md:text-[21px]
                "
              >
                {cuisine.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CuisineCarousel;