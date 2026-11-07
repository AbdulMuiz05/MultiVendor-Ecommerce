import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronRight,
  FiEdit3,
  FiHeart,
  FiLogOut,
  FiMessageCircle,
  FiPackage,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import {
  Button,
  Card,
  Shell,
  StatusBadge,
  api,
  getError,
  imageUrl,
  money,
  safeArray,
} from "./_pageUtils";
import { logoutUser, userLoginSuccess } from "../redux/actions/user";
import { formatDate, initials } from "../utils/format";
import { notify } from "../components/UI/Toaster";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    avatar: user?.avatar || "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  useEffect(() => {
    let active = true;

    if (!user?._id) return undefined;

    setLoadingOrders(true);

    api
      .get(`/order/get-all-orders/${user._id}`)
      .then((response) => {
        if (active) setOrders(safeArray(response.data.orders));
      })
      .catch((requestError) => {
        if (active) setOrdersError(getError(requestError));
      })
      .finally(() => {
        if (active) setLoadingOrders(false);
      });

    return () => {
      active = false;
    };
  }, [user?._id]);

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0
  );

  const save = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    setBusy(true);

    try {
      const response = await api.put("/user/update-user-info", {
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        avatar: form.avatar.trim(),
      });

      const updated = response.data.user || { ...user, ...form };

      localStorage.setItem("user", JSON.stringify(updated));
      dispatch({ type: userLoginSuccess, payload: updated });
      notify("Profile updated.");
      setEdit(false);
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    const done = await dispatch(logoutUser());

    if (done) {
      notify("Signed out.", "info");
      navigate("/");
    } else {
      notify("Could not sign out. Please try again.", "error");
    }
  };

  const recent = orders.slice(0, 5);

  const stats = [
    {
      label: "Orders",
      value: orders.length,
      icon: FiPackage,
      to: "/orders",
    },
    {
      label: "Wishlist",
      value: wishlist.length,
      icon: FiHeart,
      to: "/wishlist",
    },
    {
      label: "Cart items",
      value: cartCount,
      icon: FiShoppingBag,
      to: "/cart",
    },
  ];

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-1 font-poppins text-3xl font-extrabold text-secondary sm:text-4xl">
            My profile
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your account details and review your activity.
          </p>
        </div>

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary"
        >
          <FiPackage />
          My orders
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col items-center text-center">
              {user?.avatar ? (
                <img
                  src={imageUrl(user.avatar)}
                  alt={user.name || "Account avatar"}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 font-poppins text-3xl font-bold text-primary">
                  {initials(user?.name)}
                </span>
              )}

              <h2 className="mt-4 font-poppins text-xl font-bold text-secondary">
                {user?.name || "Customer"}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {user?.email}
              </p>

              {user?.phoneNumber && (
                <p className="mt-1 text-sm text-gray-400">
                  {user.phoneNumber}
                </p>
              )}

              <button
                type="button"
                onClick={() => setEdit(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-secondary transition hover:border-primary hover:text-primary"
              >
                <FiEdit3 size={14} />
                Edit profile
              </button>
            </div>

            <nav className="mt-6 space-y-1 border-t border-gray-100 pt-5">
              <Link
                to="/orders"
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-primary"
              >
                <span className="flex items-center gap-2.5">
                  <FiPackage size={16} />
                  My orders
                </span>
                <FiChevronRight size={15} />
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-primary"
              >
                <span className="flex items-center gap-2.5">
                  <FiHeart size={16} />
                  Wishlist
                </span>
                <FiChevronRight size={15} />
              </Link>

              <Link
                to="/inbox"
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-primary"
              >
                <span className="flex items-center gap-2.5">
                  <FiMessageCircle size={16} />
                  Messages
                </span>
                <FiChevronRight size={15} />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <FiLogOut size={16} />
                Sign out
              </button>
            </nav>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-card transition hover:-translate-y-0.5 hover:border-primary/20"
                >
                  <Icon className="mx-auto text-primary" size={18} />
                  <p className="mt-2 font-poppins text-xl font-extrabold text-secondary">
                    {item.value}
                  </p>
                  <p className="text-[11px] font-semibold text-gray-400">
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-poppins text-xl font-bold text-secondary">
                Account information
              </h2>

              {!edit && (
                <Button
                  variant="secondary"
                  className="px-4 py-2 text-xs"
                  onClick={() => setEdit(true)}
                >
                  <FiEdit3 className="mr-2" size={14} />
                  Edit
                </Button>
              )}
            </div>

            {error && (
              <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {edit ? (
              <form
                onSubmit={save}
                className="mt-5 grid gap-4 sm:grid-cols-2"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">
                    Name
                  </span>
                  <input
                    className="input-field"
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    autoComplete="name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone
                  </span>
                  <input
                    className="input-field"
                    value={form.phoneNumber}
                    onChange={(event) =>
                      setForm({ ...form, phoneNumber: event.target.value })
                    }
                    placeholder="+91 98765 43210"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">
                    Avatar image URL{" "}
                    <span className="font-normal text-gray-400">
                      (optional)
                    </span>
                  </span>
                  <input
                    className="input-field"
                    value={form.avatar}
                    onChange={(event) =>
                      setForm({ ...form, avatar: event.target.value })
                    }
                    placeholder="https://..."
                  />
                </label>

                <div className="flex gap-3 sm:col-span-2">
                  <Button disabled={busy}>
                    {busy ? "Saving..." : "Save changes"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEdit(false);
                      setError("");
                      setForm({
                        name: user?.name || "",
                        phoneNumber: user?.phoneNumber || "",
                        avatar: user?.avatar || "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>

                <p className="text-xs text-gray-400 sm:col-span-2">
                  Your email address cannot be changed from this page.
                </p>
              </form>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Name
                  </p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-secondary">
                    <FiUser className="text-gray-400" size={15} />
                    {user?.name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email
                  </p>
                  <p className="mt-1 break-all font-semibold text-secondary">
                    {user?.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Phone
                  </p>
                  <p className="mt-1 font-semibold text-secondary">
                    {user?.phoneNumber || "Not added"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Account status
                  </p>
                  <p className="mt-1 font-semibold text-emerald-600">
                    {user ? "Active" : "—"}
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
                to="/orders"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {ordersError && (
              <p className="mt-4 text-sm text-red-600">{ordersError}</p>
            )}

            {loadingOrders ? (
              <div className="mt-5 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl bg-gray-50"
                  />
                ))}
              </div>
            ) : recent.length ? (
              <div className="mt-4 divide-y divide-gray-100">
                {recent.map((order) => (
                  <Link
                    key={order._id}
                    to={`/order/${order._id}`}
                    className="flex items-center gap-3 py-4 transition hover:opacity-80"
                  >
                    <img
                      src={imageUrl(order.cart?.[0]?.images?.[0])}
                      alt={order.cart?.[0]?.name || "Order"}
                      className="h-14 w-14 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-secondary">
                        Order #{String(order._id).slice(-8)}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {formatDate(order.createdAt)} ·{" "}
                        {safeArray(order.cart).length} product
                        {safeArray(order.cart).length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-secondary">
                        {money(order.totalPrice)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-gray-50 px-5 py-10 text-center">
                <p className="text-sm text-gray-500">
                  You haven't placed any orders yet.
                </p>
                <Link
                  to="/products"
                  className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  Browse products
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Shell>
  );
}
