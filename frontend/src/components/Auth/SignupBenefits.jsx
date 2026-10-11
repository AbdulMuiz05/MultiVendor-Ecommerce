import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const SignupBenefits = () => {
  const benefits = [
    "Access thousands of products",
    "Save your favorite products",
    "Track your orders easily",
    "Enjoy exclusive marketplace offers",
  ];

  return (
    <div className="rounded-3xl bg-secondary p-7 text-white shadow-soft">
      <h2 className="font-poppins text-2xl font-bold">
        Shop smarter with Eshop
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-300">
        Create your account and enjoy a smooth, secure shopping experience.
      </p>

      <div className="mt-6 space-y-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-3">
            <FiCheckCircle className="shrink-0 text-primary" size={19} />

            <span className="text-sm text-gray-200">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignupBenefits;