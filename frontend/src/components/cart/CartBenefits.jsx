import React from "react";
import { FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";

const CartBenefits = () => {
  const benefits = [
    {
      icon: FiTruck,
      title: "Fast Delivery",
      description: "Quick and reliable doorstep delivery",
    },
    {
      icon: FiShield,
      title: "Secure Payment",
      description: "Your payment information stays protected",
    },
    {
      icon: FiRefreshCw,
      title: "Easy Returns",
      description: "Simple and convenient return process",
    },
  ];

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {benefits.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={20} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-secondary">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CartBenefits;