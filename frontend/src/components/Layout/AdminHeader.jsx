import React from "react";
import { Link } from "react-router-dom";
import { MdAdminPanelSettings, MdLogout } from "react-icons/md";

const AdminHeader = ({ onLogout }) => {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/admin"
          className="flex items-center gap-2 text-xl font-semibold text-gray-800"
        >
          <MdAdminPanelSettings className="text-2xl text-blue-600" />
          <span>Admin Panel</span>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <MdLogout className="text-xl" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;