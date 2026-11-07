import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiCreditCard,
  FiExternalLink,
  FiPackage,
  FiPlus,
  FiSettings,
  FiShoppingBag,
  FiTag,
  FiTruck,
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
} from "../_pageUtils";
import { formatDate } from "../../utils/format";

const quickActions = (shopId) => [
  {
    title: "Add product",
    description: "Publish a new item to your catalog.",
    to: `/shop/${shopId}/create-product`,
    icon: FiPlus,
  },
  {
    title: "Process orders",
    description: "Review and update order statuses.",
    to: `/shop/${shopId}/orders`,
    icon: FiTruck,
  },
  {
    title: "Create event",
    description: "Run a limited-time promotion.",
    to: `/shop/${shopId}/create-event`,
    icon: FiCalendar,
  },
  {
    title: "Coupons",
    description: "Manage discount codes for buyers.",
    to: `/shop/${shopId}/coupons`,
    icon: FiTag,
  },
  {
    title: "Withdrawals",
    description: "Review available seller payouts.",
    to: `/shop/${shopId}/withdraw-money`,
    icon: FiCreditCard,
  },
  {
    title: "Shop settings",
    description: "Update your shop profile and details.",
    to: `/shop/${shopId}/settings`,
    icon: FiSettings,
  },
];

export default function ShopDashboardPage() {
  const shop = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("seller") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!shop._id) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError("");

    Promise.allSettled([
      api.get(`/product/get-all-products-shop/${shop._id}`),
      api.get(`/order/get-all-orders-shop/${shop._id}`),
      api.get(`/event/get-all-events-shop/${shop._id}`),
    ])
      .then(([productsResult, ordersResult, eventsResult]) => {
        if (!active) return;

        if (productsResult.status === "fulfilled") {
          setProducts(safeArray(productsResult.value.data.products));
        } else {
          setError(getError(productsResult.reason));
        }

        if (ordersResult.status === "fulfilled") {
          setOrders(safeArray(ordersResult.value.data.orders));
        }

        if (eventsResult.status === "fulfilled") {
          setEvents(safeArray(eventsResult.value.data.events));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [shop._id]);

  const revenue = orders.reduce(
    (total, order) => total + Number(order.totalPrice || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Processing" ||
      order.status === "Transferred to delivery partner"
  ).length;

  const lowStock = products
    .filter(
      (product) =>
        Number(product.stock) >= 0 && Number(product.stock) <= 5
    )
    .sort((a, b) => Number(a.stock) - Number(b.stock))
    .slice(0, 5);

  const recentOrders = orders.slice(0, 6);

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Seller workspace</p>
          <h1 className="mt-1 font-poppins text-3xl font-extrabold text-secondary sm:text-4xl">
            {shop.name || "Your shop"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            An overview of your catalog, orders and promotions.
          </p>
        </div>

        {shop._id && (
          <Link
            to={`/shop/${shop._id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
          >
            <FiExternalLink size={15} />
            View public shop
          </Link>
        )}
      </div>

      {error && (
        <Card className="mb-5 border-red-100 bg-red-50 text-sm text-red-600">
          {error}
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Products"
            value={products.length}
            note={`${lowStock.length} low on stock`}
            icon={FiShoppingBag}
          />
          <Stat
            label="Orders"
            value={orders.length}
            note={`${pendingOrders} awaiting action`}
            icon={FiPackage}
          />
          <Stat
            label="Revenue"
            value={money(revenue)}
            note="All recorded order totals"
            icon={FiCreditCard}
          />
          <Stat
            label="Events"
            value={events.length}
            note="Promotions created"
            icon={FiCalendar}
          />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Recent orders
            </h2>

            <Link
              to={`/shop/${shop._id}/orders`}
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
                <Link
                  key={order._id}
                  to={`/shop/${shop._id}/order/${order._id}`}
                  className="flex items-center justify-between gap-3 py-3.5 transition hover:opacity-80"
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
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl bg-gray-50 px-5 py-10 text-center">
              <p className="text-sm text-gray-500">
                No orders have been placed in your shop yet.
              </p>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Low stock
            </h2>

            <Link
              to={`/shop/${shop._id}/products`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Catalog
            </Link>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded-xl bg-gray-50"
                />
              ))}
            </div>
          ) : lowStock.length ? (
            <div className="mt-4 divide-y divide-gray-100">
              {lowStock.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <p className="line-clamp-1 text-sm font-medium text-secondary">
                    {product.name}
                  </p>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      Number(product.stock) === 0
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {Number(product.stock) === 0
                      ? "Out of stock"
                      : `${product.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-xl bg-gray-50 px-5 py-10 text-center text-sm text-gray-500">
              Stock levels look healthy.
            </p>
          )}
        </Card>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-poppins text-lg font-bold text-secondary">
            Quick actions
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions(shop._id).map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.to}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/20"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={19} />
                </span>

                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-poppins text-sm font-bold text-secondary">
                    {action.title}
                    <FiArrowRight
                      size={13}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    {action.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {!shop._id && (
        <Card className="mt-6 border-amber-100 bg-amber-50 text-sm text-amber-800">
          Your seller session could not be read. Please sign in through the
          seller portal again.
        </Card>
      )}
    </Shell>
  );
}
