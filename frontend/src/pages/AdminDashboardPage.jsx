import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiCreditCard,
  FiPackage,
  FiShoppingBag,
  FiTag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

import {
  Card,
  Shell,
  Stat,
  StatusBadge,
  api,
  getError,
  money,
  safeArray,
} from "./_pageUtils";
import { formatDate } from "../utils/format";

const shortcuts = [
  {
    label: "Users",
    to: "/admin/users",
    icon: FiUsers,
    description: "Customer accounts",
  },
  {
    label: "Sellers",
    to: "/admin/sellers",
    icon: FiShoppingBag,
    description: "Registered shops",
  },
  {
    label: "Products",
    to: "/admin/products",
    icon: FiTag,
    description: "Marketplace catalog",
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: FiPackage,
    description: "Purchases and refunds",
  },
  {
    label: "Events",
    to: "/admin/events",
    icon: FiCalendar,
    description: "Seller promotions",
  },
  {
    label: "Withdrawals",
    to: "/admin/withdraws",
    icon: FiCreditCard,
    description: "Seller payouts",
  },
];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      api.get("/admin/users"),
      api.get("/admin/sellers"),
      api.get("/admin/products"),
      api.get("/admin/orders"),
      api.get("/admin/events"),
      api.get("/admin/withdraws"),
    ])
      .then(
        ([
          usersResult,
          sellersResult,
          productsResult,
          ordersResult,
          eventsResult,
          withdrawsResult,
        ]) => {
          if (!active) return;

          if (usersResult.status === "fulfilled") {
            setUsers(safeArray(usersResult.value.data.users));
          }

          if (sellersResult.status === "fulfilled") {
            setSellers(
              safeArray(
                sellersResult.value.data.sellers ||
                  sellersResult.value.data.shops
              )
            );
          }

          if (productsResult.status === "fulfilled") {
            setProducts(safeArray(productsResult.value.data.products));
          }

          if (ordersResult.status === "fulfilled") {
            setOrders(safeArray(ordersResult.value.data.orders));
          }

          if (eventsResult.status === "fulfilled") {
            setEvents(safeArray(eventsResult.value.data.events));
          }

          if (withdrawsResult.status === "fulfilled") {
            setWithdraws(
              safeArray(
                withdrawsResult.value.data.withdraws ||
                  withdrawsResult.value.data.withdrawals
              )
            );
          }

          if (ordersResult.status === "rejected") {
            setError(getError(ordersResult.reason));
          }
        }
      )
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0
  );

  const pendingRefunds = orders.filter(
    (order) => order.refundStatus === "Requested"
  ).length;

  const pendingWithdrawals = withdraws.filter(
    (withdraw) =>
      withdraw.status === "Processing" ||
      withdraw.status === "Requested"
  ).length;

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, 6),
    [orders]
  );

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin console</p>
          <h1 className="mt-1 font-poppins text-3xl font-extrabold text-secondary sm:text-4xl">
            Marketplace overview
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Accounts, catalog, orders and payouts across every seller.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
        >
          Storefront
          <FiArrowRight size={15} />
        </Link>
      </div>

      {error && (
        <Card className="mb-5 border-red-100 bg-red-50 text-sm text-red-600">
          {error}
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Customers"
              value={users.length}
              note="Registered accounts"
              icon={FiUsers}
            />
            <Stat
              label="Sellers"
              value={sellers.length}
              note="Active shops"
              icon={FiShoppingBag}
            />
            <Stat
              label="Products"
              value={products.length}
              note={`${events.length} promotions`}
              icon={FiTag}
            />
            <Stat
              label="Order value"
              value={money(revenue)}
              note={`${orders.length} orders`}
              icon={FiCreditCard}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending refunds
                </p>
                <p className="mt-1 font-poppins text-2xl font-extrabold text-secondary">
                  {pendingRefunds}
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/15"
              >
                Review
                <FiArrowRight size={13} />
              </Link>
            </Card>

            <Card className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending withdrawals
                </p>
                <p className="mt-1 font-poppins text-2xl font-extrabold text-secondary">
                  {pendingWithdrawals}
                </p>
              </div>

              <Link
                to="/admin/withdraws"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/15"
              >
                Review
                <FiArrowRight size={13} />
              </Link>
            </Card>
          </div>
        </>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Recent orders
            </h2>

            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-xl bg-gray-50"
                />
              ))}
            </div>
          ) : recentOrders.length ? (
            <div className="mt-4 divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-3 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-secondary">
                      #{String(order._id).slice(-8)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {order.user?.name || order.user?.email || "Customer"} ·{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-secondary">
                      {money(order.totalPrice)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-xl bg-gray-50 px-5 py-10 text-center text-sm text-gray-500">
              No orders have been placed yet.
            </p>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Manage
            </h2>

            <FiTruck className="text-gray-300" />
          </div>

          <div className="mt-4 space-y-1">
            {shortcuts.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={16} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-secondary">
                      {item.label}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {item.description}
                    </span>
                  </span>

                  <FiArrowRight
                    size={14}
                    className="text-gray-300 transition group-hover:text-primary"
                  />
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
