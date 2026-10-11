import React from "react";

const AllWithdraw = ({ withdrawals = [] }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Withdrawal Requests
        </h2>
      </div>

      {withdrawals.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No withdrawal requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3">Seller</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {withdrawals.map((withdraw) => (
                <tr
                  key={withdraw._id}
                  className="border-t border-gray-200"
                >
                  <td className="px-5 py-4">
                    {withdraw.shop?.name ||
                      withdraw.shop?.shopName ||
                      withdraw.seller?.name ||
                      "-"}
                  </td>
                  <td className="px-5 py-4">
                    {withdraw.amount ?? "-"}
                  </td>
                  <td className="px-5 py-4">
                    {withdraw.status || "Pending"}
                  </td>
                  <td className="px-5 py-4">
                    {withdraw.createdAt
                      ? new Date(withdraw.createdAt).toLocaleDateString()
                      : "-"}
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

export default AllWithdraw;