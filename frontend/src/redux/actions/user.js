import axios from "axios";
import { API_URL } from "../../server";

export const userRegisterRequest = "userRegisterRequest";
export const userRegisterSuccess = "userRegisterSuccess";
export const userRegisterFailed = "userRegisterFailed";

export const userActivationRequest = "userActivationRequest";
export const userActivationSuccess = "userActivationSuccess";
export const userActivationFailed = "userActivationFailed";

export const userLoginRequest = "userLoginRequest";
export const userLoginSuccess = "userLoginSuccess";
export const userLoginFailed = "userLoginFailed";

export const loadUserRequest = "loadUserRequest";
export const loadUserSuccess = "loadUserSuccess";
export const loadUserFailed = "loadUserFailed";

export const userLogoutSuccess = "userLogoutSuccess";
export const userLogoutFailed = "userLogoutFailed";

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: userRegisterRequest });

    const { data } = await axios.post(
      `${API_URL}/user/register`,
      userData,
      { withCredentials: true }
    );

    dispatch({
      type: userRegisterSuccess,
      payload: data.user,
    });

    return data;
  } catch (error) {
    dispatch({
      type: userRegisterFailed,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const activateUser = (activationToken) => async (dispatch) => {
  try {
    dispatch({ type: userActivationRequest });

    const { data } = await axios.post(
      `${API_URL}/user/activation`,
      { activation_token: activationToken },
      { withCredentials: true }
    );

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    dispatch({
      type: userActivationSuccess,
      payload: data.user,
    });

    return data;
  } catch (error) {
    dispatch({
      type: userActivationFailed,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: userLoginRequest });

    const { data } = await axios.post(
      `${API_URL}/user/login`,
      { email, password },
      { withCredentials: true }
    );

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    dispatch({
      type: userLoginSuccess,
      payload: data.user,
    });

    return data;
  } catch (error) {
    dispatch({
      type: userLoginFailed,
      payload: error.response?.data?.message || error.message,
    });
  }
};

let pendingLoadUser = null;

export const loadUser = () => (dispatch) => {
  if (pendingLoadUser) return pendingLoadUser;

  pendingLoadUser = (async () => {
    try {
      dispatch({ type: loadUserRequest });

      const { data } = await axios.get(
        `${API_URL}/user/getuser`,
        { withCredentials: true }
      );

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      dispatch({
        type: loadUserSuccess,
        payload: data.user,
      });

      return data.user;
    } catch (error) {
      localStorage.removeItem("user");

      dispatch({
        type: loadUserFailed,
        payload: error.response?.data?.message || error.message,
      });

      return null;
    } finally {
      pendingLoadUser = null;
    }
  })();

  return pendingLoadUser;
};

const finishLogout = (dispatch) => {
  localStorage.removeItem("user");
  dispatch({ type: userLogoutSuccess });
  return true;
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post(
      `${API_URL}/user/logout`,
      {},
      { withCredentials: true }
    );

    return finishLogout(dispatch);
  } catch (error) {
    if (error.response?.status === 401) {
      return finishLogout(dispatch);
    }

    dispatch({
      type: userLogoutFailed,
      payload: error.response?.data?.message || error.message,
    });

    return false;
  }
};