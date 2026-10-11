import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;

      const existingItem = state.cart.find(
        (product) => product._id === item._id
      );

      if (existingItem) {
        existingItem.qty += item.qty || 1;
      } else {
        state.cart.push({
          ...item,
          qty: item.qty || 1,
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
        item.qty = qty;
      }
    })
    .addCase("clearCart", (state) => {
      state.cart = [];
    });
});

export default cartReducer;