export const CART_STORAGE_KEY = "eshop_cart";
export const WISHLIST_STORAGE_KEY = "eshop_wishlist";

export const readStoredArray = (key) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter((item) => item?._id) : [];
  } catch {
    return [];
  }
};

export const writeStoredArray = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing; the app keeps working.
  }
};
