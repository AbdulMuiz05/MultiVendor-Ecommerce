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
    case userActivationSuccess:
    case userLoginSuccess:
    case loadUserSuccess:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case userRegisterFailed:
    case userActivationFailed:
    case userLoginFailed:
    case loadUserFailed:
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
        isAuthenticated: false,
        user: null,
        error: null,
      };

    default:
      return state;
  }
};

export default userReducer;