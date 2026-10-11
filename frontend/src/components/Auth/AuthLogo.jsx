import React from "react";
import { Link } from "react-router-dom";

const AuthLogo = () => {
  return (
    <Link
      to="/"
      className="inline-block font-poppins text-3xl font-extrabold tracking-tight text-secondary"
    >
      E<span className="text-primary">shop</span>
    </Link>
  );
};

export default AuthLogo;
