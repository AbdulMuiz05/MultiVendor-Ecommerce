import React, { useState } from "react";

const DropDown = ({ title = "Options", items = [], onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        {title}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {items.map((item, index) => (
            <button
              key={item.value ?? item.id ?? index}
              type="button"
              onClick={() => {
                onSelect?.(item);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.label ?? item.name ?? item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;