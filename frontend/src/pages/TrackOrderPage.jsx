import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiChevronRight,
  FiPackage,
  FiSearch,
  FiTruck,
} from "react-icons/fi";

import {
  Button,
  Card,
  Shell,
  StatusBadge,
  api,
  getError,
  money,
} from "./_pageUtils";
import OrderTimeline from "../components/Order/OrderTimeline";
import { formatDate } from "../utils/format";

export default function TrackOrderPage() {
  const { id: routeId } = useParams();
  const [orderId, setOrderId] = useState(routeId || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(routeId));
  const [error, setError] = useState("");

  const search = async (requestedId) => {
    const value = String(requestedId || "").trim();

    if (!value) {
      setError("Enter an order ID to continue.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await api.get(`/order/get-order/${value}`);
      setOrder(response.data.order);
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeId) {
      setOrderId(routeId);
      search(routeId);
    }
  }, [routeId]);

  const submit = (event) => {
    event.preventDefault();
    search(orderId);
  };

  return (
    <Shell
      title="Track your order"
      subtitle="Enter your order ID to view its latest delivery status."
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                className="input-field pl-11"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="Paste your order ID"
                required
              />
            </div>

            <Button disabled={loading} className="sm:w-36">
              {loading ? "Searching..." : "Track"}
            </Button>
          </form>

          <p className="mt-3 text-xs text-gray-400">
            You can find order IDs in{" "}
            <Link to="/orders" className="font-semibold text-primary">
              My orders
            </Link>
            . Orders are visible only to the account that placed them.
          </p>
        </Card>

        {error && (
          <Card className="border-red-100 bg-red-50 text-sm text-red-600">
            {error}
          </Card>
        )}

        {loading && (
          <div className="h-56 animate-pulse rounded-2xl bg-white" />
        )}

        {order && !loading && (
          <>
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Order #{String(order._id).slice(-8)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Placed {formatDate(order.createdAt)}
                  </p>
                </div>

                <StatusBadge status={order.status} />
              </div>

              <div className="mt-6">
                <OrderTimeline status={order.status} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FiTruck size={20} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-secondary">
                    Current status: {order.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.cart?.length || 0} product
                    {(order.cart?.length || 0) === 1 ? "" : "s"} ·{" "}
                    {money(order.totalPrice)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to={`/order/${order._id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
                >
                  <FiPackage size={15} />
                  Order details
                  <FiChevronRight size={14} />
                </Link>

                <Link
                  to="/orders"
                  className="inline-flex items-center rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary"
                >
                  All orders
                </Link>
              </div>
            </Card>
          </>
        )}
      </div>
    </Shell>
  );
}
