import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category, image, count }) => {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category)}`}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={category}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h3 className="font-poppins text-lg font-bold">{category}</h3>

          {count !== undefined && (
            <p className="mt-1 text-xs text-white/80">
              {count} {count === 1 ? "product" : "products"}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;