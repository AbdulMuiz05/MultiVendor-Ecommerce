import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";

import { Button, api, getError } from "./_pageUtils";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await api.post("/admin/login", form);
      localStorage.setItem("admin", "true");
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-5">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-300 transition hover:text-white"
        >
          <FiArrowLeft size={14} />
          Back to storefront
        </Link>

        <div className="mt-5 rounded-3xl bg-white p-7 shadow-soft sm:p-9">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FiShield size={22} />
          </span>

          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-primary">
            Eshop admin
          </p>

          <h1 className="mt-2 font-poppins text-3xl font-extrabold text-secondary">
            Admin sign in
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Restricted access for marketplace administrators.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                Admin email
              </span>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  className="input-field pl-11"
                  placeholder="admin@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </span>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  className="input-field px-11"
                  placeholder="Admin password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </label>

            <Button disabled={busy} className="w-full">
              {busy ? "Signing in..." : "Sign in to admin"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5 text-xs">
            <Link
              to="/login"
              className="font-semibold text-gray-400 transition hover:text-primary"
            >
              Customer login
            </Link>

            <Link
              to="/shop-login"
              className="font-semibold text-gray-400 transition hover:text-primary"
            >
              Seller login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
