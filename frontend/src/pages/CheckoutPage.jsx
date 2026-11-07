import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiCheck,
  FiCreditCard,
  FiLock,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

import {
  Button,
  Card,
  Shell,
  api,
  getError,
  imageUrl,
  money,
} from "./_pageUtils";
import { clearCart } from "../redux/actions/cart";
import { productPrice } from "../utils/format";
import { notify } from "../components/UI/Toaster";

const paymentMethods = [
  {
    value: "COD",
    label: "Cash on delivery",
    description: "Pay when your order arrives.",
    icon: FiTruck,
  },
  {
    value: "Stripe",
    label: "Pay online",
    description: "Secure card payment powered by Stripe.",
    icon: FiCreditCard,
  },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user.user);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phoneNumber || "",
    country: "India",
    city: "",
    address1: "",
    address2: "",
    zipCode: "",
    addressType: "Home",
  });

  const [method, setMethod] = useState("COD");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const submitting = useRef(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: current.name || user?.name || "",
      phone: current.phone || user?.phoneNumber || "",
    }));
  }, [user]);

  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0
  );

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + productPrice(item) * Number(item.qty || 1),
        0
      ),
    [cart]
  );

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));

    if (fieldErrors[key]) {
      setFieldErrors((current) => ({ ...current, [key]: "" }));
    }
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = "Enter the recipient's full name.";
    if (!form.phone.trim()) next.phone = "Enter a contact phone number.";
    if (!form.city.trim()) next.city = "Enter your city.";
    if (!form.address1.trim()) next.address1 = "Enter your street address.";

    if (form.phone.trim() && form.phone.replace(/\D/g, "").length < 7) {
      next.phone = "Enter a valid phone number.";
    }

    setFieldErrors(next);

    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!validate()) {
      setError("Please complete the highlighted fields.");
      return;
    }

    setBusy(true);
    setError("");

    const checkout = {
      cart,
      shippingAddress: {
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address1: form.address1.trim(),
      },
      paymentInfo: {
        type: method,
      },
    };

    if (submitting.current) return;

    submitting.current = true;
    setBusy(true);
    setError("");

    try {
      if (method === "Stripe") {
        localStorage.setItem(
          "eshop_pending_checkout",
          JSON.stringify(checkout)
        );
        navigate("/payment");
        return;
      }

      const response = await api.post("/order/create-order", checkout);
      const orders = response.data.orders || [];

      localStorage.removeItem("eshop_pending_checkout");
      dispatch(clearCart());

      notify("Order placed successfully.");

      navigate(
        `/order-success?order=${orders[0]?._id || ""}&count=${orders.length}`
      );
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  if (!cart.length) {
    return (
      <Shell title="Checkout">
        <Card className="py-16 text-center">
          <FiPackage className="mx-auto text-gray-300" size={48} />
          <h2 className="mt-5 font-poppins text-xl font-bold text-secondary">
            Nothing to check out
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Add products to your cart before continuing to checkout.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Browse products
          </Link>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell back>
      <div className="mb-8">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-2 font-poppins text-3xl font-extrabold text-secondary sm:text-4xl">
          Complete your order
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review your delivery details and choose how you would like to pay.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-6 lg:grid-cols-[1fr_380px]"
        noValidate
      >
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-poppins text-lg font-bold text-secondary">
                Delivery details
              </h2>

              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                <FiLock size={13} />
                Encrypted
              </span>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Full name
                </span>
                <input
                  className={`input-field ${
                    fieldErrors.name ? "border-red-300" : ""
                  }`}
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  placeholder="Recipient name"
                  autoComplete="name"
                />
                {fieldErrors.name && (
                  <span className="mt-1.5 block text-xs text-red-600">
                    {fieldErrors.name}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone number
                </span>
                <input
                  className={`input-field ${
                    fieldErrors.phone ? "border-red-300" : ""
                  }`}
                  value={form.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  placeholder="+91 98765 43210"
                  inputMode="tel"
                  autoComplete="tel"
                />
                {fieldErrors.phone && (
                  <span className="mt-1.5 block text-xs text-red-600">
                    {fieldErrors.phone}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Country
                </span>
                <input
                  className="input-field"
                  value={form.country}
                  onChange={(event) =>
                    setField("country", event.target.value)
                  }
                  autoComplete="country-name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  City
                </span>
                <input
                  className={`input-field ${
                    fieldErrors.city ? "border-red-300" : ""
                  }`}
                  value={form.city}
                  onChange={(event) => setField("city", event.target.value)}
                  placeholder="City"
                  autoComplete="address-level2"
                />
                {fieldErrors.city && (
                  <span className="mt-1.5 block text-xs text-red-600">
                    {fieldErrors.city}
                  </span>
                )}
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Street address
                </span>
                <textarea
                  className={`input-field min-h-24 resize-y ${
                    fieldErrors.address1 ? "border-red-300" : ""
                  }`}
                  value={form.address1}
                  onChange={(event) =>
                    setField("address1", event.target.value)
                  }
                  placeholder="House number, street, area"
                  autoComplete="street-address"
                />
                {fieldErrors.address1 && (
                  <span className="mt-1.5 block text-xs text-red-600">
                    {fieldErrors.address1}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  Apartment / landmark{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </span>
                <input
                  className="input-field"
                  value={form.address2}
                  onChange={(event) =>
                    setField("address2", event.target.value)
                  }
                  placeholder="Apartment, suite, landmark"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">
                  ZIP / postal code
                </span>
                <input
                  className="input-field"
                  value={form.zipCode}
                  onChange={(event) =>
                    setField("zipCode", event.target.value)
                  }
                  placeholder="Postal code"
                  autoComplete="postal-code"
                />
              </label>
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                Address type
              </span>

              <div className="flex flex-wrap gap-2">
                {["Home", "Work", "Other"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setField("addressType", type)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      form.addressType === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Payment method
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((options) => {
                const Icon = options.icon;
                const active = method === options.value;

                return (
                  <button
                    key={options.value}
                    type="button"
                    onClick={() => setMethod(options.value)}
                    aria-pressed={active}
                    className={`relative flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Icon size={18} />
                    </span>

                    <span>
                      <span className="block text-sm font-semibold text-secondary">
                        {options.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-500">
                        {options.description}
                      </span>
                    </span>

                    {active && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                        <FiCheck size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:sticky lg:top-28 lg:h-fit">
          <Card>
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Order summary
            </h2>

            <ul className="mt-5 space-y-4">
              {cart.map((item) => (
                <li key={item._id} className="flex items-center gap-3">
                  <img
                    src={imageUrl(item.images?.[0])}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-secondary">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty {item.qty || 1} · {money(productPrice(item))}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-secondary">
                    {money(productPrice(item) * Number(item.qty || 1))}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-gray-100 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">
                  Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})
                </dt>
                <dd className="font-semibold text-secondary">{money(total)}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-gray-500">Delivery</dt>
                <dd className="font-medium text-gray-500">
                  Calculated at fulfillment
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-poppins text-lg font-bold text-secondary">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>

            <Button disabled={busy} className="mt-5 w-full">
              {busy
                ? "Placing order..."
                : method === "Stripe"
                ? `Continue to payment · ${money(total)}`
                : `Place order · ${money(total)}`}
            </Button>

            <Link
              to="/cart"
              className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-primary"
            >
              <FiArrowLeft size={15} />
              Back to cart
            </Link>

            <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">
              By placing this order you agree to the marketplace purchase and
              return policies.
            </p>
          </Card>
        </div>
      </form>
    </Shell>
  );
}
