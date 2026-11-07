import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./reducers/user";
import productReducer from "./reducers/product";
import cartReducer from "./reducers/cart";
import wishlistReducer from "./reducers/wishlist";
import orderReducer from "./reducers/order";
import eventReducer from "./reducers/event";
import sellerReducer from "./reducers/seller";
import {
  CART_STORAGE_KEY,
  WISHLIST_STORAGE_KEY,
  writeStoredArray,
} from "./persist";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    events: eventReducer,
    seller: sellerReducer,
  },
});

let lastCart = store.getState().cart.cart;
let lastWishlist = store.getState().wishlist.wishlist;

store.subscribe(() => {
  const state = store.getState();

  if (state.cart.cart !== lastCart) {
    lastCart = state.cart.cart;
    writeStoredArray(CART_STORAGE_KEY, lastCart);
  }

  if (state.wishlist.wishlist !== lastWishlist) {
    lastWishlist = state.wishlist.wishlist;
    writeStoredArray(WISHLIST_STORAGE_KEY, lastWishlist);
  }
});

export default store;
