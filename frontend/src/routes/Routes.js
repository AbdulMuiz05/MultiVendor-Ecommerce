import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import SignupPage from "../pages/SignupPage";
import ActivationPage from "../pages/ActivationPage";
import ShopCreate from "../pages/ShopCreate";
import ShopLoginPage from "../pages/ShopLoginPage";
import SellerActivationPage from "../pages/SellerActivationPage";

import ProductsPage from "../pages/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import BestSellingPage from "../pages/BestSellingPage";
import EventsPage from "../pages/EventsPage";
import FAQPage from "../pages/FAQPage";

import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentPage from "../pages/PaymentPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import TrackOrderPage from "../pages/TrackOrderPage";

import ProfilePage from "../pages/ProfilePage";
import UserInbox from "../pages/UserInbox";

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

import AdminLoginPage from "../pages/AdminLoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminDashboardUsers from "../pages/AdminDashboardUsers";
import AdminDashboardSellers from "../pages/AdminDashboardSellers";
import AdminDashboardProducts from "../pages/AdminDashboardProducts";
import AdminDashboardEvents from "../pages/AdminDashboardEvents";
import AdminDashboardOrders from "../pages/AdminDashboardOrders";
import AdminDashboardWithdraw from "../pages/AdminDashboardWithdraw";

import ProtectedRoute from "./ProtectedRoute";
import SellerProtectedRoute from "./SellerProtectedRoute";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route
        path="/activation/:activation_token"
        element={<ActivationPage />}
      />

      <Route path="/shop-create" element={<ShopCreate />} />
      <Route path="/shop-login" element={<ShopLoginPage />} />
      <Route
        path="/seller/activation/:activation_token"
        element={<SellerActivationPage />}
      />

      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/best-selling" element={<BestSellingPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/faq" element={<FAQPage />} />

      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order/:id"
        element={
          <ProtectedRoute>
            <OrderDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/track-order/:id"
        element={
          <ProtectedRoute>
            <TrackOrderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <UserInbox />
          </ProtectedRoute>
        }
      />

      <Route path="/shop/:id" element={<ShopHomePage />} />

      <Route
        path="/shop/:id/dashboard"
        element={
          <SellerProtectedRoute>
            <ShopDashboardPage />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/products"
        element={
          <SellerProtectedRoute>
            <ShopAllProducts />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/create-product"
        element={
          <SellerProtectedRoute>
            <ShopCreateProduct />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/events"
        element={
          <SellerProtectedRoute>
            <ShopAllEvents />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/create-event"
        element={
          <SellerProtectedRoute>
            <ShopCreateEvents />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/orders"
        element={
          <SellerProtectedRoute>
            <ShopAllOrders />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/order/:orderId"
        element={
          <SellerProtectedRoute>
            <ShopOrderDetails />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/coupons"
        element={
          <SellerProtectedRoute>
            <ShopAllCoupouns />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/refunds"
        element={
          <SellerProtectedRoute>
            <ShopAllRefunds />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/withdraw-money"
        element={
          <SellerProtectedRoute>
            <ShopWithDrawMoneyPage />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/settings"
        element={
          <SellerProtectedRoute>
            <ShopSettingsPage />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/inbox"
        element={
          <SellerProtectedRoute>
            <ShopInboxPage />
          </SellerProtectedRoute>
        }
      />

      <Route
        path="/shop/:id/preview"
        element={
          <SellerProtectedRoute>
            <ShopPreviewPage />
          </SellerProtectedRoute>
        }
      />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardUsers />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/sellers"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardSellers />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardProducts />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/events"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardEvents />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardOrders />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/withdraws"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardWithdraw />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;