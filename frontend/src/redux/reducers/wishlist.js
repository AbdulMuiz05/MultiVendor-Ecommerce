import { createReducer } from "@reduxjs/toolkit";

import {
  WISHLIST_STORAGE_KEY,
  readStoredArray,
} from "../persist";

const initialState = {
  wishlist: readStoredArray(WISHLIST_STORAGE_KEY),
};

export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload;

      if (!item?._id) return;

      const existingItem = state.wishlist.find(
        (product) => product._id === item._id
      );

      if (!existingItem) {
        state.wishlist.push(item);
      }
    })
    .addCase("removeFromWishlist", (state, action) => {
      state.wishlist = state.wishlist.filter(
        (product) => product._id !== action.payload
      );
    });
});

export default wishlistReducer;
