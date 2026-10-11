import React from "react";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = ({ onLogout, loading = false }) => {
  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FiLogOut size={18} />
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;