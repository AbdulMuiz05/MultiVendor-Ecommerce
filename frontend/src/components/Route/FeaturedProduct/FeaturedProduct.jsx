import React from "react";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = ({ products = [] }) => {
  const featured = products.filter(
    (product) => product.featured === true || product.isFeatured === true
  );

  const items = featured.length ? featured : products.slice(0, 8);

  return (
    <section className="w-full py-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Our Selection
        </p>

        <h2 className="mt-1 font-poppins text-2xl font-bold text-secondary">
          Featured Products
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProduct;