import React from "react";
import { Link } from "react-router-dom";

const Hero = ({
  title = "Discover Products You’ll Love",
  description = "Shop quality products from trusted sellers at great prices.",
  image,
}) => {
  return (
    <section className="overflow-hidden rounded-3xl bg-secondary">
      <div className="grid min-h-[420px] items-center lg:grid-cols-2">
        <div className="px-6 py-12 sm:px-10 lg:px-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Welcome to Eshop
          </p>

          <h1 className="mt-4 font-poppins text-4xl font-bold leading-tight text-white sm:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-lg text-gray-300">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Shop Now
            </Link>

            <Link
              to="/best-selling"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Best Selling
            </Link>
          </div>
        </div>

        <div className="h-full min-h-[300px] bg-gray-900">
          {image && (
            <img
              src={image}
              alt="Eshop"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;