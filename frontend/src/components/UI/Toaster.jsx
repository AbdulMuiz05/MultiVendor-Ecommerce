import React, { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const TOAST_EVENT = "eshop:toast";

export const notify = (message, type = "success") => {
  if (typeof window === "undefined" || !message) return;

  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { message, type },
    })
  );
};

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
};

const tones = {
  success: "border-emerald-100 bg-white text-emerald-600",
  error: "border-red-100 bg-white text-red-500",
  info: "border-sky-100 bg-white text-sky-600",
};

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const detail = event.detail || {};

      setToasts((current) => [
        ...current.slice(-2),
        {
          id,
          message: detail.message,
          type: detail.type || "success",
        },
      ]);

      window.setTimeout(() => {
        setToasts((current) =>
          current.filter((toast) => toast.id !== id)
        );
      }, 3400);
    };

    window.addEventListener(TOAST_EVENT, handleToast);

    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || FiInfo;

        return (
          <div
            key={toast.id}
            className={`toast-item flex items-start gap-3 rounded-2xl border p-4 shadow-soft ${
              tones[toast.type] || tones.info
            }`}
          >
            <Icon className="mt-0.5 shrink-0" size={19} />

            <p className="flex-1 text-sm font-medium text-secondary">
              {toast.message}
            </p>

            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() =>
                setToasts((current) =>
                  current.filter((item) => item.id !== toast.id)
                )
              }
              className="text-gray-400 transition hover:text-secondary"
            >
              <FiX size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
