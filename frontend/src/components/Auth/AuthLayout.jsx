import React from "react";
import AuthLogo from "./AuthLogo";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5">
      <div className="container-app flex min-h-screen flex-col">
        <div className="flex items-center justify-between py-6">
          <AuthLogo />
        </div>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            {(title || subtitle) && (
              <div className="mb-7 text-center">
                {title && (
                  <h1 className="font-poppins text-3xl font-extrabold text-secondary">
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {children}
          </div>
        </main>

        <div className="py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Eshop. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;