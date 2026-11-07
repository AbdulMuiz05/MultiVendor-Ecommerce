import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronRight,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiMessageCircle,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";

import UserMenu from "./UserMenu";
import { notify } from "../UI/Toaster";
import { logoutUser } from "../../redux/actions/user";

const navLinks = [
  { name: "Home", path: "/", end: true },
  { name: "Best Selling", path: "/best-selling" },
  { name: "Products", path: "/products" },
  { name: "Events", path: "/events" },
  { name: "FAQ", path: "/faq" },
];

const AccountBadge = ({ count }) => {
  if (!count) return null;

  return (
    <span className="badge-count">{count > 99 ? "99+" : count}</span>
  );
};

export default function SiteHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { isAuthenticated, authChecked, user } = useSelector(
    (state) => state.user
  );
  const cartCount = useSelector((state) =>
    state.cart.cart.reduce(
      (total, item) => total + Number(item.qty || 1),
      0
    )
  );
  const wishlistCount = useSelector(
    (state) => state.wishlist.wishlist.length
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/products") {
      setQuery(new URLSearchParams(search).get("q") || "");
    }
  }, [pathname, search]);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    navigate(
      value ? `/products?q=${encodeURIComponent(value)}` : "/products"
    );
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const done = await dispatch(logoutUser());
    setLoggingOut(false);

    if (done) {
      setMenuOpen(false);
      notify("You have been signed out.", "info");
      navigate("/", { replace: true });
    } else {
      notify("Logout failed. Please try again.", "error");
    }
  };

  const searchField = (id) => (
    <form onSubmit={submitSearch} className="w-full">
      <div className="flex w-full items-center rounded-xl border border-gray-200 bg-gray-50 px-3.5 transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
        <FiSearch className="shrink-0 text-gray-400" size={18} />

        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, categories, sellers..."
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
          aria-label="Search products"
        />
      </div>
    </form>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="hidden border-b border-gray-100 bg-secondary text-white sm:block">
        <div className="container-app flex h-9 items-center justify-between text-xs">
          <p className="text-gray-300">
            A multi-vendor marketplace for products, offers and trusted
            sellers.
          </p>

          <div className="flex items-center gap-5 font-medium">
            <Link
              to="/shop-create"
              className="text-gray-300 transition hover:text-white"
            >
              Become a seller
            </Link>

            <Link
              to="/shop-login"
              className="text-gray-300 transition hover:text-white"
            >
              Seller login
            </Link>
          </div>
        </div>
      </div>

      <div className="container-app">
        <div className="flex h-16 items-center gap-3 lg:h-20">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-xl p-2.5 text-secondary transition hover:bg-gray-50 lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <FiMenu size={22} />
          </button>

          <Link
            to="/"
            className="shrink-0 font-poppins text-2xl font-extrabold tracking-tight text-secondary"
          >
            Eshop<span className="text-primary">.</span>
          </Link>

          <nav
            className="ml-6 hidden items-center gap-7 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-semibold transition ${
                    isActive
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}

                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden max-w-md flex-1 justify-end md:flex">
            {searchField("desktop-search")}
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <Link
              to="/wishlist"
              className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-primary/5 hover:text-primary"
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <FiHeart size={21} />
              <AccountBadge count={wishlistCount} />
            </Link>

            <Link
              to="/cart"
              className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-primary/5 hover:text-primary"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <FiShoppingCart size={21} />
              <AccountBadge count={cartCount} />
            </Link>

            <div className="ml-1 flex items-center">
              {!authChecked ? (
                <span
                  className="h-10 w-10 animate-pulse rounded-full bg-gray-100"
                  aria-hidden="true"
                />
              ) : isAuthenticated && user ? (
                <UserMenu />
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    to="/login"
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition hover:text-primary"
                  >
                    Login
                  </Link>

                  <Link
                    to="/sign-up"
                    className="hidden rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:inline-flex"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pb-3 md:hidden">
          {searchField("mobile-search")}
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 flex w-[min(320px,85vw)] flex-col bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <Link
                to="/"
                className="font-poppins text-xl font-extrabold text-secondary"
              >
                Eshop<span className="text-primary">.</span>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl p-2 text-gray-500 hover:bg-gray-50"
                aria-label="Close menu"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <nav className="space-y-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-primary/5 text-primary"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    {link.name}
                    <FiChevronRight size={16} className="text-gray-400" />
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6 border-t border-gray-100 pt-5">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {(user.name || "U")[0].toUpperCase()}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-secondary">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1">
                      {[
                        ["My Profile", "/profile", FiUser],
                        ["My Orders", "/orders", FiPackage],
                        ["Wishlist", "/wishlist", FiHeart],
                        ["Messages", "/inbox", FiMessageCircle],
                      ].map(([label, to, Icon]) => (
                        <Link
                          key={to}
                          to={to}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          <Icon size={17} />
                          {label}
                        </Link>
                      ))}

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        <FiLogOut size={17} />
                        {loggingOut ? "Signing out..." : "Logout"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-secondary"
                    >
                      Login
                    </Link>

                    <Link
                      to="/sign-up"
                      className="flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="px-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Sell on Eshop
                </p>

                <div className="mt-2 space-y-1">
                  <Link
                    to="/shop-create"
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Become a seller
                  </Link>

                  <Link
                    to="/shop-login"
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Seller login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
