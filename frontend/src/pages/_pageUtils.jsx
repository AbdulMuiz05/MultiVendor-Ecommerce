import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiLoader, FiSearch } from "react-icons/fi";

import { API_URL, SOCKET_URL, api, getError } from "../utils/api";
import {
  imageUrl,
  money,
  orderStatusTone,
  safeArray,
} from "../utils/format";
import { loadUser } from "../redux/actions/user";
import SiteHeader from "../components/Layout/SiteHeader";
import SiteFooter from "../components/Layout/Footer";
import DashboardHeader from "../components/Layout/DashboardHeader";

export { API_URL, SOCKET_URL, api, getError, imageUrl, money, safeArray };

export const PageLoader = ({ label = "Loading..." }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
    <FiLoader className="animate-spin text-primary" size={30} />
    <p className="text-sm font-medium text-gray-500">{label}</p>
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

const isDashboardPath = (pathname) => {
  if (pathname.startsWith("/admin")) return true;

  const parts = pathname.split("/").filter(Boolean);

  return parts[0] === "shop" && parts.length > 2;
};

export const Shell = ({
  children,
  title,
  subtitle,
  back = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { authChecked, loading } = useSelector((state) => state.user);
  const dashboard = isDashboardPath(pathname);

  useEffect(() => {
    if (!dashboard && !authChecked && !loading) {
      dispatch(loadUser());
    }
  }, [dashboard, authChecked, loading, dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-light">
      {dashboard ? <DashboardHeader /> : <SiteHeader />}

      <main className="container-app w-full flex-1 py-8 sm:py-10">
        {(back || title || subtitle) && (
          <div className="mb-8">
            {back && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-primary"
              >
                <FiArrowLeft size={16} />
                Back
              </button>
            )}

            {title && (
              <h1 className="font-poppins text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </main>

      {!dashboard && <SiteFooter />}
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
  children,
}) => (
  <Card className="py-14 text-center">
    <div className="mx-auto flex max-w-md flex-col items-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl">
        ✦
      </div>

      <h3 className="font-poppins text-xl font-bold text-secondary">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>

      {children && <div className="mt-6">{children}</div>}
    </div>
  </Card>
);

export const Stat = ({ label, value, note, icon: Icon }) => (
  <Card>
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>

        <p className="mt-2 font-poppins text-3xl font-extrabold text-secondary">
          {value}
        </p>

        {note && <p className="mt-1 text-xs text-gray-400">{note}</p>}
      </div>

      {Icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={20} />
        </span>
      )}
    </div>
  </Card>
);

export const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${orderStatusTone(
      status
    )}`}
  >
    {status || "Processing"}
  </span>
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
      type="search"
    />
  </div>
);

export const Table = ({
  columns,
  rows,
  empty = "No records found.",
  loading = false,
}) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-4 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {loading ? (
            [1, 2, 3, 4].map((row) => (
              <tr key={row}>
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-5">
                    <span className="block h-4 w-24 animate-pulse rounded bg-gray-100" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length ? (
            rows.map((row, index) => (
              <tr
                key={row._id || row.id || index}
                className="transition hover:bg-gray-50/70"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-gray-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-14 text-center text-gray-400"
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
