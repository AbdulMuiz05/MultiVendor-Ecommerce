import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const ActivationCard = ({ success = false, message }) => {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-card">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
          success
            ? "bg-emerald-50 text-emerald-500"
            : "bg-red-50 text-red-500"
        }`}
      >
        {success ? <FiCheckCircle size={30} /> : <FiXCircle size={30} />}
      </div>

      <h2 className="mt-5 font-poppins text-2xl font-bold text-secondary">
        {success ? "Account Activated" : "Activation Failed"}
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {message ||
          (success
            ? "Your account has been activated successfully."
            : "The activation link is invalid or has expired.")}
      </p>

      <Link to="/login" className="btn-primary mt-6">
        Continue to Login
      </Link>
    </div>
  );
};

export default ActivationCard;