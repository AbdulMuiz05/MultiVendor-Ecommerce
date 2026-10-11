import React, { useState } from "react";

const WithdrawMoney = ({ availableBalance = 0, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = Number(amount);

    if (!value || value <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (value > Number(availableBalance)) {
      setError("Insufficient balance.");
      return;
    }

    setError("");
    onSubmit?.(value);
  };

  return (
    <div className="max-w-xl rounded-xl border bg-white p-6">
      <h2 className="text-2xl font-semibold">Withdraw Money</h2>

      <div className="mt-5 rounded-lg bg-gray-50 p-5">
        <p className="text-sm text-gray-500">Available Balance</p>
        <p className="mt-1 text-3xl font-bold text-gray-800">
          ${Number(availableBalance).toFixed(2)}
        </p>
      </div>

      {error && (
        <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        <label className="mb-2 block text-sm font-medium">
          Withdrawal Amount
        </label>

        <input
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full rounded-md border px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
        >
          Request Withdrawal
        </button>
      </form>
    </div>
  );
};

export default WithdrawMoney;