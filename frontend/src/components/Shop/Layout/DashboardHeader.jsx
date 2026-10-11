import React from "react";
import { Link } from "react-router-dom";
import { MdMenu, MdNotifications, MdStore } from "react-icons/md";

const DashboardHeader = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <MdMenu size={24} />
      </button>

      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold text-blue-600"
      >
        <MdStore size={25} />
        Eshop
      </Link>

      <button
        type="button"
        className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
      >
        <MdNotifications size={23} />
      </button>
    </header>
  );
};

export default DashboardHeader;