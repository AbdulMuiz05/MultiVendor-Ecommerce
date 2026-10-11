import React from "react";

const CategoryFilter = ({ categories = [], selectedCategory, onChange }) => {
  return (
    <div>
      <h3 className="font-poppins text-base font-bold text-secondary">
        Categories
      </h3>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={() => onChange?.("")}
          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
            !selectedCategory
              ? "bg-primary/10 text-primary"
              : "text-gray-600 hover:bg-gray-50 hover:text-secondary"
          }`}
        >
          <span>All Products</span>
        </button>

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange?.(category)}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
              selectedCategory === category
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-50 hover:text-secondary"
            }`}
          >
            <span>{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;