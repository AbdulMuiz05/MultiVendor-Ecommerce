import React from "react";
import { Link } from "react-router-dom";

const Categories = ({ categories = [] }) => {
  return (
    <section className="w-full py-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Explore
        </p>

        <h2 className="mt-1 font-poppins text-2xl font-bold text-secondary">
          Categories
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category._id || category.name}
            to={`/products?category=${encodeURIComponent(
              category.name || category
            )}`}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white text-center shadow-card transition hover:-translate-y-1"
          >
            {category.image && (
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img
                  src={category.image}
                  alt={category.name || "Category"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold text-secondary group-hover:text-primary">
                {category.name || category}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;