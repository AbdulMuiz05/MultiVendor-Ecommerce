import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import OrderTimeline from "../../components/Order/OrderTimeline";
import {
  api,
  Button,
  Card,
  PageLoader,
  Shell,
  StatusBadge,
  Select,
  getError,
  imageUrl,
  money,
} from "../_pageUtils";
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

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

export default function ShopOrderDetails() {
  const { id, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");

    api
      .get(`/order/get-order-shop/${orderId}`)
      .then((response) => {
        const data = response.data.order || null;
        setOrder(data);
        setStatus(data?.status || "");
      })
      .catch((requestError) => setError(getError(requestError)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (orderId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const updateStatus = async () => {
    if (!status || status === order?.status) return;

    setBusy(true);
    setError("");

    try {
      const response = await api.put(`/order/update-order-status/${orderId}`, {
        status,
      });

      setOrder(response.data.order || { ...order, status });
      notify(`Order marked as ${status}.`);
    } catch (requestError) {
      setError(getError(requestError));
      setStatus(order?.status || "");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Shell title="Order Details" back>
        <PageLoader label="Loading order..." />
      </Shell>
    );
  }

  if (error && !order) {
    return (
      <Shell title="Order Details" back>
        <Card className="text-center">
          <p className="text-sm text-red-600">{error}</p>
          <Button variant="outline" className="mt-5" onClick={load}>
            Try again
          </Button>
        </Card>
      </Shell>
    );
  }

  if (!order) return null;

  const options = nextStatuses[order.status] || [];

  return (
    <Shell
      title={`Order #${order._id?.slice(-8)}`}
      subtitle={`Placed ${formatDate(order.createdAt)}`}
      back
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-poppins text-lg font-bold text-secondary">
                  Fulfilment
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update the delivery status for this order.
                </p>
              </div>

              <StatusBadge status={order.status} />
            </div>

            <div className="mt-5">
              <OrderTimeline status={order.status} />
            </div>

            {options.length > 0 ? (
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-end">
                <Select
                  label="Next status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="flex-1"
                >
                  <option value={order.status}>{order.status}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>

                <Button
                  onClick={updateStatus}
                  disabled={busy || status === order.status}
                >
                  {busy ? "Updating..." : "Update status"}
                </Button>
              </div>
            ) : (
              <p className="mt-5 border-t border-gray-100 pt-4 text-sm text-gray-500">
                No further status changes are available for this order.
              </p>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
          </Card>

          <Card>
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Items ({order.cart?.length || 0})
            </h2>

            <div className="mt-4 divide-y divide-gray-100">
              {(order.cart || []).map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {item.images?.[0] ? (
                    <img
                      src={imageUrl(item.images[0])}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                      No image
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-secondary">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {money(item.discountPrice || item.price)} ×{" "}
                      {item.qty}
                    </p>
                  </div>

                  <p className="font-bold text-secondary">
                    {money(
                      Number(item.discountPrice || item.price || 0) *
                        Number(item.qty || 1)
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Order summary
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Customer</dt>
                <dd className="text-right font-semibold text-secondary">
                  {order.user?.name || "—"}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Payment</dt>
                <dd className="text-right font-semibold text-secondary">
                  {order.paymentInfo?.type || "COD"} ·{" "}
                  {order.paymentInfo?.status || "Pending"}
                </dd>
              </div>

              <div className="flex justify-between gap-4 border-t border-gray-100 pt-3">
                <dt className="text-gray-500">Order total</dt>
                <dd className="text-right font-poppins text-xl font-extrabold text-secondary">
                  {money(order.totalPrice)}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Shipping address
            </h2>

            <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
              <p className="font-semibold text-secondary">
                {order.shippingAddress?.name}
              </p>
              {order.shippingAddress?.address1 && (
                <p>{order.shippingAddress.address1}</p>
              )}
              {order.shippingAddress?.address2 && (
                <p>{order.shippingAddress.address2}</p>
              )}
              <p>
                {[
                  order.shippingAddress?.city,
                  order.shippingAddress?.zipCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && (
                <p className="text-gray-500">
                  {order.shippingAddress.phone}
                </p>
              )}
            </address>
          </Card>

          <Link
            to={`/shop/${id}/orders`}
            className="block text-center text-sm font-semibold text-primary hover:underline"
          >
            Back to all orders
          </Link>
        </aside>
      </div>
    </Shell>
  );
}
