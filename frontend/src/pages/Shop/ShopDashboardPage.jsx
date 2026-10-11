import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  api,
  Card,
  Shell,
  Stat,
  safeArray,
  money,
} from "../_pageUtils";

export default function ShopDashboardPage() {
  const shop = JSON.parse(localStorage.getItem("seller") || "{}");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!shop._id) return;

    Promise.allSettled([
      api.get(`/product/get-all-products-shop/${shop._id}`),
      api.get(`/order/get-all-orders-shop/${shop._id}`),
      api.get(`/event/get-all-events-shop/${shop._id}`),
    ]).then(([productsResult, ordersResult, eventsResult]) => {
      if (productsResult.status === "fulfilled") {
        setProducts(
          safeArray(productsResult.value.data.products)
        );
      }

      if (ordersResult.status === "fulfilled") {
        setOrders(
          safeArray(ordersResult.value.data.orders)
        );
      }

      if (eventsResult.status === "fulfilled") {
        setEvents(
          safeArray(eventsResult.value.data.events)
        );
      }
    });
  }, [shop._id]);

  const revenue = orders.reduce(
    (total, order) => total + Number(order.totalPrice || 0),
    0
  );

  const dashboardLinks = [
    [`/shop/${shop._id}/products`, "Products"],
    [`/shop/${shop._id}/create-product`, "Create Product"],
    [`/shop/${shop._id}/orders`, "Orders"],
    [`/shop/${shop._id}/events`, "Events"],
    [`/shop/${shop._id}/coupons`, "Coupons"],
    [`/shop/${shop._id}/settings`, "Settings"],
  ];

  return (
    <Shell
      title="Seller Dashboard"
      subtitle={shop.name || "Manage your store."}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={products.length} />
        <Stat label="Orders" value={orders.length} />
        <Stat label="Events" value={events.length} />
        <Stat label="Revenue" value={money(revenue)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-poppins text-xl font-bold text-secondary">
            Quick actions
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {dashboardLinks.map(([url, title]) => (
              <Link
                key={url}
                to={url}
                className="rounded-xl bg-gray-50 p-4 text-sm font-semibold hover:bg-primary/5 hover:text-primary"
              >
                {title}
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-poppins text-xl font-bold text-secondary">
            Recent orders
          </h2>

          <div className="mt-4 divide-y">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex justify-between py-3 text-sm"
              >
                <span>#{order._id?.slice(-8)}</span>
                <span className="font-semibold">
                  {order.status}
                </span>
              </div>
            ))}

            {!orders.length && (
              <p className="py-8 text-center text-sm text-gray-400">
                No orders yet.
              </p>
            )}
          </div>
        </Card>
      </div>
    </Shell>
  );
}