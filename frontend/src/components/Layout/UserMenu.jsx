import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut, FiUser } from "react-icons/fi";
import { logoutUser } from "../../redux/actions/user";

const UserMenu = ({ onLoggedOut }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointer = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
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
    setOpen(false);
    setError("");

    const done = await dispatch(logoutUser());

    if (done) {
      if (onLoggedOut) onLoggedOut();
      return;
    }

    setError("Logout failed. Please try again.");
    setOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"
      >
        <FiUser size={20} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 bg-white p-2 shadow-card"
        >
          <div className="border-b border-gray-100 px-3 py-3">
            <p className="truncate text-sm font-semibold text-secondary">
              {user?.name || "My account"}
            </p>

            {user?.email && (
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {user.email}
              </p>
            )}
          </div>

          {error && (
            <p className="px-3 pt-2 text-xs text-red-600">{error}</p>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-500"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
