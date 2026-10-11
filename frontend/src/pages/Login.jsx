import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import axios from "axios";
import { API_URL } from "../server";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/user/login`,
        form,
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify(data.user || {}));
      nav("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Login failed"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-light lg:grid-cols-2">
      <section className="hidden bg-secondary p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <Link
          to="/"
          className="font-poppins text-2xl font-extrabold"
        >
          Eshop<span className="text-primary">.</span>
        </Link>

        <div className="mt-20 max-w-xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Welcome back
          </p>
          <h1 className="mt-4 font-poppins text-5xl font-extrabold leading-tight">
            Your next great find is waiting.
          </h1>
          <p className="mt-6 text-gray-300">
            Sign in to manage your orders, wishlist and shopping experience.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="font-poppins text-2xl font-extrabold text-secondary lg:hidden"
          >
            Eshop<span className="text-primary">.</span>
          </Link>

          <div className="mt-10 rounded-3xl border border-gray-100 bg-white p-7 shadow-soft sm:p-9">
            <p className="text-sm font-semibold text-primary">
              Account access
            </p>

            <h2 className="mt-2 font-poppins text-3xl font-extrabold text-secondary">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Continue to your Eshop account.
            </p>

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-7 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </span>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
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
                    type={show ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="input-field px-11"
                    placeholder="Your password"
                  />

                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {show ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </label>

              <button
                disabled={busy}
                className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="font-semibold text-primary"
              >
                Create one
              </Link>
            </p>

            <p className="mt-3 text-center">
              <Link
                to="/shop-login"
                className="text-xs font-semibold text-gray-400 hover:text-primary"
              >
                Seller login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}