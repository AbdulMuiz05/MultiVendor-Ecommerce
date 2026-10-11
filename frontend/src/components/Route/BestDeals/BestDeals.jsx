import React from "react";
import { Link } from "react-router-dom";

const BestDeals = ({ products = [] }) => {
  const deals = products
    .filter(
      (product) =>
        Number(product.originalPrice || 0) >
        Number(product.discountPrice || 0)
    )
    .slice(0, 4);

  return (
    <section className="w-full py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Special Offers
          </p>
          <h2 className="mt-1 font-poppins text-2xl font-bold text-secondary">
            Best Deals
          </h2>
        </div>

        <Link
          to="/products"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {deals.map((product) => {
          const price = Number(product.discountPrice || 0);
          const original = Number(product.originalPrice || 0);
          const discount =
            original > price
              ? Math.round(((original - price) / original) * 100)
              : 0;

          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.images?.[0]}
                  alt={product.name || "Product"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {discount > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                    -{discount}%
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="line-clamp-2 font-semibold text-secondary">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center gap-2">
                  <span className="font-bold text-primary">
                    ${price.toFixed(2)}
                  </span>

                  <span className="text-sm text-gray-400 line-through">
                    ${original.toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default BestDeals;