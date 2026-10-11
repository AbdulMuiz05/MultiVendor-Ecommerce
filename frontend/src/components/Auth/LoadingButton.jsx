import React from "react";

const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  type = "submit",
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;