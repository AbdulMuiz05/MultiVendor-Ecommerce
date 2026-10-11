import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";

const WishlistItem = ({ product, onRemove, onAddToCart }) => {
  if (!product) return null;

  const price = Number(product.discountPrice || 0);
  const originalPrice = Number(product.originalPrice || 0);

  return (
    <article className="group flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft sm:flex-row sm:items-center">
      <Link
        to={`/product/${product._id}`}
        className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-50"
      >
        <img
          src={
            product.images?.[0] ||
            "https://via.placeholder.com/300x300?text=Product"
          }
          alt={product.name || "Product"}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {product.category || "Product"}
        </p>

        <Link to={`/product/${product._id}`}>
          <h3 className="mt-1 line-clamp-2 font-poppins text-lg font-bold text-secondary transition hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-2">
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

      <div className="flex items-center gap-2 sm:shrink-0">
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <FiShoppingCart size={17} />
          <span className="hidden sm:inline">Add to Cart</span>
        </button>

        <button
          type="button"
          onClick={() => onRemove?.(product)}
          aria-label="Remove from wishlist"
          className="rounded-xl border border-gray-200 p-3 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
        >
          <FiTrash2 size={18} />
        </button>

        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
          <FiHeart size={18} className="fill-current" />
        </div>
      </div>
    </article>
  );
};

export default WishlistItem;