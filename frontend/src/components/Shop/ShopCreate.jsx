import React, { useState } from "react";

const ShopCreate = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    zipCode: "",
    password: "",
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-xl border bg-white p-6">
      <h2 className="mb-6 text-2xl font-bold">Create Shop</h2>

      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["name", "Shop Name"],
          ["email", "Email"],
          ["phoneNumber", "Phone Number"],
          ["address", "Address"],
          ["zipCode", "Zip Code"],
          ["password", "Password"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="mb-2 block text-sm font-medium">{label}</label>

            <input
              name={name}
              type={name === "email" ? "email" : name === "password" ? "password" : "text"}
              value={form[name]}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Create Shop
      </button>
    </form>
  );
};

export default ShopCreate;