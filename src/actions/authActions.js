import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("http://localhost:1234/Applicant/create", userData)
    .then(res => history.push("")) // Redirect to login page
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { message: err.message }
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("http://localhost:1234/Applicant/login", userData)
    .then(res => {
      if (!res || !res.data || !res.data.token) {
        throw new Error("No token returned from login");
      }

      const { token } = res.data;

      // Save token to localStorage
      localStorage.setItem("jwtToken", token);

      // Set token to Auth header for future requests
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { message: err.message }
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");

  // Remove auth header for future requests
  setAuthToken(false);

  // Set current user to empty object (logs user out)
  dispatch(setCurrentUser({}));
};
