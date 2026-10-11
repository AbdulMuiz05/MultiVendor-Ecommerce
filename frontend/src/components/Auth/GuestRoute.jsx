import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default GuestRoute;