import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronDown,
  FiHeart,
  FiLogOut,
  FiMessageCircle,
  FiPackage,
  FiUser,
} from "react-icons/fi";

import { logoutUser } from "../../redux/actions/user";
import { initials } from "../../utils/format";
import { notify } from "../UI/Toaster";

const menuLinks = [
  { label: "My Profile", to: "/profile", icon: FiUser },
  { label: "My Orders", to: "/orders", icon: FiPackage },
  { label: "Wishlist", to: "/wishlist", icon: FiHeart },
  { label: "Messages", to: "/inbox", icon: FiMessageCircle },
];

export default function UserMenu({ compact = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointer = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setBusy(true);
    setOpen(false);

    const done = await dispatch(logoutUser());
    setBusy(false);

    if (done) {
      notify("You have been signed out.", "info");
      navigate("/", { replace: true });
    } else {
      notify("Logout failed. Please try again.", "error");
    }
  };

  if (!user) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full border border-gray-100 bg-white py-1.5 pl-1.5 text-secondary transition hover:border-gray-200 hover:bg-gray-50 ${
          compact ? "pr-1.5" : "pr-3"
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {initials(user.name)}
        </span>

        {!compact && (
          <span className="hidden max-w-[110px] truncate text-sm font-semibold lg:block">
            {user.name || "Account"}
          </span>
        )}

        <FiChevronDown
          size={15}
          className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-soft"
        >
          <div className="rounded-xl bg-gray-50 px-3 py-3">
            <p className="truncate text-sm font-bold text-secondary">
              {user.name || "My account"}
            </p>

            {user.email && (
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {user.email}
              </p>
            )}
          </div>

          <div className="py-1">
            {menuLinks.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                role="menuitem"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-primary/5 hover:text-primary"
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-1">
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-60"
            >
              <FiLogOut size={17} />
              {busy ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
