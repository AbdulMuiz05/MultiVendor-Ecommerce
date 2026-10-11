import React, { useState } from "react";
import { useSelector } from "react-redux";

const ProfileContent = () => {
  const { user } = useSelector((state) => state.user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
      <h2 className="font-poppins text-2xl font-bold text-secondary">
        Account Information
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileContent;