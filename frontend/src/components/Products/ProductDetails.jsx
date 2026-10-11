import React from "react";
import { FiHeart, FiMinus, FiPlus, FiShoppingCart, FiTruck } from "react-icons/fi";
import RatingStars from "./RatingStars";

const ProductDetails = ({
  product,
  quantity = 1,
  onQuantityChange,
  onAddToCart,
  onWishlist,
}) => {
  if (!product) return null;

  const price = Number(product.discountPrice || 0);
  const originalPrice = Number(product.originalPrice || 0);
  const stock = Number(product.stock || 0);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card">
        <div className="aspect-square bg-gray-50">
          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/800x800?text=Product"
            }
            alt={product.name || "Product"}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          {product.category || "Product"}
        </p>

        <h1 className="mt-3 font-poppins text-3xl font-extrabold leading-tight text-secondary sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-5">
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

        <p className="mt-6 leading-7 text-gray-600">
          {product.description || "No description available for this product."}
        </p>

        <div className="mt-6 flex items-center gap-2 text-sm">
          <span className="font-semibold text-secondary">Availability:</span>

          <span className={stock > 0 ? "text-emerald-600" : "text-red-500"}>
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() =>
                onQuantityChange?.(Math.max(1, quantity - 1))
              }
              disabled={quantity <= 1}
              className="p-3 text-gray-600 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiMinus size={17} />
            </button>

            <span className="min-w-10 text-center text-sm font-bold text-secondary">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                onQuantityChange?.(Math.min(stock || quantity + 1, quantity + 1))
              }
              disabled={stock > 0 && quantity >= stock}
              className="p-3 text-gray-600 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiPlus size={17} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(product, quantity)}
            disabled={stock <= 0}
            className="btn-primary flex-1 gap-2 sm:flex-none"
          >
            <FiShoppingCart size={19} />
            Add to Cart
          </button>

          <button
            type="button"
            onClick={() => onWishlist?.(product)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-primary hover:text-primary"
            aria-label="Add to wishlist"
          >
            <FiHeart size={20} />
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <FiTruck className="text-primary" size={22} />
            <div>
              <p className="text-sm font-semibold text-secondary">
                Fast Delivery
              </p>
              <p className="text-xs text-gray-500">
                Reliable delivery to your doorstep
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-secondary">
              Secure Shopping
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Safe and trusted checkout experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;