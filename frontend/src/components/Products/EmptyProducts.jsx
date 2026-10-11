import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

const EmptyProducts = ({ title = "No products found", message = "Try changing your search or filters." }) => {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <FiShoppingBag size={28} />
      </div>

      <h3 className="mt-5 font-poppins text-xl font-bold text-secondary">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {message}
      </p>

      <Link to="/products" className="btn-primary mt-6">
        Browse Products
      </Link>
    </div>
  );
};

export default EmptyProducts;