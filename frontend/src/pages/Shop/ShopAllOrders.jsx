import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiExternalLink, FiSearch } from "react-icons/fi";

import {
  Shell,
  StatusBadge,
  Table,
  api,
  getError,
  money,
  safeArray,
} from "../_pageUtils";
import { formatDate } from "../../utils/format";
import { notify } from "../../components/UI/Toaster";

const nextStatuses = {
  Processing: ["Transferred to delivery partner", "Cancelled"],
  "Transferred to delivery partner": ["Shipping", "Cancelled"],
  Shipping: ["On the way", "Cancelled"],
  "On the way": ["Received", "Delivered"],
  Received: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

export default function ShopAllOrders() {
  const shop = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("seller") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState("");

  const load = () => {
    if (!shop._id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api
      .get(`/order/get-all-orders-shop/${shop._id}`)
      .then((response) => setRows(safeArray(response.data.orders)))
      .catch((requestError) => setError(getError(requestError)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop._id]);

  const update = async (order, status) => {
    if (!status) return;

    setUpdating(order._id);
    setError("");

    try {
      await api.put(`/order/update-order-status/${order._id}`, { status });
      notify(`Order marked as ${status}.`);
      load();
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setUpdating("");
    }
  };

  const statuses = useMemo(
    () => [...new Set(rows.map((order) => order.status).filter(Boolean))],
    [rows]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      if (!term) return true;

      const haystack = `${order._id} ${
        order.user?.name || ""
      } ${order.user?.email || ""} ${order.cart?.[0]?.name || ""}`.toLowerCase();

      return haystack.includes(term);
    });
  }, [rows, search, statusFilter]);

  const pending = rows.filter(
    (order) =>
      order.status === "Processing" ||
      order.status === "Transferred to delivery partner"
  ).length;

  const columns = [
    {
      key: "order",
      label: "Order",
      render: (order) => (
        <div>
          <p className="font-semibold text-secondary">
            #{String(order._id).slice(-8)}
          </p>
          <p className="text-xs text-gray-400">
            {formatDate(order.createdAt)}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (order) => (
        <div className="min-w-0">
          <p className="line-clamp-1 font-medium text-secondary">
            {order.user?.name || "Customer"}
          </p>
          <p className="line-clamp-1 text-xs text-gray-400">
            {order.user?.email || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (order) => (
        <span className="text-gray-600">
          {safeArray(order.cart).length}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (order) => (
        <span className="font-semibold text-secondary">
          {money(order.totalPrice)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (order) => <StatusBadge status={order.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (order) => {
        const options = nextStatuses[order.status] || [];

        return (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/shop/${shop._id}/order/${order._id}`}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-primary hover:text-primary"
            >
              <FiExternalLink size={13} />
              Details
            </Link>

            {options.length > 0 && (
              <select
                value=""
                onChange={(event) => update(order, event.target.value)}
                disabled={updating === order._id}
                aria-label={`Update status for order ${order._id}`}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-600 outline-none transition focus:border-primary disabled:opacity-50"
              >
                <option value="">
                  {updating === order._id ? "Updating..." : "Update"}
                </option>

                {options.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Shell>
      <div className="mb-8">
        <p className="eyebrow">Fulfilment</p>
        <h1 className="mt-1 font-poppins text-3xl font-extrabold text-secondary sm:text-4xl">
          Shop orders
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {rows.length} order{rows.length === 1 ? "" : "s"} · {pending}{" "}
          awaiting action
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order ID, customer or product..."
            className="input-field pl-11"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="input-field sm:w-56"
          aria-label="Filter by order status"
        >
          <option value="all">All statuses</option>

          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <Table
        columns={columns}
        rows={filtered}
        loading={loading}
        empty="No orders match your search or filter."
      />

      {!loading && filtered.length > 0 && (
        <p className="mt-3 text-xs text-gray-400">
          Showing {filtered.length} of {rows.length} orders.
        </p>
      )}
    </Shell>
  );
}
