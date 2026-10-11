import React from "react";
import { Link } from "react-router-dom";

const Sponsored = ({ products = [] }) => {
  const sponsoredProducts = products
    .filter(
      (product) =>
        product.sponsored === true || product.isSponsored === true
    )
    .slice(0, 4);

  if (!sponsoredProducts.length) {
    return null;
  }

  return (
    <section className="w-full py-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Featured Sellers
        </p>

        <h2 className="mt-1 font-poppins text-2xl font-bold text-secondary">
          Sponsored Products
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sponsoredProducts.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition hover:-translate-y-1"
          >
            <div className="aspect-square overflow-hidden bg-gray-50">
              <img
                src={product.images?.[0]}
                alt={product.name || "Product"}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="p-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                Sponsored
              </span>

              <h3 className="mt-2 line-clamp-2 font-semibold text-secondary">
                {product.name}
              </h3>

              <p className="mt-2 font-bold text-primary">
                ${Number(product.discountPrice || 0).toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Sponsored;