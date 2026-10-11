import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./reducers/user";
import productReducer from "./reducers/product";
import cartReducer from "./reducers/cart";
import wishlistReducer from "./reducers/wishlist";
import orderReducer from "./reducers/order";
import eventReducer from "./reducers/event";
import sellerReducer from "./reducers/seller";

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

export default store;