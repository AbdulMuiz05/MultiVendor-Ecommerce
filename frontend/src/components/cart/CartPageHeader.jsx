import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";

const CartPageHeader = ({ itemCount = 0 }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Link
          to="/products"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-primary"
        >
          <FiArrowLeft size={16} />
          Continue Shopping
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FiShoppingCart size={22} />
          </div>

          <div>
            <h1 className="font-poppins text-3xl font-extrabold text-secondary">
              Shopping Cart
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageHeader;