import React from "react";

const DashboardHero = ({ seller }) => {
  return (
    <div className="rounded-xl bg-blue-600 p-6 text-white">
      <p className="text-sm opacity-80">Welcome back</p>

      <h1 className="mt-2 text-3xl font-bold">
        {seller?.name || seller?.shopName || "Seller"}
      </h1>

      <p className="mt-2 text-sm opacity-90">
        Manage your products, orders, events and shop from your dashboard.
      </p>
    </div>
  );
};

export default DashboardHero;