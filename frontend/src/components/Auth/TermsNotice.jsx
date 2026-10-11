import React from "react";
import { Link } from "react-router-dom";

const TermsNotice = () => {
  return (
    <p className="text-center text-xs leading-5 text-gray-400">
      By continuing, you agree to our{" "}
      <Link to="/terms" className="font-medium text-primary hover:underline">
        Terms & Conditions
      </Link>{" "}
      and{" "}
      <Link
        to="/privacy"
        className="font-medium text-primary hover:underline"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
};

export default TermsNotice;