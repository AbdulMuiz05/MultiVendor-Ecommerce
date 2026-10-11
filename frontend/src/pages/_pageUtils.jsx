import React from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiLoader,
  FiSearch,
} from "react-icons/fi";

import { API_URL, SOCKET_URL } from "../server";

export { API_URL, SOCKET_URL };

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const imageUrl = (src) => {
  if (!src) {
    return "https://placehold.co/800x800/f8fafc/64748b?text=Eshop";
  }

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  const root = API_URL.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");

  return `${root}/${String(src).replace(/^\//, "")}`;
};

export const money = (value) => `₹${Number(value || 0).toFixed(2)}`;

export const safeArray = (value) => (Array.isArray(value) ? value : []);

export const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <FiLoader className="animate-spin text-primary" size={30} />
  </div>
);

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => (
  <button
    className={`${
      variant === "primary"
        ? "bg-primary text-white hover:opacity-90"
        : variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "border border-gray-200 bg-white text-secondary hover:border-gray-300"
    } inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Field = ({ label, className = "", ...props }) => (
  <label className={`block ${className}`}>
    {label && (
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>
    )}
    <input className="input-field" {...props} />
  </label>
);

export const TextArea = ({ label, className = "", ...props }) => (
  <label className={`block ${className}`}>
    {label && (
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>
    )}
    <textarea className="input-field min-h-32 resize-y" {...props} />
  </label>
);

export const Select = ({
  label,
  children,
  className = "",
  ...props
}) => (
  <label className={`block ${className}`}>
    {label && (
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>
    )}
    <select className="input-field" {...props}>
      {children}
    </select>
  </label>
);

// Public storefront pages where visitors should see Login / Sign Up.
// Customer-only, seller and admin pages are intentionally excluded.
const PUBLIC_AUTH_PATHS = [
  "/",
  "/products",
  "/best-selling",
  "/events",
  "/faq",
  "/cart",
  "/wishlist",
];

export const Shell = ({
  children,
  title,
  subtitle,
  back = false,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const showAuthLinks =
    PUBLIC_AUTH_PATHS.includes(pathname) ||
    pathname.startsWith("/product/");

  return (
    <div className="min-h-screen bg-light">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="container-app flex min-h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="font-poppins text-xl font-extrabold text-secondary"
          >
            Eshop<span className="text-primary">.</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {back && (
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary"
              >
                <FiArrowLeft />
                Back
              </button>
            )}

            {showAuthLinks && (
              <nav
                aria-label="Account"
                className="flex items-center gap-1 sm:gap-2"
              >
                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition hover:text-primary"
                >
                  Login
                </Link>

                <Link
                  to="/sign-up"
                  className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:px-4"
                >
                  Sign Up
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className="container-app py-8 sm:py-10">
        {(title || subtitle) && (
          <div className="mb-8">
            <h1 className="font-poppins text-3xl font-extrabold text-secondary">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </main>
    </div>
  );
};

export const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-card ${className}`}
  >
    {children}
  </div>
);

export const Empty = ({
  title = "Nothing here yet",
  text = "There is nothing to display right now.",
}) => (
  <Card className="py-14 text-center">
    <div className="mx-auto max-w-md">
      <h3 className="font-poppins text-xl font-bold text-secondary">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        {text}
      </p>
    </div>
  </Card>
);

export const Stat = ({ label, value, note }) => (
  <Card>
    <p className="text-sm font-medium text-gray-500">
      {label}
    </p>

    <p className="mt-2 font-poppins text-3xl font-extrabold text-secondary">
      {value}
    </p>

    {note && (
      <p className="mt-1 text-xs text-gray-400">
        {note}
      </p>
    )}
  </Card>
);

export const SearchBox = ({
  value,
  onChange,
  placeholder = "Search...",
}) => (
  <div className="relative">
    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input-field pl-11"
    />
  </div>
);

export const ProductTile = ({ product, onAdd }) => (
  <Card className="overflow-hidden p-0">
    <Link to={`/product/${product._id}`}>
      <img
        src={imageUrl(product.images?.[0])}
        alt={product.name || "Product"}
        className="h-56 w-full object-cover"
      />
    </Link>

    <div className="p-4">
      <p className="text-xs font-medium text-primary">
        {product.category || "Product"}
      </p>

      <Link to={`/product/${product._id}`}>
        <h3 className="mt-1 line-clamp-2 font-semibold text-secondary">
          {product.name}
        </h3>
      </Link>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="font-poppins text-lg font-bold text-secondary">
          {money(product.discountPrice ?? product.price)}
        </span>

        {onAdd && (
          <Button
            onClick={() => onAdd(product)}
            className="px-3 py-2 text-xs"
          >
            Add
          </Button>
        )}
      </div>
    </div>
  </Card>
);

export const Table = ({
  columns,
  rows,
  empty = "No records found.",
}) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-5 py-4 font-semibold"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {rows.length ? (
            rows.map((row, index) => (
              <tr
                key={row._id || row.id || index}
                className="hover:bg-gray-50/70"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-5 py-4 text-gray-700"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-12 text-center text-gray-400"
              >
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong.";
