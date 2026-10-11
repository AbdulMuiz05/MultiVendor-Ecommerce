import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector = ({
  quantity = 1,
  min = 1,
  max,
  onChange,
}) => {
  const decrease = () => {
    onChange?.(Math.max(min, quantity - 1));
  };

  const increase = () => {
    const nextQuantity = quantity + 1;

    if (max !== undefined && nextQuantity > max) {
      return;
    }

    onChange?.(nextQuantity);
  };

  return (
    <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= min}
        className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <FiMinus size={16} />
      </button>

      <span className="min-w-10 text-center text-sm font-semibold text-secondary">
        {quantity}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={max !== undefined && quantity >= max}
        className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <FiPlus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;