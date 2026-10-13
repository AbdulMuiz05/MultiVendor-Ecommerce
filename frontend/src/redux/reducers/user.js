import {
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFailed,
  userActivationRequest,
  userActivationSuccess,
  userActivationFailed,
  userLoginRequest,
  userLoginSuccess,
  userLoginFailed,
  loadUserRequest,
  loadUserSuccess,
  loadUserFailed,
  userLogoutSuccess,
  userLogoutFailed,
} from "../actions/user";

const initialState = {
  loading: false,
  authChecked: false,
  isAuthenticated: false,
  user: null,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case userRegisterRequest:
    case userActivationRequest:
    case userLoginRequest:
    case loadUserRequest:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case userRegisterSuccess:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case userActivationSuccess:
  return {
    ...state,
    loading: false,
    error: null,
  };

    case userLoginSuccess:
    case loadUserSuccess:
      return {
        ...state,
        loading: false,
        authChecked: true,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case loadUserFailed:
      return {
        ...state,
        loading: false,
        authChecked: true,
        isAuthenticated: false,
        user: null,
        error: null,
      };

    case userRegisterFailed:
    case userActivationFailed:
    case userLoginFailed:
    case userLogoutFailed:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case userLogoutSuccess:
      return {
        ...state,
        loading: false,
        authChecked: true,
        isAuthenticated: false,
        user: null,
        error: null,
      };

    default:
      return state;
  }
};

export default userReducer;
