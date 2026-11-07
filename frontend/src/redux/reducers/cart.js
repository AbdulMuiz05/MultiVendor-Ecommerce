import { createReducer } from "@reduxjs/toolkit";

import { CART_STORAGE_KEY, readStoredArray } from "../persist";

const normalizeQty = (qty, stock) => {
  const next = Math.max(1, Math.floor(Number(qty) || 1));
  const limit = Number(stock);

  if (Number.isFinite(limit) && limit > 0) {
    return Math.min(next, limit);
  }

  return next;
};

const initialState = {
  cart: readStoredArray(CART_STORAGE_KEY).map((item) => ({
    ...item,
    qty: normalizeQty(item.qty, item.stock),
  })),
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;

      if (!item?._id) return;

      const existingItem = state.cart.find(
        (product) => product._id === item._id
      );

      if (existingItem) {
        existingItem.qty = normalizeQty(
          existingItem.qty + (Number(item.qty) || 1),
          existingItem.stock
        );
      } else {
        state.cart.push({
          ...item,
          qty: normalizeQty(item.qty || 1, item.stock),
        });
      }
    })
    .addCase("removeFromCart", (state, action) => {
      state.cart = state.cart.filter(
        (product) => product._id !== action.payload
      );
    })
    .addCase("updateCartQuantity", (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cart.find((product) => product._id === id);

      if (item) {
        item.qty = normalizeQty(qty, item.stock);
      }
    })
    .addCase("clearCart", (state) => {
      state.cart = [];
    });
});

export default cartReducer;
