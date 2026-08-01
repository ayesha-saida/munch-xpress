import { useState } from "react";
import onboardingData from "./OnboardingData";

export default function OnboardingCarousel() {
  const [current, setCurrent] = useState(0);

  const slide = onboardingData[current];

  const nextSlide = () => {
    if (current < onboardingData.length - 1) {
      setCurrent(current + 1);
    } else {
      console.log("Navigate to Login");
    }
  };

  return (
    <section className="hero min-h-screen bg-base-200 pt-16 lg:pt-24">

      <div className="hero-content flex-col lg:flex-row w-full">

        {/* Image */}

        <img
          src={slide.image}
          alt={slide.title}
          className="lg:w-1/2 rounded-3xl object-cover h-[600px]"
        />

        {/* Card */}

        <div className="card bg-base-100 shadow-xl lg:w-1/2">

          <div className="card-body">

            {/* Dots */}

            <div className="flex gap-2 mb-5">

              {onboardingData.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300
                  ${
                    current === index
                      ? "w-8 bg-warning"
                      : "w-2 bg-gray-300"
                  }`}
                />
              ))}

            </div>

            <h1 className="text-5xl font-bold">
              {slide.title}
            </h1>

            <p className="py-6">
              {slide.description}
            </p>

            <button
              className="btn btn-warning"
              onClick={nextSlide}
            >
              {slide.button}
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}