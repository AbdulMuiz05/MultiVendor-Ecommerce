import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";

import { api, getError } from "./_pageUtils";
import { userLoginSuccess } from "../redux/actions/user";
import { notify } from "../components/UI/Toaster";

const highlights = [
  {
    icon: FiShoppingBag,
    title: "Everything in one place",
    text: "Discover products from trusted sellers across the marketplace.",
  },
  {
    icon: FiTruck,
    title: "Track every order",
    text: "Follow your purchases from confirmation to delivery.",
  },
  {
    icon: FiShield,
    title: "Secure account",
    text: "Your session is protected with secure cookie authentication.",
  },
];

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const { data } = await api.post("/user/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const user = { ...(data.user || {}) };
      delete user.password;

      dispatch({ type: userLoginSuccess, payload: user });
      notify(`Welcome back${user.name ? `, ${user.name.split(" ")[0]}` : ""}.`);

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-light lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-secondary p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative">
          <Link to="/" className="font-poppins text-2xl font-extrabold">
            E<span className="text-primary">shop</span>
          </Link>

          <div className="mt-16 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Welcome back
            </p>

            <h1 className="mt-4 font-poppins text-5xl font-extrabold leading-tight">
              Your next great find is waiting.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-300">
              Sign in to continue shopping, revisit your wishlist and keep an
              eye on every order.
            </p>
          </div>

          <ul className="mt-12 space-y-5">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary">
                    <Icon size={19} />
                  </span>

                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs leading-6 text-gray-400">
                      {item.text}
                    </p>
                  </div>
                </li>
              );
            })}
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
              to="/products"
              className="text-xs font-semibold text-gray-500"
            >
              Continue shopping
            </Link>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-100 bg-white p-7 shadow-soft sm:p-9 lg:mt-0">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Account access
            </p>

            <h2 className="mt-2 font-poppins text-3xl font-extrabold text-secondary">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Continue to your Eshop account.
            </p>

            {error && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-7 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Email address
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
                    placeholder="you@example.com"
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
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(event) =>
                      setForm({ ...form, password: event.target.value })
                    }
                    className="input-field px-11"
                    placeholder="Your password"
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

              <button
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Signing in..." : "Sign in"}
                {!busy && <FiArrowRight size={16} />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="font-semibold text-primary hover:underline"
              >
                Create one
              </Link>
            </p>

            <div className="mt-6 border-t border-gray-100 pt-5 text-center">
              <Link
                to="/shop-login"
                className="text-xs font-semibold text-gray-400 transition hover:text-primary"
              >
                Selling on Eshop? Seller login
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            <Link to="/" className="transition hover:text-primary">
              Back to storefront
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
