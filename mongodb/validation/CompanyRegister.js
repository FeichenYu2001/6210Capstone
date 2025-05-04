const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCompanyRegisterInput(data) {
  let errors = {};

  data.Company_Name = !isEmpty(data.Company_Name) ? data.Company_Name : "";
  data.Domain = !isEmpty(data.Domain) ? data.Domain : "";
  data.Location = !isEmpty(data.Location) ? data.Location : "";
  data.Contact = !isEmpty(data.Contact) ? data.Contact : "";
  data.Email_Id = !isEmpty(data.Email_Id) ? data.Email_Id : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.Company_Name)) {
    errors.Company_Name = "Company Name is required";
  }

  if (Validator.isEmpty(data.Domain)) {
    errors.Domain = "Domain is required";
  }

  if (Validator.isEmpty(data.Location)) {
    errors.Location = "Location is required";
  }

  if (Validator.isEmpty(data.Contact)) {
    errors.Contact = "Contact is required";
  }

  if (Validator.isEmpty(data.Email_Id)) {
    errors.Email_Id = "Email is required";
  } else if (!Validator.isEmail(data.Email_Id)) {
    errors.Email_Id = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  } else if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
