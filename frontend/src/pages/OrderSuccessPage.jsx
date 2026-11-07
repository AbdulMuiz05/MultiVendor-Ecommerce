import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiHome,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";

import { Shell } from "./_pageUtils";

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const count = Number(params.get("count") || 0);

  return (
    <Shell>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-soft sm:p-12">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <FiCheckCircle size={44} />
          </span>

          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-primary">
            Order confirmed
          </p>

          <h1 className="mt-2 font-poppins text-3xl font-extrabold text-secondary sm:text-4xl">
            Thank you for your purchase
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Your order has been placed successfully. Sellers will process it
            shortly and you can follow its progress from your orders page.
          </p>

          {orderId && (
            <div className="mt-6 rounded-2xl bg-gray-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Order reference
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-secondary">
                {orderId}
              </p>

              {count > 1 && (
                <p className="mt-2 text-xs text-gray-500">
                  This purchase created {count} orders because it includes
                  products from multiple sellers.
                </p>
              )}
            </div>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {orderId ? (
              <Link
                to={`/order/${orderId}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary"
              >
                <FiPackage />
                View order
              </Link>
            ) : (
              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary"
              >
                <FiPackage />
                My orders
              </Link>
            )}

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
            >
              <FiShoppingBag />
              Continue shopping
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-400">
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 transition hover:text-primary"
            >
              <FiPackage size={13} />
              All orders
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 transition hover:text-primary"
            >
              <FiHome size={13} />
              Back to home
              <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
