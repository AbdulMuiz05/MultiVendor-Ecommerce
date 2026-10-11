import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const price = Number(product.discountPrice || 0);
  const originalPrice = Number(product.originalPrice || 0);

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0]}
            alt={product.name || "Product"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 rounded-full bg-white p-2.5 text-gray-600 shadow-md hover:text-primary"
        >
          <FiHeart size={18} />
        </button>

        <button
          type="button"
          aria-label="Add to cart"
          className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-primary text-white opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100"
        >
          <FiShoppingCart size={18} />
        </button>
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          {product.category || "Product"}
        </p>

        <Link to={`/product/${product._id}`}>
          <h3 className="line-clamp-2 min-h-[48px] font-poppins text-base font-semibold text-secondary hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-1.5">
          <FiStar className="fill-current text-amber-400" size={15} />

          <span className="text-sm font-semibold text-gray-700">
            {Number(product.ratings || 0).toFixed(1)}
          </span>

          <span className="text-xs text-gray-400">
            ({product.reviews?.length || 0})
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="font-poppins text-lg font-bold text-primary">
            ${price.toFixed(2)}
          </span>

          {originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;