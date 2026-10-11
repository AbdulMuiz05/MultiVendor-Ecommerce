import React from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-secondary text-white">
      <div className="container-app py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-poppins text-2xl font-extrabold">
                E<span className="text-primary">shop</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
              A modern multi-vendor marketplace where customers discover
              quality products from trusted sellers.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-lg bg-white/10 p-2.5 transition hover:bg-primary"
              >
                <FiFacebook size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="rounded-lg bg-white/10 p-2.5 transition hover:bg-primary"
              >
                <FiInstagram size={18} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="rounded-lg bg-white/10 p-2.5 transition hover:bg-primary"
              >
                <FiTwitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-poppins text-base font-bold">Quick Links</h3>

            <div className="mt-5 space-y-3 text-sm text-gray-400">
              <Link
                to="/"
                className="block transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="block transition hover:text-white"
              >
                Products
              </Link>

              <Link
                to="/wishlist"
                className="block transition hover:text-white"
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                className="block transition hover:text-white"
              >
                Shopping Cart
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-poppins text-base font-bold">Account</h3>

            <div className="mt-5 space-y-3 text-sm text-gray-400">
              <Link
                to="/profile"
                className="block transition hover:text-white"
              >
                My Profile
              </Link>

              <Link
                to="/orders"
                className="block transition hover:text-white"
              >
                My Orders
              </Link>

              <Link
                to="/login"
                className="block transition hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="block transition hover:text-white"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-poppins text-base font-bold">
              Stay Connected
            </h3>

            <p className="mt-5 text-sm leading-6 text-gray-400">
              Subscribe for new products, exclusive offers, and marketplace
              updates.
            </p>

            <div className="mt-5 flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
              <FiMail className="ml-3 shrink-0 text-gray-400" size={18} />

              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500"
              />

              <button
                type="button"
                className="rounded-lg bg-primary p-2.5 text-white transition hover:opacity-90"
                aria-label="Subscribe"
              >
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Eshop. All rights reserved.</p>

          <p>Built for a modern shopping experience.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;