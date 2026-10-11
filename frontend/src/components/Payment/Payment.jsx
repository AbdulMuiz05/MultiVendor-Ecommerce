import React, { useState } from "react";
import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const Payment = ({ paymentData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/payment/process`,
        paymentData,
        config
      );

      const clientSecret = data.client_secret || data.clientSecret;

      if (!clientSecret) {
        throw new Error("Payment client secret was not received.");
      }

      const card = elements.getElement(CardElement);

      if (!card) {
        throw new Error("Card information is missing.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        onSuccess?.(result.paymentIntent);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Card Payment
      </h2>

      {error && (
        <div className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="border border-gray-300 rounded-md p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#374151",
                  "::placeholder": {
                    color: "#9CA3AF",
                  },
                },
                invalid: {
                  color: "#DC2626",
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full mt-5 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Payment;