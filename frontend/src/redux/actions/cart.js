export const addToCart = (product) => (dispatch) => {
  dispatch({
    type: "addToCart",
    payload: product,
  });
};

export const removeFromCart = (productId) => (dispatch) => {
  dispatch({
    type: "removeFromCart",
    payload: productId,
  });
};

export const updateCartQuantity = (productId, qty) => (dispatch) => {
  dispatch({
    type: "updateCartQuantity",
    payload: {
      id: productId,
      qty,
    },
  });
};

export const clearCart = () => (dispatch) => {
  dispatch({
    type: "clearCart",
  });
};