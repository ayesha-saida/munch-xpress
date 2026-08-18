import React from "react";

import chicken from "../../assets/various food/chicken leg piece.jpg";
import steek from "../../assets/various food/Beef stack plater.jpg";
import kebab from "../../assets/various food/Grilled Beef Kebabs plater.jpg"

const specials = [
  {
    name: "L'Atelier Scallops",
    price: "$34",
    description:
      "Pan-seared Atlantic scallops with parsnip purée and truffle reduction.",
    image: chicken,
  },
  {
    name: "Black Truffle Pasta",
    price: "$42",
    description:
      "Handmade tagliatelle, cultured butter, and 24-month aged parmesan shavings.",
    image: steek,
  },
  {
    name: "Herb-Crusted Lamb",
    price: "$48",
    description:
      "New Zealand rack of lamb, mint-pea mash, and glazed baby carrots.",
    image: kebab,
  },
];

export default function ChefSpecial() {
  return (
    <section className="w-full bg-base-200 px-4 py-12
     sm:px-6 md:py-16 lg:px-8">
      
      {/* Header */}
      <div className="mx-auto mb-8 text-center sm:mb-10">
        <h2 className="mt-1 text-xl font-medium 
            tracking-[-0.3px] text-gray-900 sm:text-2xl">
          CUSTOMER FAVORITES
            </h2>

        <p className="text-sm font-medium uppercase
          tracking-[1.5px] text-orange-600">
          Most Loved Dishes
          </p>


      </div>

      {/* Cards */}
      <div className="mx-auto grid w-full max-w-240 
      grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {specials.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-[20px]
             bg-white shadow-[0_5px_20px_rgba(0,0,0,0.06)]
              transition duration-300 hover:-translate-y-1
               hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
          >
            {/* Image */}
            <div className="relative aspect-[1.55/1] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover
                 transition-transform duration-500 hover:scale-105"
              />

              {/* Star */}
              <div className="absolute right-3.5 top-3.5 flex 
                h-9 w-9 items-center justify-center rounded-full
               bg-white shadow-md">
                <span className="text-[18px] text-orange-600">★</span>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 pb-5 pt-5">
              
              {/* Title + Price */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[16px] font-medium leading-5 text-gray-900">
                  {item.name}
                </h3>

                <span className="shrink-0 text-[15px] font-semibold text-orange-700">
                  {item.price}
                </span>
              </div>

              {/* Description */}
              <p className="mt-2 min-h-12 text-[13px] 
              leading-4.75 text-gray-500">
                {item.description}
              </p>

              {/* Button */}
              <button
                type="button"
                className="mt-5 h-12 w-full rounded-xl
                 border border-orange-200 bg-white
                 text-sm font-medium text-gray-800 transition-colors
                  duration-200 hover:bg-orange-500  hover:text-white">
                Add to Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}