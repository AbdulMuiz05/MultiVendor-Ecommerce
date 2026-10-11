import React from "react";
import { FiCheckCircle, FiShoppingBag, FiShield, FiHeart } from "react-icons/fi";

const SignInBenefits = () => {
  const benefits = [
    {
      icon: FiShoppingBag,
      title: "Easy Shopping",
      description: "Manage your shopping from one place.",
    },
    {
      icon: FiHeart,
      title: "Your Wishlist",
      description: "Keep your favorite products saved.",
    },
    {
      icon: FiShield,
      title: "Secure Account",
      description: "Your account and orders stay protected.",
    },
  ];

  return (
    <div className="rounded-3xl bg-secondary p-7 text-white shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <FiCheckCircle size={24} />
      </div>

      <h2 className="mt-5 font-poppins text-2xl font-bold">
        Welcome back to Eshop
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-300">
        Sign in to continue shopping and manage your account.
      </p>

      <div className="mt-7 space-y-5">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="mt-0.5 text-primary">
              <Icon size={20} />
            </div>

            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignInBenefits;