import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({ value = "", onChange, onClear, placeholder = "Search products..." }) => {
  return (
    <div className="flex w-full items-center rounded-2xl border border-gray-200 bg-white px-4 shadow-sm transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
      <FiSearch size={20} className="shrink-0 text-gray-400" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-secondary outline-none placeholder:text-gray-400"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-secondary"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;