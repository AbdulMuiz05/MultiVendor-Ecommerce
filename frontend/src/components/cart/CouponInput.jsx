import React, { useState } from "react";
import { FiCheck, FiTag } from "react-icons/fi";

const CouponInput = ({ onApply, loading = false }) => {
  const [code, setCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedCode = code.trim();

    if (!trimmedCode) return;

    onApply?.(trimmedCode);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card"
    >
      <div className="flex items-center gap-2">
        <FiTag size={19} className="text-primary" />

        <h3 className="font-semibold text-secondary">Have a coupon?</h3>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter coupon code"
          className="input-field min-w-0 flex-1"
        />

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Applying..." : "Apply"}
          {!loading && <FiCheck size={16} />}
        </button>
      </div>
    </form>
  );
};

export default CouponInput;