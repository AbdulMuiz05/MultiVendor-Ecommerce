import React from "react";

const AllProducts = ({ products = [] }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">All Products</h2>
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">Shop</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Stock</th>
                <th className="text-left px-5 py-3">Sold</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-200">
                  <td className="px-5 py-4">{product.name}</td>
                  <td className="px-5 py-4">
                    {product.shop?.name || product.shop?.shopName || "-"}
                  </td>
                  <td className="px-5 py-4">
                    {product.discountPrice || product.originalPrice || "-"}
                  </td>
                  <td className="px-5 py-4">{product.stock ?? "-"}</td>
                  <td className="px-5 py-4">{product.sold_out ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllProducts;