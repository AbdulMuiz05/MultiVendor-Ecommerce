import React from "react";
import { FiCheck, FiX } from "react-icons/fi";

const STEPS = [
  { key: "Processing", label: "Order placed" },
  { key: "Transferred to delivery partner", label: "Packed" },
  { key: "Shipping", label: "Shipped" },
  { key: "On the way", label: "Out for delivery" },
  { key: "Delivered", label: "Delivered" },
];

const indexForStatus = (status) => {
  switch (status) {
    case "Delivered":
      return 4;
    case "On the way":
      return 3;
    case "Shipping":
    case "Received":
      return 2;
    case "Transferred to delivery partner":
      return 1;
    default:
      return 0;
  }
};

export default function OrderTimeline({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
          <FiX size={16} />
        </span>
        This order was cancelled.
      </div>
    );
  }

  const current = indexForStatus(status);

  return (
    <ol className="mt-2 grid gap-4 sm:grid-cols-5 sm:gap-2">
      {STEPS.map((step, index) => {
        const complete = index <= current;
        const active = index === current;

        return (
          <li key={step.key} className="relative flex gap-3 sm:block">
            <div className="flex flex-col items-center sm:flex-row">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                  complete
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                {complete ? <FiCheck size={14} /> : index + 1}
              </span>

              <span
                className={`hidden h-0.5 flex-1 sm:block ${
                  index === STEPS.length - 1
                    ? "bg-transparent"
                    : complete
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}
              />
            </div>

            <p
              className={`text-xs font-semibold sm:mt-2 ${
                active
                  ? "text-primary"
                  : complete
                  ? "text-secondary"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
