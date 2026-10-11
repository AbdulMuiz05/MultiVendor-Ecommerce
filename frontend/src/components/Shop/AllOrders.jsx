import React from "react";
import { Link, useParams } from "react-router-dom";

const AllOrders = ({ orders = [] }) => {
  const { id } = useParams();

  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="text-xl font-semibold">All Orders</h2>
      </div>

      {orders.length === 0 ? (
        <p className="p-8 text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Amount</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="px-5 py-4">#{order._id}</td>
                  <td className="px-5 py-4">
                    {order.user?.name || order.user?.email || "-"}
                  </td>
                  <td className="px-5 py-4">
                    {order.totalPrice ?? order.total ?? "-"}
                  </td>
                  <td className="px-5 py-4">{order.status || "Processing"}</td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/shop/${id}/order/${order._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;