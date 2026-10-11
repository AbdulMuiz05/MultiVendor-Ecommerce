import React from "react";
import { FiHeart } from "react-icons/fi";

const WishlistHeader = ({ itemCount = 0 }) => {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FiHeart size={23} className="fill-current" />
      </div>

      <div>
        <h1 className="font-poppins text-3xl font-extrabold text-secondary">
          My Wishlist
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {itemCount} {itemCount === 1 ? "product" : "products"} saved
        </p>
      </div>
    </div>
  );
};

export default WishlistHeader;
