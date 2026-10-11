import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdStore,
  MdInventory,
  MdEvent,
  MdPayments,
  MdMenu,
} from "react-icons/md";

const AdminSideBar = () => {
  const links = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <MdDashboard />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <MdPeople />,
    },
    {
      name: "Sellers",
      path: "/admin/sellers",
      icon: <MdStore />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <MdInventory />,
    },
    {
      name: "Events",
      path: "/admin/events",
      icon: <MdEvent />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <MdPayments />,
    },
    {
      name: "Withdrawals",
      path: "/admin/withdraws",
      icon: <MdPayments />,
    },
  ];

  return (
    <aside className="w-full md:w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-200">
        <MdMenu className="text-2xl text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSideBar;