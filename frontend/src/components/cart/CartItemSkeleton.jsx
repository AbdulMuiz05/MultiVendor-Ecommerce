import React from "react";

const CartItemSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-card sm:flex-row sm:items-center">
      <div className="h-24 w-24 shrink-0 animate-pulse rounded-xl bg-gray-200" />

      <div className="flex-1 space-y-3">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="flex items-center gap-4">
        <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
};

export default CartItemSkeleton;