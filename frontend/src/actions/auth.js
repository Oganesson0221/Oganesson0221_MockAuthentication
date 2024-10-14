// src/actions/auth.js

import axios from "axios";
import { setAlert } from "./alert";
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
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(
      "https://oganesson0221mockauthentication.onrender.com/users/auth"
    );

    dispatch({
      type: USER_LOADED,
      payload: res.data || {}, // Fallback to an empty object if data is undefined
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post(
        "https://oganesson0221mockauthentication.onrender.com/users/",
        body,
        config
      );

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data || {}, // Fallback to an empty object
      });

      dispatch(loadUser());
    } catch (err) {
      console.error("Registration Error: ", err); // Log the entire error

      // If err.response is undefined, that indicates a network error or the server is unreachable.
      if (err.response) {
        const errors = err.response.data.errors; // Check for validation errors

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        } else {
          dispatch(
            setAlert(
              "Registration failed: " + err.response.data.message ||
                "Unknown error",
              "danger"
            )
          ); // Show server message
        }
      } else {
        dispatch(setAlert("Network error: Unable to reach server", "danger"));
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login User
export const login = (name, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, password });

  try {
    const res = await axios.post(
      "https://oganesson0221mockauthentication.onrender.com/users/auth",
      body,
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    if (err.response && err.response.data.errors) {
      const errors = err.response.data.errors;
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    } else {
      dispatch(setAlert("An unexpected error occurred", "danger"));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Change Password
export const changePassword =
  (currentPassword, newPassword) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ currentPassword, newPassword });

    try {
      const res = await axios.post(
        "https://oganesson0221mockauthentication.onrender.com/users/changepassword",
        body,
        config
      );

      // Dispatch success action and return the response for further handling
      dispatch({
        type: PASSWORD_CHANGED_SUCCESS,
      });

      dispatch(
        setAlert(res.data.msg || "Password changed successfully", "success")
      );
      return Promise.resolve(res); // Resolve with the response if the password change was successful
    } catch (err) {
      if (err.response && err.response.data.errors) {
        const errors = err.response.data.errors;
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      } else {
        dispatch(setAlert("An unexpected error occurred", "danger"));
      }

      dispatch({
        type: PASSWORD_CHANGED_FAIL,
      });

      return Promise.reject(err); // Reject the promise on error for the component to handle
    }
  };

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
