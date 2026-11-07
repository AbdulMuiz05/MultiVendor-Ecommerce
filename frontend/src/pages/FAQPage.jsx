import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronDown,
  FiHelpCircle,
  FiMessageCircle,
  FiShoppingBag,
} from "react-icons/fi";

import { Shell } from "./_pageUtils";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Open a product, choose the quantity and add it to your cart. From the cart, continue to checkout, enter your delivery details and choose cash on delivery or online card payment. Your order is split by seller automatically when it contains products from multiple shops.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Sign in and open My Orders from the account menu. Each order has a tracking view showing its current status. You can also open the tracking page directly and paste the order ID from your order confirmation.",
  },
  {
    question: "Can I request a refund?",
    answer:
      "Refunds can be requested from the order details page after an order has been marked Delivered. Provide a reason and the seller will review the request. Refund availability and processing are managed by the seller and admin workflows.",
  },
  {
    question: "Are payments secure?",
    answer:
      "Online payments are processed by Stripe, and card details are handled directly by Stripe rather than being stored by this marketplace. Cash on delivery is also available where sellers support it.",
  },
  {
    question: "How do I contact a seller?",
    answer:
      "Open a product and use Ask the seller, or go to Messages from your account menu. Conversations are tied to your account so sellers can reply to you directly.",
  },
  {
    question: "How do I become a seller?",
    answer:
      "Use Become a Seller and complete the shop registration form. After submitting, check your email for the seller activation link. Once activated, sign in through the seller portal to manage products, events, orders and coupons.",
  },
  {
    question: "Where is my wishlist stored?",
    answer:
      "The wishlist is currently stored in this browser on this device. It updates the navbar count immediately, but it is not synced to your account across devices.",
  },
  {
    question: "Can I review a product more than once?",
    answer:
      "Each signed-in customer can submit one review per product. If you have already reviewed a product, the review form is replaced with a confirmation so ratings stay trustworthy.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);

  return (
    <Shell>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <FiHelpCircle size={14} />
            Help centre
          </span>

          <h1 className="mt-4 font-poppins text-3xl font-extrabold text-secondary sm:text-5xl">
            Frequently asked questions
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            Answers about shopping, events, payments, deliveries and selling
            on the marketplace.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((item, index) => {
            const active = open === index;

            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-2xl border bg-white shadow-card transition ${
                  active ? "border-primary/20" : "border-gray-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(active ? -1 : index)}
                  aria-expanded={active}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="font-poppins text-sm font-bold text-secondary sm:text-base">
                    {item.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                      active
                        ? "bg-primary text-white"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <FiChevronDown
                      size={16}
                      className={`transition ${
                        active ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {active && (
                  <div className="px-5 pb-5 text-sm leading-7 text-gray-600 sm:px-6">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-secondary p-6 text-white">
            <FiShoppingBag className="text-primary" size={22} />

            <h2 className="mt-4 font-poppins text-lg font-bold">
              Ready to start shopping?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-300">
              Explore products from sellers across the marketplace.
            </p>

            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Browse products
              <FiArrowRight />
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <FiMessageCircle className="text-primary" size={22} />

            <h2 className="mt-4 font-poppins text-lg font-bold text-secondary">
              Still need help?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Start a conversation with the seller from any product page, or
              check your order details for refund options.
            </p>

            <Link
              to="/orders"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Open my orders
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
