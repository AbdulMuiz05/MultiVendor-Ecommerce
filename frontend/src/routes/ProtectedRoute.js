import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../pages/_pageUtils";

const ProtectedRoute = ({ children }) => {
  const [state, setState] = useState("loading");

  useEffect(() => {
    api
      .get("/user/getuser")
      .then(() => setState("authenticated"))
      .catch(() => setState("unauthenticated"));
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light">
        Checking session...
      </div>
    );
  }

  return state === "authenticated" ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
