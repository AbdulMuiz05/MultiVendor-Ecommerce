import React from "react";
import WishlistItem from "./WishlistItem";

const WishlistList = ({ products = [], onRemove, onAddToCart }) => {
  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <WishlistItem
          key={product._id || product.id || index}
          product={product}
          onRemove={onRemove}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default WishlistList;