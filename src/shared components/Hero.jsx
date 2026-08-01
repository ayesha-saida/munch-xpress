import React from 'react'

export default function Hero() {
  return (
    <section className="hero min-h-screen">
      <div className="hero-overlay bg-black/30"></div>

      <div className="hero-content text-neutral-content">
        <div className="max-w-md bg-white text-black rounded-3xl p-8 shadow-xl">
          <h1 className="text-5xl font-bold">
            Swift <span className="text-orange-500">Delivery</span>
          </h1>

          <p className="py-6">
            Your favorite meals delivered fresh and hot to your doorstep in
            record time.
          </p>

          <button className="btn btn-warning w-full">
            Next
          </button>

          <p className="text-center mt-4">
            Already have an account?
            <span className="font-bold"> Log in</span>
          </p>
        </div>
      </div>
    </section>
  );
}
