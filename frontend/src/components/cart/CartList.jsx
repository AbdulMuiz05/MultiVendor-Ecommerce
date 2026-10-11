import React from "react";
import CartItem from "./CartItem";

const CartList = ({ items = [], onQuantityChange, onRemove }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <CartItem
          key={item._id || item.id || index}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CartList;