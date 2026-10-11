import React from "react";

const AllSellers = ({ sellers = [] }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">All Sellers</h2>
      </div>

      {sellers.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No sellers found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3">Seller</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Phone</th>
                <th className="text-left px-5 py-3">Address</th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id} className="border-t border-gray-200">
                  <td className="px-5 py-4">
                    {seller.name || seller.shopName || "-"}
                  </td>
                  <td className="px-5 py-4">{seller.email || "-"}</td>
                  <td className="px-5 py-4">{seller.phoneNumber || "-"}</td>
                  <td className="px-5 py-4">{seller.address || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllSellers;