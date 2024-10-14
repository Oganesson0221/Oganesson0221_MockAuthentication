// src/reducers/auth.js

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  PASSWORD_CHANGED_SUCCESS,
  PASSWORD_CHANGED_FAIL,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  passwordChangeSuccess: false, // Track password change success
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  // Log the action type and payload for debugging
  console.log("Action Type:", type, "Payload:", payload);

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload, // Ensure payload contains the user object
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token); // Save token to localStorage
      return {
        ...state,
        ...payload, // Ensure payload has the necessary user details
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token"); // Clear token on failure or logout
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case PASSWORD_CHANGED_SUCCESS:
      return {
        ...state,
        passwordChangeSuccess: true, // Set password change to successful
      };
    case PASSWORD_CHANGED_FAIL:
      return {
        ...state,
        passwordChangeSuccess: false, // Set password change to failed
      };
    default:
      return state; // Return current state if action type is unrecognized
  }
}
