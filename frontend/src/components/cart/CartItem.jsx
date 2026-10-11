import React from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  if (!item) return null;

  const price = Number(item.discountPrice || item.price || 0);
  const quantity = Number(item.qty || item.quantity || 1);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-card sm:flex-row sm:items-center">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">
        <img
          src={
            item.images?.[0] ||
            "https://via.placeholder.com/300x300?text=Product"
          }
          alt={item.name || "Product"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-poppins font-semibold text-secondary">
          {item.name || "Product"}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {item.category || "Product"}
        </p>

        <p className="mt-2 font-bold text-primary">
          ${price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() =>
              onQuantityChange?.(item, Math.max(1, quantity - 1))
            }
            disabled={quantity <= 1}
            className="p-2.5 text-gray-600 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiMinus size={16} />
          </button>

          <span className="min-w-9 text-center text-sm font-semibold text-secondary">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => onQuantityChange?.(item, quantity + 1)}
            className="p-2.5 text-gray-600 transition hover:text-primary"
          >
            <FiPlus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove?.(item)}
          className="rounded-xl p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          aria-label="Remove item"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;