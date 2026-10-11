import React from "react";
import { Link } from "react-router-dom";

const ForgotPasswordLink = () => {
  return (
    <div className="text-right">
      <Link
        to="/forgot-password"
        className="text-sm font-semibold text-primary transition hover:underline"
      >
        Forgot password?
      </Link>
    </div>
  );
};

export default ForgotPasswordLink;