import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
      <div className="aspect-square animate-pulse bg-gray-200" />

      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

        <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />

        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;