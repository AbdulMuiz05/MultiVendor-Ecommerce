import React from "react";

const RememberMe = ({ checked, onChange }) => {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 accent-primary"
      />

      <span>Remember me</span>
    </label>
  );
};

export default RememberMe;