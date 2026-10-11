import React from "react";

const AuthMessage = ({ type = "error", message }) => {
  if (!message) return null;

  const styles =
    type === "success"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : "border-red-100 bg-red-50 text-red-600";

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${styles}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default AuthMessage;