import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  api,
  Button,
  Card,
  Field,
  TextArea,
  getError,
  money,
} from "./_pageUtils";

export default function CheckoutPage() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    country: "Pakistan",
    city: "",
    address1: "",
    address2: "",
    zipCode: "",
    addressType: "Home",
  });

  const [method, setMethod] = useState("COD");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [cart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eshop_cart") || "[]");
    } catch {
      return [];
    }
  });

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.discountPrice || item.price || 0) *
        Number(item.qty || 1),
    0
  );

  const submit = async (event) => {
    event.preventDefault();

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!form.city || !form.address1) {
      setError("City and address are required.");
      return;
    }

    setBusy(true);
    setError("");

    const checkout = {
      cart,
      shippingAddress: form,
      paymentInfo: {
        type: method,
        status: method === "COD" ? "Pending" : "Processing",
      },
    };

    try {
      if (method === "Stripe") {
        localStorage.setItem(
          "eshop_pending_checkout",
          JSON.stringify(checkout)
        );
        nav(`/payment?amount=${encodeURIComponent(total)}`);
        return;
      }

      const response = await api.post("/order/create-order", checkout);

      localStorage.removeItem("eshop_cart");
      localStorage.removeItem("eshop_pending_checkout");

      nav(
        `/order-success?order=${response.data.orders?.[0]?._id || ""}`
      );
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <div className="container-app py-8">
        <Link
          to="/"
          className="font-poppins text-2xl font-extrabold text-secondary"
        >
          Eshop<span className="text-primary">.</span>
        </Link>

        <form
          onSubmit={submit}
          className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          <Card>
            <h1 className="font-poppins text-2xl font-bold text-secondary">
              Shipping details
            </h1>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field
                label="Country"
                value={form.country}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
              />

              <Field
                label="City"
                required
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
              />

              <TextArea
                label="Address"
                required
                className="sm:col-span-2"
                value={form.address1}
                onChange={(e) =>
                  setForm({ ...form, address1: e.target.value })
                }
              />

              <Field
                label="Apartment / Area"
                value={form.address2}
                onChange={(e) =>
                  setForm({ ...form, address2: e.target.value })
                }
              />

              <Field
                label="ZIP code"
                value={form.zipCode}
                onChange={(e) =>
                  setForm({ ...form, zipCode: e.target.value })
                }
              />
            </div>

            <h2 className="mt-8 font-poppins text-lg font-bold text-secondary">
              Payment method
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["COD", "Stripe"].map((paymentMethod) => (
                <button
                  type="button"
                  key={paymentMethod}
                  onClick={() => setMethod(paymentMethod)}
                  className={`rounded-xl border p-4 text-left ${
                    method === paymentMethod
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-semibold text-secondary">
                    {paymentMethod}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {paymentMethod === "COD"
                      ? "Pay when delivered"
                      : "Pay securely with Stripe"}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="h-fit">
            <h2 className="font-poppins text-xl font-bold text-secondary">
              Order summary
            </h2>

            <div className="mt-5 space-y-3">
              {cart.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="line-clamp-1 text-gray-500">
                    {item.name} × {item.qty || 1}
                  </span>

                  <span className="font-semibold">
                    {money(
                      Number(item.discountPrice || item.price || 0) *
                        Number(item.qty || 1)
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t pt-5 font-bold text-secondary">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>

            <Button
              disabled={busy || !cart.length}
              className="mt-5 w-full"
            >
              {busy
                ? "Processing..."
                : method === "Stripe"
                ? `Continue to Payment · ${money(total)}`
                : `Place Order · ${money(total)}`}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
}
