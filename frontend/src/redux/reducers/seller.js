import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  isSeller: false,
  seller: null,
  error: null,
};

export const sellerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("loadSellerRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("loadSellerSuccess", (state, action) => {
      state.isLoading = false;
      state.isSeller = true;
      state.seller = action.payload;
      state.error = null;
    })
    .addCase("loadSellerFailed", (state, action) => {
      state.isLoading = false;
      state.isSeller = false;
      state.error = action.payload;
    });
});

export default sellerReducer;