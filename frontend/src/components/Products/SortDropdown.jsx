import React from "react";
import { FiChevronDown } from "react-icons/fi";

const SortDropdown = ({ value = "latest", onChange }) => {
  const options = [
    { value: "latest", label: "Latest Products" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  return (
    <div className="relative min-w-[190px]">
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="input-field appearance-none pr-10 font-medium"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <FiChevronDown
        size={18}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
};

export default SortDropdown;