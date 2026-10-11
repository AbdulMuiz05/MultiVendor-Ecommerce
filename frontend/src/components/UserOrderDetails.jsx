import React from "react";

const UserOrderDetails = ({ order }) => {
  if (!order) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        Order details not found.
      </div>
    );
  }

  const items = order.cart || order.orderItems || order.items || [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-blue-600 p-6 text-white">
        <p className="text-sm opacity-80">Order Details</p>

        <h1 className="mt-2 text-2xl font-bold">
          Order #{order._id}
        </h1>

        <p className="mt-2 text-sm">
          Status: {order.status || "Processing"}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold text-gray-800">
          Order Items
        </h2>

        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500">No items found.</p>
          ) : (
            items.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center gap-4 border-b pb-4 last:border-b-0"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.images?.[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.name || "Product"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.qty || item.quantity || 1}
                  </p>
                </div>

                <p className="font-semibold text-gray-800">
                  ${Number(
                    item.discountPrice || item.price || 0
                  ).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-5 text-xl font-semibold text-gray-800">
          Order Summary
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Items</span>
            <span>{items.length}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Payment Method</span>
            <span>
              {order.paymentInfo?.type ||
                order.paymentMethod ||
                "Not specified"}
            </span>
          </div>

          <div className="flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total</span>
            <span>
              ${Number(order.totalPrice || order.total || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;