// src/actions/companyActions.js
import axios from "axios";
import { GET_ERRORS } from "./types";

// Register Company
export const registerCompany = (companyData, history) => dispatch => {
  axios
    .post("http://localhost:1234/Company/register", companyData)
    .then(res => {
      alert("Company registered successfully!");
      history.push("/"); // Redirect to homepage or login
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response?.data || { message: err.message }
      })
    );
};
