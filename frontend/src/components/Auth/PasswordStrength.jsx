import React from "react";

const PasswordStrength = ({ password = "" }) => {
  const getStrength = () => {
    let score = 0;

    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return score;
  };

  const strength = getStrength();

  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className={`h-1.5 flex-1 rounded-full ${
              item <= strength ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="mt-1 text-xs text-gray-500">
        {labels[strength] || "Very weak"}
      </p>
    </div>
  );
};

export default PasswordStrength;