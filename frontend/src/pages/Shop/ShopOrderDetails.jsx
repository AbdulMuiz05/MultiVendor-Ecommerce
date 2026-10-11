import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, Card, Shell, money, getError } from "../_pageUtils";

export default function ShopOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    api
      .get(`/order/get-order-shop/${orderId}`)
      .then((response) => setOrder(response.data.order))
      .catch((requestError) => setError(getError(requestError)));
  }, [orderId]);

  return (
    <Shell title="Order Details" back>
      {error ? (
        <Card className="text-red-600">{error}</Card>
      ) : !order ? (
        <Card>Loading...</Card>
      ) : (
        <div className="space-y-5">
          <Card>
            <h2 className="font-poppins text-xl font-bold">
              Order #{order._id?.slice(-8)}
            </h2>
            <p className="mt-2 text-sm text-primary">{order.status}</p>
          </Card>

          <Card>
            <h3 className="font-bold">Items</h3>

            {(order.cart || []).map((item, index) => (
              <div
                key={item._id || index}
                className="flex justify-between border-b py-4 text-sm"
              >
                <span>
                  {item.name} × {item.qty || 1}
                </span>
                <span>
                  {money(
                    Number(item.discountPrice || item.price || 0) *
                      Number(item.qty || 1)
                  )}
                </span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </Shell>
  );
}
