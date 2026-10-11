import React from "react";
import { Routes, Route } from "react-router-dom";

import ShopHomePage from "../pages/Shop/ShopHomePage";
import ShopDashboardPage from "../pages/Shop/ShopDashboardPage";
import ShopAllProducts from "../pages/Shop/ShopAllProducts";
import ShopCreateProduct from "../pages/Shop/ShopCreateProduct";
import ShopAllEvents from "../pages/Shop/ShopAllEvents";
import ShopCreateEvents from "../pages/Shop/ShopCreateEvents";
import ShopAllOrders from "../pages/Shop/ShopAllOrders";
import ShopOrderDetails from "../pages/Shop/ShopOrderDetails";
import ShopAllCoupouns from "../pages/Shop/ShopAllCoupouns";
import ShopAllRefunds from "../pages/Shop/ShopAllRefunds";
import ShopWithDrawMoneyPage from "../pages/Shop/ShopWithDrawMoneyPage";
import ShopSettingsPage from "../pages/Shop/ShopSettingsPage";
import ShopInboxPage from "../pages/Shop/ShopInboxPage";
import ShopPreviewPage from "../pages/Shop/ShopPreviewPage";

const ShopRoutes = () => {
  return (
    <Routes>
      <Route path="/shop/:id" element={<ShopHomePage />} />
      <Route path="/shop/:id/dashboard" element={<ShopDashboardPage />} />
      <Route path="/shop/:id/products" element={<ShopAllProducts />} />
      <Route path="/shop/:id/create-product" element={<ShopCreateProduct />} />
      <Route path="/shop/:id/events" element={<ShopAllEvents />} />
      <Route path="/shop/:id/create-event" element={<ShopCreateEvents />} />
      <Route path="/shop/:id/orders" element={<ShopAllOrders />} />
      <Route
        path="/shop/:id/order/:orderId"
        element={<ShopOrderDetails />}
      />
      <Route path="/shop/:id/coupons" element={<ShopAllCoupouns />} />
      <Route path="/shop/:id/refunds" element={<ShopAllRefunds />} />
      <Route
        path="/shop/:id/withdraw-money"
        element={<ShopWithDrawMoneyPage />}
      />
      <Route path="/shop/:id/settings" element={<ShopSettingsPage />} />
      <Route path="/shop/:id/inbox" element={<ShopInboxPage />} />
      <Route path="/shop/:id/preview" element={<ShopPreviewPage />} />
    </Routes>
  );
};

export default ShopRoutes;