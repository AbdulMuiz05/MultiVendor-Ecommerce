import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";

import { api, getError } from "./_pageUtils";

export default function ActivationPage() {
  const { activation_token } = useParams();
  const [state, setState] = useState("activating");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activation_token) {
      setState("error");
      setError("Activation token is missing.");
      return;
    }

    let active = true;

    api
      .post("/user/activation", { activation_token })
      .then(() => {
        if (active) setState("success");
      })
      .catch((requestError) => {
        if (active) {
          setState("error");
          setError(getError(requestError));
        }
      });

    return () => {
      active = false;
    };
  }, [activation_token]);

  const icon =
    state === "activating" ? (
      <FiLoader className="animate-spin" size={34} />
    ) : state === "success" ? (
      <FiCheckCircle size={36} />
    ) : (
      <FiAlertCircle size={36} />
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-light p-5">
      <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-9 text-center shadow-soft">
        <Link
          to="/"
          className="font-poppins text-2xl font-extrabold text-secondary"
        >
          E<span className="text-primary">shop</span>
        </Link>

        <span
          className={`mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full ${
            state === "success"
              ? "bg-emerald-50 text-emerald-500"
              : state === "error"
              ? "bg-red-50 text-red-500"
              : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </span>

        <h1 className="mt-6 font-poppins text-2xl font-extrabold text-secondary">
          {state === "activating"
            ? "Activating your account"
            : state === "success"
            ? "Account activated"
            : "Activation failed"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {state === "activating"
            ? "Please wait while we verify your activation link."
            : state === "success"
            ? "Your account is ready. You are signed in and can start shopping."
            : error}
        </p>

        {state !== "activating" && (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              to={state === "success" ? "/products" : "/login"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {state === "success" ? "Start shopping" : "Go to sign in"}
              <FiArrowRight />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
            >
              Back to home
            </Link>
          </div>
        )}

        {state === "error" && (
          <p className="mt-6 text-xs leading-5 text-gray-400">
            Activation links expire after a short time. Try signing in; if your
            account is still inactive, register again or contact support.
          </p>
        )}
      </div>
    </div>
  );
}
