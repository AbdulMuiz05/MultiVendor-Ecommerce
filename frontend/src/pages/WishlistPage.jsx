import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowRight, FiHeart } from "react-icons/fi";

import ProductCard from "../components/Product/ProductCard";
import { Empty, Shell } from "./_pageUtils";
import { removeFromWishlist } from "../redux/actions/wishlist";
import { notify } from "../components/UI/Toaster";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.wishlist);

  const clearWishlist = () => {
    items.forEach((item) => dispatch(removeFromWishlist(item._id)));
    notify("Wishlist cleared.", "info");
  };

  return (
    <Shell
      title="Wishlist"
      subtitle={
        items.length
          ? `${items.length} saved product${items.length === 1 ? "" : "s"}.`
          : "Save products you love and come back to them later."
      }
    >
      {!items.length ? (
        <Empty
          title="Your wishlist is empty"
          text="Tap the heart on any product to save it for later."
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Discover products
            <FiArrowRight />
          </Link>
        </Empty>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <FiHeart className="text-primary" />
              Saved items stay on this device.
            </p>

            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs font-semibold text-gray-400 transition hover:text-red-600"
            >
              Clear wishlist
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {items.map((item) => (
              <ProductCard key={item._id} product={item} showRemove />
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}
