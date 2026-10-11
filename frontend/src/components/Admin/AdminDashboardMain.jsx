import React from "react";
import {
  MdPeople,
  MdStore,
  MdInventory,
  MdShoppingCart,
  MdEvent,
  MdPayments,
} from "react-icons/md";

const AdminDashboardMain = ({
  users = [],
  sellers = [],
  products = [],
  orders = [],
  events = [],
  withdrawals = [],
}) => {
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: <MdPeople />,
    },
    {
      title: "Total Sellers",
      value: sellers.length,
      icon: <MdStore />,
    },
    {
      title: "Total Products",
      value: products.length,
      icon: <MdInventory />,
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: <MdShoppingCart />,
    },
    {
      title: "Total Events",
      value: events.length,
      icon: <MdEvent />,
    },
    {
      title: "Withdrawals",
      value: withdrawals.length,
      icon: <MdPayments />,
    },
  ];

  return (
    <main className="flex-1 bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your e-commerce platform
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </h2>
              </div>

              <div className="text-4xl text-blue-600">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminDashboardMain;