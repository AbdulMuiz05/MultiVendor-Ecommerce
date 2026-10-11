import axios from "axios";

export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "loadSellerRequest",
    });

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/shop/get-seller`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "loadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "loadSellerFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};