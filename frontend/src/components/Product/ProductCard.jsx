import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";

import { addToCart } from "../../redux/actions/cart";
import {
  removeFromWishlist,
  toggleWishlist,
} from "../../redux/actions/wishlist";
import {
  discountPercent,
  imageUrl,
  money,
  productPrice,
} from "../../utils/format";
import { notify } from "../UI/Toaster";

export default function ProductCard({
  product,
  rank,
  showRemove = false,
  className = "",
}) {
  const dispatch = useDispatch();
  const wished = useSelector((state) =>
    state.wishlist.wishlist.some((item) => item._id === product._id)
  );

  const price = productPrice(product);
  const original = Number(product.originalPrice);
  const discount = discountPercent(product);
  const stock = Number(product.stock);
  const outOfStock = Number.isFinite(stock) && stock <= 0;
  const rating = Number(product.ratings || 0);
  const reviewCount = product.reviews?.length || 0;
  const shopName = product.shop?.name;

  const handleWishlist = () => {
    const added = dispatch(toggleWishlist(product));
    notify(
      added ? "Saved to your wishlist." : "Removed from your wishlist.",
      added ? "success" : "info"
    );
  };

  const handleRemove = () => {
    dispatch(removeFromWishlist(product._id));
    notify("Removed from your wishlist.", "info");
  };

  const handleAdd = () => {
    if (outOfStock) return;

    dispatch(addToCart({ ...product, qty: 1 }));
    notify(`${product.name} added to cart.`);
  };

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link to={`/product/${product._id}`} aria-label={product.name}>
          <img
            src={imageUrl(product.images?.[0])}
            alt={product.name || "Product"}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] ${
              outOfStock ? "opacity-60" : ""
            }`}
          />
        </Link>

        {rank && (
          <span className="absolute left-3 top-3 rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            #{rank}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute bottom-3 left-3 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {outOfStock && (
          <span className="absolute inset-x-3 bottom-3 rounded-lg bg-secondary/90 py-2 text-center text-xs font-bold text-white">
            Out of stock
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition ${
            wished
              ? "bg-primary text-white"
              : "bg-white/95 text-gray-500 hover:text-primary"
          }`}
        >
          <FiHeart
            size={17}
            fill={wished ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-bold uppercase tracking-wider text-primary">
            {product.category || "Product"}
          </span>

          {rating > 0 ? (
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-500">
              <FiStar
                size={13}
                className="text-amber-400"
                fill="currentColor"
              />
              {rating.toFixed(1)}
              <span className="font-normal text-gray-400">
                ({reviewCount})
              </span>
            </span>
          ) : (
            <span className="text-[11px] font-medium text-gray-400">
              New arrival
            </span>
          )}
        </div>

        <Link to={`/product/${product._id}`} className="mt-2">
          <h3 className="line-clamp-2 font-poppins text-sm font-bold leading-6 text-secondary transition group-hover:text-primary sm:text-base">
            {product.name}
          </h3>
        </Link>

        {shopName && (
          <Link
            to={`/shop/${product.shopId}`}
            className="mt-1.5 truncate text-xs text-gray-400 transition hover:text-primary"
          >
            {shopName}
          </Link>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="font-poppins text-lg font-extrabold text-secondary">
                {money(price)}
              </p>

              {original > price && (
                <p className="text-xs text-gray-400 line-through">
                  {money(original)}
                </p>
              )}
            </div>

            {!outOfStock && stock > 0 && stock <= 5 && (
              <span className="text-[11px] font-semibold text-amber-600">
                Only {stock} left
              </span>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={outOfStock}
              onClick={handleAdd}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiShoppingCart size={15} />
              Add to cart
            </button>

            {showRemove && (
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
