import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

import { Button, api, getError } from "./_pageUtils";

const benefits = [
  "Save products to your wishlist",
  "Track orders from checkout to delivery",
  "Chat directly with sellers",
  "Secure cookie-based sign in",
];

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));

    if (fieldErrors[key]) {
      setFieldErrors((current) => ({ ...current, [key]: "" }));
    }
  };

  const validate = () => {
    const next = {};

    if (form.name.trim().length < 2) {
      next.name = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (form.password.length < 6) {
      next.password = "Use at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(next);

    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validate()) {
      setError("Please correct the highlighted fields.");
      return;
    }

    setBusy(true);

    try {
      const response = await api.post("/user/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setMessage(
        response.data.message ||
          `Check ${form.email} to activate your account.`
      );
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setBusy(false);
    }
  };

  if (message) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light p-5">
        <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-9 text-center shadow-soft">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <FiCheckCircle size={34} />
          </span>

          <h1 className="mt-5 font-poppins text-2xl font-extrabold text-secondary">
            Check your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">{message}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Go to sign in
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
            >
              <FiArrowLeft />
              Back to home
            </Link>
          </div>

          <p className="mt-6 text-xs leading-5 text-gray-400">
            The activation link expires shortly. If it does, contact support
            to request a new link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-light lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-secondary p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative">
          <Link to="/" className="font-poppins text-2xl font-extrabold">
            E<span className="text-primary">shop</span>
          </Link>

          <p className="mt-16 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Join Eshop
          </p>

          <h1 className="mt-4 font-poppins text-5xl font-extrabold leading-tight">
            Create your marketplace account.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-gray-300">
            One account for shopping, saved products, order tracking and
            conversations with sellers.
          </p>

          <ul className="mt-10 space-y-4">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 text-sm text-gray-200"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <FiCheck size={13} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between lg:hidden">
            <Link
              to="/"
              className="font-poppins text-2xl font-extrabold text-secondary"
            >
              E<span className="text-primary">shop</span>
            </Link>

            <Link
              to="/login"
              className="text-xs font-semibold text-primary"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-100 bg-white p-7 shadow-soft sm:p-9 lg:mt-0">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              New account
            </p>

            <h2 className="mt-2 font-poppins text-3xl font-extrabold text-secondary">
              Sign up
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create an account to start shopping.
            </p>

            {error && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Full name
                </span>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    value={form.name}
                    onChange={(event) =>
                      setField("name", event.target.value)
                    }
                    className={`input-field pl-11 ${
                      fieldErrors.name ? "border-red-300" : ""
                    }`}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>

                {fieldErrors.name && (
                  <span className="mt-1.5 block text-xs text-red-600">
                    {fieldErrors.name}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Email address
                </span>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setField("email", event.target.value)
                    }
                    className={`input-field pl-11 ${
                      fieldErrors.email ? "border-red-300" : ""
                    }`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                {fieldErrors.email && (
                  <span className="mt-1.5 block text-xs text-red-600">
                    {fieldErrors.email}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </span>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) =>
                      setField("password", event.target.value)
                    }
                    className={`input-field px-11 ${
                      fieldErrors.password ? "border-red-300" : ""
                    }`}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
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

                {fieldErrors.password && (
                  <span className="mt-1.5 block text-xs text-red-600">
                    {fieldErrors.password}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Confirm password
                </span>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setField("confirmPassword", event.target.value)
                    }
                    className={`input-field pl-11 ${
                      fieldErrors.confirmPassword ? "border-red-300" : ""
                    }`}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                  />
                </div>

                {fieldErrors.confirmPassword && (
                  <span className="mt-1.5 block text-xs text-red-600">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </label>

              <Button disabled={busy} className="mt-2 w-full">
                {busy ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-5 border-t border-gray-100 pt-5 text-center text-xs leading-5 text-gray-400">
              After signing up you will receive an activation email. Your
              account becomes available once activated.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
