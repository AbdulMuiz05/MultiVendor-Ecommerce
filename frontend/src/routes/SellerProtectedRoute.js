import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../pages/_pageUtils";

const SellerProtectedRoute = ({ children }) => {
  const [state, setState] = useState("loading");

  useEffect(() => {
    api
      .get("/shop/get-seller")
      .then(() => setState("authenticated"))
      .catch(() => setState("unauthenticated"));
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light">
        Checking seller session...
      </div>
    );
  }

  return state === "authenticated"
    ? children
    : <Navigate to="/shop-login" replace />;
};

export default SellerProtectedRoute;
