import React from "react";
import { Link } from "react-router-dom";

const AuthFooter = ({ text, linkText, linkTo }) => {
  return (
    <p className="mt-6 text-center text-sm text-gray-500">
      {text}{" "}
      <Link
        to={linkTo}
        className="font-semibold text-primary transition hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
};

export default AuthFooter;