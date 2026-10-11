import React from "react";

const PriceRange = ({ min = 0, max = 1000, value = max, onChange }) => {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Price</span>
        <span className="font-semibold text-secondary">
          ${Number(value).toFixed(0)}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary"
      />

      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
};

export default PriceRange;