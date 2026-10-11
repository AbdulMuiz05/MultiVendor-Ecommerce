export const addToWishlist = (data) => (dispatch) => {
  dispatch({
    type: "addToWishlist",
    payload: data,
  });
};

export const removeFromWishlist = (data) => (dispatch) => {
  dispatch({
    type: "removeFromWishlist",
    payload: data,
  });
};