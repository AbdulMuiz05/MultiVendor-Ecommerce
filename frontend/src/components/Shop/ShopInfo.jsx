import React from "react";

const ShopInfo = ({ shop }) => {
  if (!shop) return null;

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          {shop.avatar ? (
            <img
              src={shop.avatar}
              alt={shop.name || "Shop"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-gray-500">
              {(shop.name || "S").charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {shop.name || shop.shopName}
          </h2>

          <p className="mt-1 text-gray-500">{shop.email}</p>

          <p className="mt-1 text-sm text-gray-500">
            {shop.address || "No address provided"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;