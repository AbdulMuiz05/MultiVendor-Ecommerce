import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminDashboardUsers from "../pages/AdminDashboardUsers";
import AdminDashboardSellers from "../pages/AdminDashboardSellers";
import AdminDashboardProducts from "../pages/AdminDashboardProducts";
import AdminDashboardEvents from "../pages/AdminDashboardEvents";
import AdminDashboardOrders from "../pages/AdminDashboardOrders";
import AdminDashboardWithdraw from "../pages/AdminDashboardWithdraw";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/users" element={<AdminDashboardUsers />} />
      <Route path="/admin/sellers" element={<AdminDashboardSellers />} />
      <Route path="/admin/products" element={<AdminDashboardProducts />} />
      <Route path="/admin/events" element={<AdminDashboardEvents />} />
      <Route path="/admin/orders" element={<AdminDashboardOrders />} />
      <Route path="/admin/withdraws" element={<AdminDashboardWithdraw />} />
    </Routes>
  );
};

export default AdminRoutes;