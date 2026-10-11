import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../server";

export default function ActivationPage() {
  const { activation_token } = useParams();
  const [state, setState] = useState("activating");
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    if (!activation_token) return;

    axios
      .post(`${API_URL}/user/activation`, { activation_token })
      .then(() => setState("success"))
      .catch((e) => {
        setState("error");
        setError(e.response?.data?.message || e.message);
      });
  }, [activation_token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-light p-5">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
          {state === "success" ? "✓" : "•"}
        </div>

        <h1 className="mt-5 font-poppins text-2xl font-extrabold text-secondary">
          {state === "activating"
            ? "Activating your account"
            : state === "success"
            ? "Account activated"
            : "Activation failed"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {state === "activating"
            ? "Please wait while we activate your account."
            : state === "success"
            ? "Your account is ready. You can now sign in."
            : error}
        </p>

        {state !== "activating" && (
          <button
            onClick={() => nav("/login")}
            className="mt-6 rounded-md bg-primary px-6 py-3 font-semibold text-white"
          >
            Go to Login
          </button>
        )}

        <p className="mt-5">
          <Link
            to="/"
            className="text-sm font-semibold text-primary"
          >
            Back to Eshop
          </Link>
        </p>
      </div>
    </div>
  );
}