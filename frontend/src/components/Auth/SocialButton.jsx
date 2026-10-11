import React from "react";

const SocialButton = ({ icon, children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-secondary transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
    >
      {icon}
      {children}
    </button>
  );
};

export default SocialButton;