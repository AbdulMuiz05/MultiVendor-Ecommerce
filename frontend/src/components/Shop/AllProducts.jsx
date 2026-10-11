import React from "react";

const AllProducts = ({ products = [], onDelete }) => {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="text-xl font-semibold">All Products</h2>
      </div>

      {products.length === 0 ? (
        <p className="p-8 text-center text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Price</th>
                <th className="px-5 py-3 text-left">Stock</th>
                <th className="px-5 py-3 text-left">Sold</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="px-5 py-4">{product.name}</td>
                  <td className="px-5 py-4">
                    {product.discountPrice ?? product.originalPrice ?? "-"}
                  </td>
                  <td className="px-5 py-4">{product.stock ?? "-"}</td>
                  <td className="px-5 py-4">{product.sold_out ?? 0}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onDelete?.(product._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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

export default AllProducts;