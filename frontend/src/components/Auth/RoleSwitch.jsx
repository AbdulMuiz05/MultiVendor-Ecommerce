import React from "react";

const RoleSwitch = ({ role = "user", onChange }) => {
  const roles = [
    { value: "user", label: "Customer" },
    { value: "seller", label: "Seller" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
      {roles.map((item) => {
        const active = role === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange?.(item.value)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              active
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-secondary"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default RoleSwitch;