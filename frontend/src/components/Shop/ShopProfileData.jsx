import React, { useState } from "react";

const ShopProfileData = ({ shop, onSubmit }) => {
  const [form, setForm] = useState({
    name: shop?.name || "",
    email: shop?.email || "",
    phoneNumber: shop?.phoneNumber || "",
    address: shop?.address || "",
    zipCode: shop?.zipCode || "",
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
      <h2 className="mb-6 text-2xl font-semibold">Shop Profile</h2>

      <div className="grid gap-5 md:grid-cols-2">
        {Object.entries(form).map(([name, value]) => (
          <div key={name}>
            <label className="mb-2 block text-sm font-medium capitalize">
              {name.replace(/([A-Z])/g, " $1")}
            </label>

            <input
              name={name}
              value={value}
              onChange={handleChange}
              disabled={name === "email"}
              className="w-full rounded-md border px-4 py-3 outline-none disabled:bg-gray-100 focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Update Profile
      </button>
    </form>
  );
};

export default ShopProfileData;