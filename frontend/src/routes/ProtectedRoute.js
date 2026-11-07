import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLoader } from "react-icons/fi";

import { loadUser } from "../redux/actions/user";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { authChecked, isAuthenticated, loading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!authChecked && !loading) {
      dispatch(loadUser());
    }
  }, [authChecked, loading, dispatch]);

  if (!authChecked || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-light">
        <FiLoader className="animate-spin text-primary" size={30} />
        <p className="text-sm font-medium text-gray-500">
          Checking your session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;

