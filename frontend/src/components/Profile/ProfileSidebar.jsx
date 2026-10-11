import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileSidebar = () => {
  const { user } = useSelector((state) => state.user);

  const links = [
    { name: "Profile", path: "/profile" },
    { name: "Orders", path: "/orders" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Track Order", path: "/track-order" },
    { name: "Inbox", path: "/inbox" },
  ];

  return (
    <aside className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-card lg:w-72">
      <div className="border-b border-gray-100 pb-5 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>

        <h2 className="mt-3 font-poppins text-lg font-bold text-secondary">
          {user?.name || "User"}
        </h2>

        <p className="mt-1 break-all text-sm text-gray-500">
          {user?.email || ""}
        </p>
      </div>

      <nav className="mt-5 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-primary/10 hover:text-primary"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default ProfileSidebar;