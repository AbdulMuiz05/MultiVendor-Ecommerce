import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";

const shopLinks = [
  ["Home", "/"],
  ["Best Selling", "/best-selling"],
  ["All Products", "/products"],
  ["Events & Offers", "/events"],
  ["FAQ", "/faq"],
];

const accountLinks = [
  ["My Profile", "/profile"],
  ["My Orders", "/orders"],
  ["Wishlist", "/wishlist"],
  ["Shopping Cart", "/cart"],
  ["Messages", "/inbox"],
];

const sellerLinks = [
  ["Become a Seller", "/shop-create"],
  ["Seller Login", "/shop-login"],
  ["Seller Dashboard", "/shop-login"],
];

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-secondary text-white">
      <div className="container-app py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-block">
              <span className="font-poppins text-2xl font-extrabold">
                Eshop<span className="text-primary">.</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
              A modern multi-vendor marketplace where customers discover
              quality products from trusted independent sellers.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FiTruck className="text-primary" size={16} />
                Seller-managed delivery updates
              </span>

              <span className="flex items-center gap-2">
                <FiShield className="text-primary" size={16} />
                Protected account and checkout flows
              </span>

              <span className="flex items-center gap-2">
                <FiCheckCircle className="text-primary" size={16} />
                Reviews from verified customers
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-poppins text-base font-bold">Shop</h3>

            <div className="mt-5 space-y-3 text-sm text-gray-400">
              {shopLinks.map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  className="block transition hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-poppins text-base font-bold">Account</h3>

            <div className="mt-5 space-y-3 text-sm text-gray-400">
              {accountLinks.map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  className="block transition hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-poppins text-base font-bold">Sell with us</h3>

            <div className="mt-5 space-y-3 text-sm text-gray-400">
              {sellerLinks.map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  className="block transition hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <FiShoppingBag className="text-primary" size={20} />

              <p className="mt-3 text-sm font-semibold text-white">
                Open your storefront
              </p>

              <p className="mt-1 text-xs leading-6 text-gray-400">
                Join the marketplace and manage products, orders, events and
                payouts in one place.
              </p>

              <Link
                to="/shop-create"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary"
              >
                Get started
                <FiArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Eshop. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link to="/faq" className="transition hover:text-gray-300">
              Help
            </Link>
            <Link to="/events" className="transition hover:text-gray-300">
              Offers
            </Link>
            <span>Built for modern commerce.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;