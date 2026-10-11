import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, api, getError, money } from "./_pageUtils";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function StripeForm({ clientSecret, checkout, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pay = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is still loading.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const card = elements.getElement(CardElement);

      if (!card) {
        throw new Error("Payment card form is unavailable.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent?.status !== "succeeded") {
        throw new Error("Payment was not completed.");
      }

      const response = await api.post("/order/create-order", {
        ...checkout,
        paymentInfo: {
          type: "Stripe",
          status: "Paid",
          id: result.paymentIntent.id,
        },
      });

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
    <form onSubmit={pay}>
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
              },
            },
          }}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button disabled={busy || !stripe} className="mt-5 w-full">
        {busy ? "Processing payment..." : `Pay ${money(amount)}`}
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [publishableKey, setPublishableKey] = useState("");
  const [serverAmount, setServerAmount] = useState(0);
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setCheckout(
        JSON.parse(localStorage.getItem("eshop_pending_checkout") || "null")
      );
    } catch {
      setCheckout(null);
    }
  }, []);

  useEffect(() => {
    if (!checkout) return;

    Promise.all([
      api.get("/payment/stripeapikey"),
      api.post("/payment/process", {
        cart: checkout.cart,
      }),
    ])
      .then(([keyResponse, paymentResponse]) => {
        setPublishableKey(keyResponse.data.stripeApikey);
        setClientSecret(paymentResponse.data.client_secret);
        setServerAmount(Number(paymentResponse.data.displayAmount || 0));
      })
      .catch((requestError) => setError(getError(requestError)));
  }, [checkout]);

  if (!checkout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light p-5">
        <Card className="w-full max-w-lg">
          <p className="text-red-600">No pending checkout was found.</p>
          <Link
            to="/checkout"
            className="mt-5 block text-sm font-semibold text-primary"
          >
            Return to checkout
          </Link>
        </Card>
      </div>
    );
  }

  if (!publishableKey || !clientSecret || !serverAmount) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light p-5">
        <Card className="w-full max-w-lg">
          <h1 className="font-poppins text-2xl font-extrabold text-secondary">
            Secure Payment
          </h1>

          {error ? (
            <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          ) : (
            <p className="mt-6 text-sm text-gray-500">
              Preparing secure payment...
            </p>
          )}

          <Link
            to="/checkout"
            className="mt-6 block text-sm font-semibold text-primary"
          >
            Back to checkout
          </Link>
        </Card>
      </div>
    );
  }

  const stripePromise = loadStripe(publishableKey);

  return (
    <div className="flex min-h-screen items-center justify-center bg-light p-5">
      <Card className="w-full max-w-lg">
        <h1 className="font-poppins text-2xl font-extrabold text-secondary">
          Secure Payment
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Amount to pay: <b>{money(serverAmount)}</b>
        </p>

        <Elements stripe={stripePromise}>
          <StripeForm
            clientSecret={clientSecret}
            checkout={checkout}
            amount={serverAmount}
          />
        </Elements>

        <Link
          to="/checkout"
          className="mt-6 block text-sm font-semibold text-primary"
        >
          Back to checkout
        </Link>
      </Card>
    </div>
  );
}
