import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCompass, FiHome } from "react-icons/fi";

import { Shell } from "./_pageUtils";

export default function NotFoundPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-soft">
        <p className="font-poppins text-7xl font-extrabold text-primary">
          404
        </p>

        <h1 className="mt-4 font-poppins text-2xl font-extrabold text-secondary">
          This page could not be found
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          The link may be broken, or the page may have been moved. Let's get
          you back to shopping.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary"
          >
            <FiHome />
            Go home
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
          >
            <FiCompass />
            Browse products
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </Shell>
  );
}
