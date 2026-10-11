import React from "react";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

const WishlistEmpty = () => {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <FiHeart size={34} />
      </div>

      <h2 className="mt-6 font-poppins text-2xl font-bold text-secondary">
        Your wishlist is empty
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        Save products you love here and come back to them whenever you want.
      </p>

      <Link to="/products" className="btn-primary mt-7">
        Discover Products
      </Link>
    </div>
  );
};

export default WishlistEmpty;