import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiExternalLink,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { api } from "../../utils/api";
import { initials } from "../../utils/format";

const adminLinks = [
  { label: "Overview", to: "/admin", end: true },
  { label: "Users", to: "/admin/users" },
  { label: "Sellers", to: "/admin/sellers" },
  { label: "Products", to: "/admin/products" },
  { label: "Events", to: "/admin/events" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Withdrawals", to: "/admin/withdraws" },
];

const sellerLinks = (sellerId) => [
  { label: "Dashboard", to: `/shop/${sellerId}/dashboard`, end: true },
  { label: "Products", to: `/shop/${sellerId}/products` },
  { label: "Orders", to: `/shop/${sellerId}/orders` },
  { label: "Events", to: `/shop/${sellerId}/events` },
  { label: "Coupons", to: `/shop/${sellerId}/coupons` },
  { label: "Refunds", to: `/shop/${sellerId}/refunds` },
  { label: "Payouts", to: `/shop/${sellerId}/withdraw-money` },
  { label: "Inbox", to: `/shop/${sellerId}/inbox` },
  { label: "Settings", to: `/shop/${sellerId}/settings` },
];

const readSeller = () => {
  try {
    return JSON.parse(localStorage.getItem("seller") || "{}");
  } catch {
    return {};
  }
};

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const parts = pathname.split("/").filter(Boolean);
  const isAdmin = parts[0] === "admin";
  const seller = readSeller();
  const sellerId = parts[0] === "shop" ? parts[1] : seller._id;

  const links = isAdmin ? adminLinks : sellerLinks(sellerId || "");
  const label = isAdmin ? "Admin console" : "Seller workspace";
  const home = isAdmin ? "/admin" : `/shop/${sellerId}/dashboard`;
  const identity = isAdmin
    ? "Marketplace admin"
    : seller.name || "Your shop";

  const signOut = async () => {
    setBusy(true);

    try {
      await api.post(isAdmin ? "/admin/logout" : "/shop/logout");
    } catch {
      // Clear local state even if the session already expired.
    } finally {
      localStorage.removeItem(isAdmin ? "admin" : "seller");
      setBusy(false);
      navigate(isAdmin ? "/admin/login" : "/shop-login", {
        replace: true,
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to={home}
              className="shrink-0 font-poppins text-xl font-extrabold text-secondary"
            >
              Eshop<span className="text-primary">.</span>
            </Link>

            <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-500 sm:inline-block">
              {label}
            </span>

            <div className="hidden min-w-0 items-center gap-2 border-l border-gray-200 pl-3 md:flex">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {initials(identity)}
              </span>
              <span className="truncate text-sm font-semibold text-secondary">
                {identity}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={isAdmin ? "/" : `/shop/${sellerId}`}
              className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-secondary sm:inline-flex"
            >
              {isAdmin ? (
                <>
                  <FiArrowLeft size={16} />
                  Storefront
                </>
              ) : (
                <>
                  <FiExternalLink size={16} />
                  View shop
                </>
              )}
            </Link>

            <button
              type="button"
              onClick={signOut}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">
                {busy ? "Signing out..." : "Sign out"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-50 lg:hidden"
              aria-label="Open dashboard menu"
            >
              <FiMenu size={21} />
            </button>
          </div>
        </div>

        <nav
          className="no-scrollbar hidden items-center gap-1 overflow-x-auto pb-2 lg:flex"
          aria-label="Dashboard navigation"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:bg-gray-50 hover:text-secondary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-secondary/40"
            aria-label="Close dashboard menu"
            onClick={() => setOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 w-[min(300px,85vw)] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="font-poppins text-lg font-bold text-secondary">
                {label}
              </p>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-gray-500 hover:bg-gray-50"
                aria-label="Close dashboard menu"
              >
                <FiX size={20} />
              </button>
            </div>

            <nav className="mt-5 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-primary/5 text-primary"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <Link
                to={isAdmin ? "/" : `/shop/${sellerId}`}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {isAdmin ? "Back to storefront" : "View public shop"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
