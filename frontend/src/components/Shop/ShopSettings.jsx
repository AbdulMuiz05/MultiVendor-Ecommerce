import React, { useState } from "react";

const ShopSettings = ({ shop, onSubmit }) => {
  const [form, setForm] = useState({
    name: shop?.name || "",
    description: shop?.description || "",
    address: shop?.address || "",
    phoneNumber: shop?.phoneNumber || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6">
      <h2 className="mb-6 text-2xl font-semibold">Shop Settings</h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Shop Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            className="w-full rounded-md border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full rounded-md border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Phone Number</label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full rounded-md border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Save Settings
      </button>
    </form>
  );
};

export default ShopSettings;