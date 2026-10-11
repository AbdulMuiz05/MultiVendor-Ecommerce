import React from "react";
import { FiPackage, FiShield, FiTruck } from "react-icons/fi";
import RatingStars from "./RatingStars";

const ProductInfo = ({ product }) => {
  if (!product) return null;

  const price = Number(product.discountPrice || 0);
  const originalPrice = Number(product.originalPrice || 0);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        {product.category || "Product"}
      </p>

      <h1 className="mt-3 font-poppins text-3xl font-extrabold leading-tight text-secondary sm:text-4xl">
        {product.name}
      </h1>

      <div className="mt-4">
        <RatingStars rating={product.ratings} />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="font-poppins text-3xl font-extrabold text-primary">
          ${price.toFixed(2)}
        </span>

        {originalPrice > price && (
          <span className="text-lg text-gray-400 line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      <p className="mt-6 text-sm leading-7 text-gray-600">
        {product.description || "No description available."}
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 p-4">
          <FiTruck className="text-primary" size={21} />
          <p className="mt-3 text-sm font-semibold text-secondary">
            Fast Delivery
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Quick doorstep delivery
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <FiShield className="text-primary" size={21} />
          <p className="mt-3 text-sm font-semibold text-secondary">
            Secure Payment
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Safe checkout experience
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <FiPackage className="text-primary" size={21} />
          <p className="mt-3 text-sm font-semibold text-secondary">
            Quality Product
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Trusted marketplace sellers
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;