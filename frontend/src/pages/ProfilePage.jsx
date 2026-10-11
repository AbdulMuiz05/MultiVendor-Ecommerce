import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  api,
  Button,
  Card,
  Field,
  Shell,
  safeArray,
  getError,
  money,
} from "./_pageUtils";

export default function ProfilePage() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [orders, setOrders] = useState([]);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user._id) {
      api
        .get(`/order/get-all-orders/${user._id}`)
        .then((response) => {
          setOrders(safeArray(response.data.orders));
        })
        .catch(() => {});
    }
  }, [user._id]);

  const save = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const response = await api.put("/user/update-user-info", user);
      const updatedUser = response.data.user || user;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMsg("Profile updated.");
      setEdit(false);
    } catch (error) {
      setError(getError(error));
    }
  };

  return (
    <Shell title="My Profile" subtitle="Manage your account and orders.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
            {(user.name || "U")[0]}
          </div>

          <h2 className="mt-4 text-center font-poppins text-xl font-bold text-secondary">
            {user.name || "User"}
          </h2>

          <p className="text-center text-sm text-gray-500">
            {user.email}
          </p>

          <div className="mt-6 space-y-2">
            <Link
              className="block rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold"
              to="/wishlist"
            >
              Wishlist
            </Link>

            <Link
              className="block rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold"
              to="/inbox"
            >
              Messages
            </Link>

            <Link
              className="block rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold"
              to={orders[0]?._id ? `/track-order/${orders[0]._id}` : "/profile"}
            >
              Track Order
            </Link>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-poppins text-xl font-bold text-secondary">
                Account information
              </h2>

              <Button
                variant="secondary"
                onClick={() => setEdit(!edit)}
              >
                {edit ? "Cancel" : "Edit"}
              </Button>
            </div>

            {msg && (
              <p className="mt-3 text-sm text-green-600">{msg}</p>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            {edit ? (
              <form
                onSubmit={save}
                className="mt-5 grid gap-4 sm:grid-cols-2"
              >
                <Field
                  label="Name"
                  value={user.name || ""}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                    })
                  }
                />

                <Field
                  label="Phone"
                  value={user.phoneNumber || ""}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      phoneNumber: e.target.value,
                    })
                  }
                />

                <Button>Save changes</Button>
              </form>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="mt-1 font-semibold">
                    {user.name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="mt-1 font-semibold">
                    {user.phoneNumber || "—"}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-poppins text-xl font-bold text-secondary">
                Recent orders
              </h2>

              <Link
                to={orders[0]?._id ? `/track-order/${orders[0]._id}` : "/profile"}
                className="text-sm font-semibold text-primary"
              >
                Track
              </Link>
            </div>

            <div className="mt-5 divide-y">
              {orders.length ? (
                orders.slice(0, 6).map((order) => (
                  <Link
                    to={`/order/${order._id}`}
                    key={order._id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-semibold text-secondary">
                        #{order._id?.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.status}
                      </p>
                    </div>

                    <p className="font-semibold">
                      {money(order.totalPrice)}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  No orders yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}