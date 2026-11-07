import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiChevronRight,
  FiPackage,
  FiSearch,
  FiTruck,
} from "react-icons/fi";

import {
  Card,
  Shell,
  StatusBadge,
  api,
  getError,
  imageUrl,
  money,
  safeArray,
} from "./_pageUtils";
import { formatDate } from "../utils/format";

const TABS = [
  { value: "all", label: "All orders" },
  { value: "processing", label: "Processing" },
  { value: "shipping", label: "In transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusGroup = (status) => {
  switch (status) {
    case "Delivered":
      return "delivered";
    case "Cancelled":
      return "cancelled";
    case "Transferred to delivery partner":
    case "Shipping":
    case "Received":
    case "On the way":
      return "shipping";
    default:
      return "processing";
  }
};

export default function OrdersPage() {
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    if (!user?._id) return undefined;

    setLoading(true);
    setError("");

    api
      .get(`/order/get-all-orders/${user._id}`)
      .then((response) => {
        if (active) setOrders(safeArray(response.data.orders));
      })
      .catch((requestError) => {
        if (active) setError(getError(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?._id]);

  const counts = useMemo(() => {
    const result = { all: orders.length };

    orders.forEach((order) => {
      const group = statusGroup(order.status);
      result[group] = (result[group] || 0) + 1;
    });

    return result;
  }, [orders]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (tab !== "all" && statusGroup(order.status) !== tab) return false;

      if (term) {
        const haystack = `${order._id} ${order.status} ${
          order.cart?.[0]?.name || ""
        }`.toLowerCase();

        if (!haystack.includes(term)) return false;
      }

      return true;
    });
  }, [orders, tab, search]);

  return (
    <Shell
      title="My orders"
      subtitle="Track purchases, review order details and manage refunds."
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {TABS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === item.value
                  ? "bg-secondary text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {item.label}
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 text-[11px] ${
                  tab === item.value
                    ? "bg-white/15 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[item.value] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order ID or product"
            className="input-field pl-11"
          />
        </div>
      </div>

      {error && (
        <Card className="mb-5 border-red-100 bg-red-50 text-sm text-red-600">
          {error}
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="space-y-4">
          {filtered.map((order) => {
            const items = safeArray(order.cart);
            const itemCount = items.reduce(
              (sum, item) => sum + Number(item.qty || 1),
              0
            );

            return (
              <Card key={order._id} className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Order #{String(order._id).slice(-8)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Placed {formatDate(order.createdAt)}
                      {order.shop?.name ? ` · ${order.shop.name}` : ""}
                    </p>
                  </div>

                  <StatusBadge status={order.status} />
                </div>

                <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {items.slice(0, 4).map((item, index) => (
                        <img
                          key={`${item._id}-${index}`}
                          src={imageUrl(item.images?.[0])}
                          alt={item.name || "Product"}
                          className="h-14 w-14 rounded-xl border-2 border-white object-cover"
                        />
                      ))}
                    </div>

                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-secondary">
                        {items[0]?.name || "Order items"}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {itemCount} item{itemCount === 1 ? "" : "s"}
                        {items.length > 1
                          ? ` · ${items.length} products`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Order total</p>
                      <p className="font-poppins font-bold text-secondary">
                        {money(order.totalPrice)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-secondary transition hover:border-primary hover:text-primary"
                      >
                        Details
                        <FiChevronRight size={14} />
                      </Link>

                      <Link
                        to={`/track-order/${order._id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-primary"
                      >
                        <FiTruck size={14} />
                        Track
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="py-16 text-center">
          <FiPackage className="mx-auto text-gray-300" size={48} />
          <h2 className="mt-5 font-poppins text-xl font-bold text-secondary">
            {orders.length ? "No orders in this view" : "No orders yet"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {orders.length
              ? "Try a different status filter or search term."
              : "When you place your first order it will appear here."}
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Start shopping
          </Link>
        </Card>
      )}
    </Shell>
  );
}
