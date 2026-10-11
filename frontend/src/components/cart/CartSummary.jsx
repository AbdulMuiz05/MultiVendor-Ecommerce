import React from "react";
import { FiArrowRight, FiTag } from "react-icons/fi";

const CartSummary = ({
  subtotal = 0,
  shipping = 0,
  discount = 0,
  onCheckout,
}) => {
  const total = Math.max(0, subtotal + shipping - discount);

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
      <h2 className="font-poppins text-xl font-bold text-secondary">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold text-secondary">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Shipping</span>
          <span className="font-semibold text-secondary">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600">
            <span className="flex items-center gap-2">
              <FiTag size={15} />
              Discount
            </span>
            <span className="font-semibold">
              -${discount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="my-6 border-t border-dashed border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-secondary">Total</span>
        <span className="font-poppins text-2xl font-extrabold text-primary">
          ${total.toFixed(2)}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="btn-primary mt-6 w-full gap-2"
      >
        Proceed to Checkout
        <FiArrowRight size={18} />
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-gray-400">
        Taxes and final shipping charges may be calculated at checkout.
      </p>
    </div>
  );
};

export default CartSummary;