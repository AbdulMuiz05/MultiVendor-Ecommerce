import React from "react";

const OrderDetails = ({ order }) => {
  if (!order) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
        Order not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-2xl font-semibold">
          Order #{order._id}
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="mt-1 font-semibold">
              {order.status || "Processing"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="mt-1 font-semibold">
              {order.totalPrice ?? order.total ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment</p>
            <p className="mt-1 font-semibold">
              {order.paymentInfo?.type || order.paymentMethod || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-5 text-xl font-semibold">Order Items</h3>

        <div className="space-y-4">
          {(order.cart || order.items || []).map((item, index) => (
            <div
              key={item._id || index}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                <p className="font-medium">
                  {item.name || "Product"}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.qty || item.quantity || 1}
                </p>
              </div>

              <p className="font-semibold">
                {item.discountPrice ?? item.price ?? "-"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;