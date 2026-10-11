import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../pages/_pageUtils";

const ProtectedAdminRoute = ({ children }) => {
  const [state, setState] = useState("loading");

  useEffect(() => {
    api
      .get("/admin/me")
      .then(() => setState("authenticated"))
      .catch(() => setState("unauthenticated"));
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light">
        Checking admin session...
      </div>
    );
  }

  if (state === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
