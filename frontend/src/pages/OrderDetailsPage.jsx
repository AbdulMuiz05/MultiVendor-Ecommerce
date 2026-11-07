import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

import {
  Button,
  Card,
  Shell,
  StatusBadge,
  TextArea,
  api,
  getError,
  imageUrl,
  money,
  safeArray,
} from "./_pageUtils";
import OrderTimeline from "../components/Order/OrderTimeline";
import { formatDate } from "../utils/format";
import { notify } from "../components/UI/Toaster";

export default function OrderDetailsPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundBusy, setRefundBusy] = useState(false);
  const [refundError, setRefundError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/order/get-order/${id}`);
      setOrder(response.data.order);
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const requestRefund = async (event) => {
    event.preventDefault();

    if (!refundReason.trim()) {
      setRefundError("Please provide a reason for the refund.");
      return;
    }

    setRefundBusy(true);
    setRefundError("");

    try {
      const response = await api.post(`/order/request-refund/${id}`, {
        reason: refundReason.trim(),
      });

      setOrder(response.data.order);
      setRefundReason("");
      notify("Refund request submitted.");
    } catch (requestError) {
      setRefundError(getError(requestError));
    } finally {
      setRefundBusy(false);
    }
  };

  if (loading) {
    return (
      <Shell back>
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-2xl bg-white" />
          <div className="h-56 animate-pulse rounded-2xl bg-white" />
          <div className="h-40 animate-pulse rounded-2xl bg-white" />
        </div>
      </Shell>
    );
  }

  if (error || !order) {
    return (
      <Shell back>
        <Card className="py-16 text-center">
          <FiPackage className="mx-auto text-gray-300" size={46} />
          <h1 className="mt-5 font-poppins text-xl font-bold text-secondary">
            Order not available
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {error || "We could not find this order."}
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Back to my orders
          </Link>
        </Card>
      </Shell>
    );
  }

  const items = safeArray(order.cart);
  const itemCount = items.reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0
  );
  const canRequestRefund =
    order.status === "Delivered" &&
    (!order.refundStatus || order.refundStatus === "None");
  const hasRefund =
    order.refundStatus && order.refundStatus !== "None";

  return (
    <Shell back>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Order details</p>
          <h1 className="mt-1 break-all font-poppins text-2xl font-extrabold text-secondary sm:text-3xl">
            #{String(order._id).slice(-10)}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Placed on {formatDate(order.createdAt, { hour: undefined })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={order.status} />

          <Link
            to={`/track-order/${order._id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
          >
            <FiTruck size={15} />
            Track order
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Order progress
            </h2>
            <OrderTimeline status={order.status} />
          </Card>

          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-poppins text-lg font-bold text-secondary">
                Items
              </h2>
              <span className="text-xs font-semibold text-gray-400">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </span>
            </div>

            <ul className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <li
                  key={`${item._id}-${index}`}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <Link
                    to={`/product/${item._id}`}
                    className="shrink-0 overflow-hidden rounded-xl bg-gray-50"
                  >
                    <img
                      src={imageUrl(item.images?.[0])}
                      alt={item.name || "Product"}
                      className="h-16 w-16 object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    {item.shop?.name && (
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {item.shop.name}
                      </p>
                    )}

                    <Link
                      to={`/product/${item._id}`}
                      className="line-clamp-2 text-sm font-semibold text-secondary transition hover:text-primary"
                    >
                      {item.name || "Product"}
                    </Link>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty {item.qty || 1} ×{" "}
                      {money(item.discountPrice || item.price)}
                    </p>
                  </div>

                  <p className="shrink-0 font-semibold text-secondary">
                    {money(
                      Number(item.discountPrice || item.price || 0) *
                        Number(item.qty || 1)
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-primary" />
                <h2 className="font-poppins text-lg font-bold text-secondary">
                  Shipping address
                </h2>
              </div>

              <div className="mt-4 space-y-1 text-sm leading-6 text-gray-600">
                {order.shippingAddress?.name && (
                  <p className="font-semibold text-secondary">
                    {order.shippingAddress.name}
                  </p>
                )}

                {order.shippingAddress?.phone && (
                  <p>{order.shippingAddress.phone}</p>
                )}

                <p>{order.shippingAddress?.address1}</p>

                {order.shippingAddress?.address2 && (
                  <p>{order.shippingAddress.address2}</p>
                )}

                <p>
                  {[
                    order.shippingAddress?.city,
                    order.shippingAddress?.country,
                    order.shippingAddress?.zipCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                {order.shippingAddress?.addressType && (
                  <span className="mt-2 inline-block rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                    {order.shippingAddress.addressType}
                  </span>
                )}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2">
                <FiCreditCard className="text-primary" />
                <h2 className="font-poppins text-lg font-bold text-secondary">
                  Payment
                </h2>
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Method</dt>
                  <dd className="font-semibold text-secondary">
                    {order.paymentInfo?.type || "—"}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-gray-500">Status</dt>
                  <dd className="font-semibold text-secondary">
                    {order.paymentInfo?.status || "—"}
                  </dd>
                </div>

                <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-secondary">
                  <dt>Total</dt>
                  <dd>{money(order.totalPrice)}</dd>
                </div>
              </dl>
            </Card>
          </div>

          {hasRefund && (
            <Card>
              <h2 className="font-poppins text-lg font-bold text-secondary">
                Refund status
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {order.refundStatus}
                </span>

                {order.refundRequestedAt && (
                  <span className="text-xs text-gray-400">
                    Requested {formatDate(order.refundRequestedAt)}
                  </span>
                )}
              </div>

              {order.refundReason && (
                <p className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-600">
                  {order.refundReason}
                </p>
              )}
            </Card>
          )}

          {canRequestRefund && (
            <Card>
              <h2 className="font-poppins text-lg font-bold text-secondary">
                Request a refund
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                This order was delivered. Tell the seller why you would like a
                refund.
              </p>

              <form onSubmit={requestRefund} className="mt-4">
                <TextArea
                  value={refundReason}
                  onChange={(event) =>
                    setRefundReason(event.target.value)
                  }
                  placeholder="Describe the issue with your order..."
                  maxLength={1000}
                />

                {refundError && (
                  <p className="mt-2 text-sm text-red-600">{refundError}</p>
                )}

                <Button
                  variant="secondary"
                  disabled={refundBusy || !refundReason.trim()}
                  className="mt-4 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                >
                  {refundBusy ? "Submitting..." : "Submit refund request"}
                </Button>
              </form>
            </Card>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:h-fit">
          <Card>
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Order summary
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-semibold text-secondary">
                  {money(order.totalPrice)}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-gray-500">Items</dt>
                <dd className="font-semibold text-secondary">{itemCount}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-gray-500">Order date</dt>
                <dd className="font-semibold text-secondary">
                  {formatDate(order.createdAt)}
                </dd>
              </div>

              {order.deliveredAt && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Delivered</dt>
                  <dd className="font-semibold text-emerald-600">
                    {formatDate(order.deliveredAt)}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-poppins text-lg font-bold text-secondary">
              <span>Total</span>
              <span>{money(order.totalPrice)}</span>
            </div>

            <Link to="/orders" className="mt-5 block">
              <Button variant="secondary" className="w-full">
                <FiArrowLeft className="mr-2" />
                All orders
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
