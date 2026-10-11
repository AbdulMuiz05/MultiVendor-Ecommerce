import React from "react";

const AllCoupouns = ({ coupons = [] }) => {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="text-xl font-semibold">All Coupons</h2>
      </div>

      {coupons.length === 0 ? (
        <p className="p-8 text-center text-gray-500">No coupons found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left">Code</th>
                <th className="px-5 py-3 text-left">Discount</th>
                <th className="px-5 py-3 text-left">Minimum Amount</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t">
                  <td className="px-5 py-4 font-medium">
                    {coupon.name || coupon.code}
                  </td>
                  <td className="px-5 py-4">
                    {coupon.value ?? coupon.discount ?? "-"}
                  </td>
                  <td className="px-5 py-4">
                    {coupon.minAmount ?? "-"}
                  </td>
                  <td className="px-5 py-4">
                    {coupon.status || "Active"}
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

export default AllCoupouns;