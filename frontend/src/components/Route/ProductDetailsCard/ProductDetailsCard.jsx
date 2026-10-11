import React from "react";
import { Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";

const ProductDetailsCard = ({ product }) => {
  if (!product) return null;

  const price = Number(product.discountPrice || 0);
  const originalPrice = Number(product.originalPrice || 0);

  return (
    <div className="grid gap-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-card md:grid-cols-2">
      <div className="overflow-hidden rounded-2xl bg-gray-50">
        <img
          src={product.images?.[0]}
          alt={product.name || "Product"}
          className="aspect-square h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          {product.category || "Product"}
        </p>

        <h1 className="mt-2 font-poppins text-3xl font-bold text-secondary">
          {product.name}
        </h1>

        <div className="mt-4 flex items-center gap-2">
          <FiStar className="fill-current text-amber-400" />
          <span className="font-semibold">
            {Number(product.ratings || 0).toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">
            ({product.reviews?.length || 0} reviews)
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>

          {originalPrice > price && (
            <span className="text-lg text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {product.description && (
          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>
        )}

        <div className="mt-8 flex gap-3">
          <Link
            to={`/product/${product._id}`}
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:opacity-90"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;