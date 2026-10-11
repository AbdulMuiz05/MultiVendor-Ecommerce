import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  api,
  Card,
  Shell,
  money,
  getError,
  Button,
} from "./_pageUtils";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundBusy, setRefundBusy] = useState(false);

  const load = () =>
    api
      .get(`/order/get-order/${id}`)
      .then((response) => setOrder(response.data.order))
      .catch((requestError) => setError(getError(requestError)));

  useEffect(() => {
    load();
  }, [id]);

  const requestRefund = async () => {
    if (!refundReason.trim()) {
      setError("Please provide a refund reason.");
      return;
    }

    setRefundBusy(true);
    setError("");

    try {
      await api.post(`/order/request-refund/${id}`, {
        reason: refundReason.trim(),
      });
      setRefundReason("");
      await load();
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setRefundBusy(false);
    }
  };

  return (
    <Shell title="Order Details" back>
      {error && (
        <Card className="mb-5 text-red-600">{error}</Card>
      )}

      {!order ? (
        <Card>Loading order...</Card>
      ) : (
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400">Order ID</p>
                <p className="mt-1 font-semibold text-secondary">
                  {order._id}
                </p>
              </div>

              <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                {order.status}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-poppins text-xl font-bold text-secondary">
              Items
            </h2>

            <div className="mt-5 divide-y">
              {(order.cart || []).map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-secondary">
                      {item.name || "Product"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.qty || 1}
                    </p>
                  </div>

                  <p className="font-semibold">
                    {money(
                      Number(item.discountPrice || item.price || 0) *
                        Number(item.qty || 1)
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 font-bold">
              <span>Total</span>
              <span>{money(order.totalPrice)}</span>
            </div>
          </Card>

          <Card>
            <h2 className="font-poppins text-xl font-bold text-secondary">
              Shipping
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              {order.shippingAddress?.address1}
              <br />
              {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.country}{" "}
              {order.shippingAddress?.zipCode}
            </p>
          </Card>

          {order.status === "Delivered" &&
            (!order.refundStatus ||
              order.refundStatus === "None") && (
              <Card>
                <h2 className="font-poppins text-xl font-bold text-secondary">
                  Request Refund
                </h2>

                <textarea
                  className="input-field mt-4 min-h-28"
                  placeholder="Tell us why you want a refund..."
                  value={refundReason}
                  onChange={(event) =>
                    setRefundReason(event.target.value)
                  }
                />

                <Button
                  disabled={refundBusy}
                  className="mt-4"
                  onClick={requestRefund}
                >
                  {refundBusy ? "Submitting..." : "Request Refund"}
                </Button>
              </Card>
            )}

          {order.refundStatus &&
            order.refundStatus !== "None" && (
              <Card>
                <h2 className="font-poppins text-xl font-bold text-secondary">
                  Refund Status
                </h2>
                <p className="mt-2 text-sm text-primary">
                  {order.refundStatus}
                </p>
              </Card>
            )}
        </div>
      )}
    </Shell>
  );
}
