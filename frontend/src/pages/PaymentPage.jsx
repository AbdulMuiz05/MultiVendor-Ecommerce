import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FiArrowLeft, FiLock, FiShield } from "react-icons/fi";

import {
  Button,
  Card,
  Shell,
  api,
  getError,
  money,
} from "./_pageUtils";
import { clearCart } from "../redux/actions/cart";
import { productPrice } from "../utils/format";
import { notify } from "../components/UI/Toaster";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0f172a",
      fontFamily: "Inter, system-ui, sans-serif",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#dc2626" },
  },
};

function StripeForm({ clientSecret, checkout, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paidIntentId, setPaidIntentId] = useState(
    checkout.paymentIntentId || ""
  );
  const submitting = useRef(false);

  const savePaidIntent = (paymentIntent) => {
    let pending = {};

    try {
      pending =
        JSON.parse(localStorage.getItem("eshop_pending_checkout") || "null") ||
        {};
    } catch {
      pending = {};
    }

    setPaidIntentId(paymentIntent.id);
    localStorage.setItem(
      "eshop_pending_checkout",
      JSON.stringify({
        ...pending,
        ...checkout,
        paymentIntentId: paymentIntent.id,
        paymentIntentStatus: paymentIntent.status,
      })
    );
  };

  const createOrder = async (paymentIntentId) => {
    const response = await api.post("/order/create-order", {
      cart: checkout.cart,
      shippingAddress: checkout.shippingAddress,
      paymentInfo: {
        type: "Stripe",
        id: paymentIntentId,
      },
    });

    const orders = response.data.orders || [];

    localStorage.removeItem("eshop_pending_checkout");
    dispatch(clearCart());

    notify("Payment successful. Order placed.");

    navigate(
      `/order-success?order=${orders[0]?._id || ""}&count=${orders.length}`
    );
  };

  const pay = async (event) => {
    event.preventDefault();

    if (submitting.current) return;

    submitting.current = true;
    setBusy(true);
    setError("");

    try {
      let paymentIntentId = paidIntentId;

      if (!paymentIntentId) {
        if (!stripe || !elements) {
          throw new Error(
            "Stripe is still loading. Please try again in a moment."
          );
        }

        const card = elements.getElement(CardElement);

        if (!card) {
          throw new Error("Payment card form is unavailable.");
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card },
        });

        const paymentIntent =
          result.error?.payment_intent?.status === "succeeded"
            ? result.error.payment_intent
            : result.paymentIntent;

        if (result.error && !paymentIntent) {
          throw new Error(result.error.message);
        }

        if (paymentIntent?.status !== "succeeded") {
          throw new Error("Payment was not completed.");
        }

        paymentIntentId = paymentIntent.id;
        savePaidIntent(paymentIntent);
      }

      await createOrder(paymentIntentId);
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <form onSubmit={pay}>
      {paidIntentId ? (
        <p className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Payment received. Complete your order without being charged again.
        </p>
      ) : (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <CardElement options={cardElementOptions} />
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button
        disabled={busy || (!paidIntentId && !stripe)}
        className="mt-5 w-full"
      >
        <FiLock className="mr-2" />
        {busy
          ? "Processing payment..."
          : paidIntentId
          ? "Complete order"
          : `Pay ${money(amount)}`}
      </Button>

      <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-gray-400">
        <FiShield className="mt-0.5 shrink-0" />
        <p>
          Your card details are handled by Stripe and never stored on our
          servers.
        </p>
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [publishableKey, setPublishableKey] = useState("");
  const [serverAmount, setServerAmount] = useState(0);
  const [checkout] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("eshop_pending_checkout") || "null"
      );
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(checkout));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!checkout) return undefined;

    setLoading(true);

    const storedClientSecret = checkout.stripeClientSecret;
    const storedAmount = Number(checkout.stripeAmount || 0);
    const paymentRequest =
      storedClientSecret && storedAmount > 0
        ? Promise.resolve({
            data: {
              client_secret: storedClientSecret,
              displayAmount: storedAmount,
            },
          })
        : api.post("/payment/process", { cart: checkout.cart });

    Promise.all([api.get("/payment/stripeapikey"), paymentRequest])
      .then(([keyResponse, paymentResponse]) => {
        if (!active) return;

        const clientSecret = paymentResponse.data.client_secret;
        const displayAmount = Number(paymentResponse.data.displayAmount || 0);

        setPublishableKey(keyResponse.data.stripeApikey);
        setClientSecret(clientSecret);
        setServerAmount(displayAmount);

        if (!storedClientSecret || storedAmount <= 0) {
          localStorage.setItem(
            "eshop_pending_checkout",
            JSON.stringify({
              ...checkout,
              stripeClientSecret: clientSecret,
              stripeAmount: displayAmount,
            })
          );
        }
      })
      .catch((requestError) => {
        if (active) setError(getError(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [checkout]);

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey]
  );

  const itemCount = (checkout?.cart || []).reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0
  );

  if (!checkout) {
    return (
      <Shell title="Secure payment">
        <Card className="mx-auto max-w-lg py-14 text-center">
          <h2 className="font-poppins text-xl font-bold text-secondary">
            No payment in progress
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Start a checkout to continue to secure payment.
          </p>
          <Link
            to="/checkout"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Return to checkout
          </Link>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell back>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="eyebrow">Secure payment</p>
          <h1 className="mt-2 font-poppins text-3xl font-extrabold text-secondary sm:text-4xl">
            Complete payment
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {itemCount} item{itemCount === 1 ? "" : "s"} · your order ships
            after payment is confirmed.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-poppins text-lg font-bold text-secondary">
                Card details
              </h2>

              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                <FiLock size={13} />
                Secure
              </span>
            </div>

            {loading ? (
              <div className="mt-6 flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl bg-gray-50">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
                <p className="text-sm text-gray-500">
                  Preparing secure payment...
                </p>
              </div>
            ) : error ? (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-5 text-sm text-red-600">
                {error}
                <Link
                  to="/checkout"
                  className="mt-3 block font-semibold text-primary"
                >
                  Return to checkout
                </Link>
              </div>
            ) : stripePromise && clientSecret && serverAmount ? (
              <Elements stripe={stripePromise}>
                <StripeForm
                  clientSecret={clientSecret}
                  checkout={checkout}
                  amount={serverAmount}
                />
              </Elements>
            ) : null}

            <Link
              to="/checkout"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-primary"
            >
              <FiArrowLeft size={15} />
              Back to checkout
            </Link>
          </Card>

          <Card className="h-fit">
            <h2 className="font-poppins text-lg font-bold text-secondary">
              Payment summary
            </h2>

            <ul className="mt-4 space-y-3">
              {(checkout.cart || []).map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="line-clamp-2 text-gray-500">
                    {item.name} × {item.qty || 1}
                  </span>
                  <span className="shrink-0 font-semibold text-secondary">
                    {money(productPrice(item) * Number(item.qty || 1))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 font-poppins text-lg font-bold text-secondary">
              <span>Total</span>
              <span>{money(serverAmount || 0)}</span>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
