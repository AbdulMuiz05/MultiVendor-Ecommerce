import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdEvent,
  MdShoppingCart,
  MdLocalOffer,
  MdReplay,
  MdAccountBalanceWallet,
  MdSettings,
  MdMessage,
  MdPreview,
} from "react-icons/md";

const DashboardSideBar = () => {
  const { id } = useParams();

  const links = [
    ["Dashboard", `/shop/${id}/dashboard`, <MdDashboard />],
    ["Products", `/shop/${id}/products`, <MdInventory />],
    ["Create Product", `/shop/${id}/create-product`, <MdInventory />],
    ["Events", `/shop/${id}/events`, <MdEvent />],
    ["Create Event", `/shop/${id}/create-event`, <MdEvent />],
    ["Orders", `/shop/${id}/orders`, <MdShoppingCart />],
    ["Coupons", `/shop/${id}/coupons`, <MdLocalOffer />],
    ["Refunds", `/shop/${id}/refunds`, <MdReplay />],
    ["Withdraw Money", `/shop/${id}/withdraw-money`, <MdAccountBalanceWallet />],
    ["Inbox", `/shop/${id}/inbox`, <MdMessage />],
    ["Preview Shop", `/shop/${id}/preview`, <MdPreview />],
    ["Settings", `/shop/${id}/settings`, <MdSettings />],
  ];

  return (
    <aside className="min-h-screen w-64 shrink-0 border-r bg-white">
      <div className="border-b px-5 py-5">
        <h2 className="text-lg font-bold text-gray-800">Seller Dashboard</h2>
      </div>

      <nav className="space-y-1 p-3">
        {links.map(([name, path, icon]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSideBar;