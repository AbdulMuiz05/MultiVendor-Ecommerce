import React from "react";

const AllRefundOrders = ({ refunds = [], onUpdate }) => {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="text-xl font-semibold">Refund Orders</h2>
      </div>

      {refunds.length === 0 ? (
        <p className="p-8 text-center text-gray-500">
          No refund requests found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left">Order</th>
                <th className="px-5 py-3 text-left">Amount</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {refunds.map((refund) => (
                <tr key={refund._id} className="border-t">
                  <td className="px-5 py-4">#{refund.orderId || refund._id}</td>
                  <td className="px-5 py-4">{refund.amount ?? "-"}</td>
                  <td className="px-5 py-4">{refund.status || "Pending"}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onUpdate?.(refund)}
                      className="text-blue-600 hover:underline"
                    >
                      Update
                    </button>
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

export default AllRefundOrders;