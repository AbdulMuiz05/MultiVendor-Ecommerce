import { API_URL } from "../server";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const safeArray = (value) => (Array.isArray(value) ? value : []);

export const money = (value) => usdFormatter.format(Number(value) || 0);

export const imageUrl = (src) => {
  if (!src) {
    return "https://placehold.co/800x1000/f8fafc/64748b?text=Eshop";
  }

  if (/^(https?:|data:)/i.test(src)) {
    return src;
  }

  const root = API_URL.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");

  return `${root}/${String(src).replace(/^\//, "")}`;
};

export const productPrice = (product) =>
  Number(product?.discountPrice ?? product?.price ?? 0);

export const discountPercent = (product) => {
  const original = Number(product?.originalPrice);
  const current = productPrice(product);

  if (!original || original <= current || current < 0) {
    return 0;
  }

  return Math.round(((original - current) / original) * 100);
};

export const formatDate = (value, options = {}) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
};

export const initials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "U";

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

export const orderStatusTone = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-700";
    case "Cancelled":
      return "bg-red-50 text-red-600";
    case "On the way":
    case "Shipping":
    case "Received":
      return "bg-sky-50 text-sky-700";
    case "Transferred to delivery partner":
      return "bg-indigo-50 text-indigo-700";
    case "Processing":
    default:
      return "bg-amber-50 text-amber-700";
  }
};
