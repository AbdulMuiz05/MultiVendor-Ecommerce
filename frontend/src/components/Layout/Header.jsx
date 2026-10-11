import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="container-app">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="shrink-0">
            <span className="font-poppins text-2xl font-extrabold tracking-tight text-secondary">
              E<span className="text-primary">shop</span>
            </span>
          </Link>

          <div className="hidden max-w-xl flex-1 md:flex">
            <div className="flex w-full items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
              <FiSearch className="text-gray-400" size={19} />
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/products?q=${encodeURIComponent(query)}`);
                  }
                }}
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              to="/wishlist"
              className="rounded-xl p-3 text-gray-600 transition hover:bg-gray-50 hover:text-primary"
              aria-label="Wishlist"
            >
              <FiHeart size={21} />
            </Link>

            <Link
              to="/cart"
              className="rounded-xl p-3 text-gray-600 transition hover:bg-gray-50 hover:text-primary"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={21} />
            </Link>

            <Link
              to="/profile"
              className="rounded-xl p-3 text-gray-600 transition hover:bg-gray-50 hover:text-primary"
              aria-label="Profile"
            >
              <FiUser size={21} />
            </Link>
          </nav>
        </div>

        <div className="pb-3 md:hidden">
          <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
            <FiSearch className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/products?q=${encodeURIComponent(query)}`);
                }
              }}
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;