import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <FiShoppingCart size={34} />
      </div>

      <h2 className="mt-6 font-poppins text-2xl font-bold text-secondary">
        Your cart is empty
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        Looks like you haven't added anything to your cart yet. Explore our
        products and find something you love.
      </p>

      <Link to="/products" className="btn-primary mt-7">
        Start Shopping
      </Link>
    </div>
  );
};

export default CartEmpty;