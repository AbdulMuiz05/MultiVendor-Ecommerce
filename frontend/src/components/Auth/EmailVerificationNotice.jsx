import React from "react";
import { FiMail } from "react-icons/fi";

const EmailVerificationNotice = ({ email }) => {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-card">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <FiMail size={28} />
      </div>

      <h2 className="mt-5 font-poppins text-2xl font-bold text-secondary">
        Check your email
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        We sent an activation link to{" "}
        <span className="font-semibold text-secondary">
          {email || "your email address"}
        </span>
        .
      </p>

      <p className="mt-2 text-xs leading-5 text-gray-400">
        Open the email and follow the activation link to continue.
      </p>
    </div>
  );
};

export default EmailVerificationNotice;