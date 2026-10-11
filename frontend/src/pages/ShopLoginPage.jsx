import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, Button, Card, getError } from "./_pageUtils";

export default function ShopLoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const { data } = await api.post("/shop/login-shop", form);

      const shop = data.shop || {};

      localStorage.setItem("seller", JSON.stringify(shop));

      navigate(`/shop/${shop._id}/dashboard`);
    } catch (error) {
      setError(getError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-5">
      <Card className="w-full max-w-md">
        <Link
          to="/"
          className="font-poppins text-2xl font-extrabold text-secondary"
        >
          Eshop<span className="text-primary">.</span>
        </Link>

        <p className="mt-8 text-sm font-semibold text-primary">
          Seller portal
        </p>

        <h1 className="mt-2 font-poppins text-3xl font-extrabold text-secondary">
          Seller login
        </h1>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            required
            type="email"
            className="input-field"
            placeholder="Shop email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            required
            type="password"
            className="input-field"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <Button disabled={busy} className="w-full">
            {busy ? "Signing in..." : "Seller Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Need a shop?{" "}
          <Link
            to="/shop-create"
            className="font-semibold text-primary"
          >
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}