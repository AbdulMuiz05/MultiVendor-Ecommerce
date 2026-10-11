import axios from "axios";

export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });

    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/create-product`,
      productData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });

    return data;
  } catch (error) {
    dispatch({
      type: "productCreateFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getAllProductsShop = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsShopRequest" });

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/get-all-products-shop/${shopId}`
    );

    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/get-all-products`
    );

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "deleteProductRequest" });

    const { data } = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/delete-shop-product/${productId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });

    return data;
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};