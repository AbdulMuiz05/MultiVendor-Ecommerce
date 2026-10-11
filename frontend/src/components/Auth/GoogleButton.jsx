import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleButton = ({ onClick, loading = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-secondary transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FcGoogle size={20} />
      {loading ? "Connecting..." : "Continue with Google"}
    </button>
  );
};

export default GoogleButton;