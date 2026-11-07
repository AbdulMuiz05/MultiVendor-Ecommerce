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

export const toggleWishlist = (product) => (dispatch, getState) => {
  const exists = getState().wishlist.wishlist.some(
    (item) => item._id === product._id
  );

  if (exists) {
    dispatch(removeFromWishlist(product._id));
  } else {
    dispatch(addToWishlist(product));
  }

  return !exists;
};
