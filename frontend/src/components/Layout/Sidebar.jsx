import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";

const Sidebar = ({ isOpen = false, onClose }) => {
  const location = useLocation();

  const links = [
    { label: "Home", path: "/", icon: FiGrid },
    { label: "Products", path: "/products", icon: FiShoppingBag },
    { label: "Wishlist", path: "/wishlist", icon: FiHeart },
    { label: "Profile", path: "/profile", icon: FiUser },
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-secondary/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-100 bg-white p-5 shadow-soft transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <span className="font-poppins text-xl font-extrabold text-secondary">
            E<span className="text-primary">shop</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-50"
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {links.map(({ label, path, icon: Icon }) => {
            const active =
              path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(path);

            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-secondary"
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;