import React from "react";
import SectionTitle from "../Layout/SectionTitle";
import ProductGrid from "./ProductGrid";

const RelatedProducts = ({ products = [] }) => {
  if (!products.length) return null;

  return (
    <section className="mt-16">
      <SectionTitle
        title="You May Also Like"
        subtitle="Explore more products you might be interested in."
      />

      <ProductGrid products={products} />
    </section>
  );
};

export default RelatedProducts;