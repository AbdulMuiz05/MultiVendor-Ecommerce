import React from "react";

const AuthButton = ({
  children,
  type = "submit",
  loading = false,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default AuthButton;