import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, Button, Card, getError } from "./_pageUtils";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
    <div className="flex min-h-screen items-center justify-center bg-light p-5">
      <Card className="w-full max-w-md">
        <p className="text-sm font-semibold text-primary">Eshop</p>
        <h1 className="mt-2 font-poppins text-3xl font-extrabold text-secondary">
          Admin Login
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
            placeholder="Admin email"
            className="input-field"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            required
            type="password"
            placeholder="Admin password"
            className="input-field"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <Button disabled={busy} className="w-full">
            {busy ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
