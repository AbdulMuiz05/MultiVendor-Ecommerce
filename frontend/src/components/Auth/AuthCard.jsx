import React from "react";

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-soft sm:p-8">
      <div className="text-center">
        <h1 className="font-poppins text-2xl font-extrabold text-secondary">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-sm leading-6 text-gray-500">{subtitle}</p>
        )}
      </div>

      <div className="mt-7">{children}</div>
    </div>
  );
};

export default AuthCard;