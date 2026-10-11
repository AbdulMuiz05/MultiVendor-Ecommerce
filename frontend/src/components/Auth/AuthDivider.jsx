import React from "react";

const AuthDivider = ({ text = "OR" }) => {
  return (
    <div className="my-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-gray-200" />

      <span className="text-xs font-semibold tracking-wider text-gray-400">
        {text}
      </span>

      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
};

export default AuthDivider;