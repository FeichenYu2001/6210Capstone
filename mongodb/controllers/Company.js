// controllers/Company.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Company = require('../models/Company');
const validateRegisterInput = require("../validation/CompanyRegister");

// Company Registration
const Company_register = async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const existingCompany = await Company.findOne({ Email_Id: req.body.Email_Id });
    if (existingCompany) {
      return res.status(400).json({ Email_Id: "Company already registered" });
    }

    const newCompany = new Company(req.body);
    const salt = await bcrypt.genSalt(10);
    newCompany.password = await bcrypt.hash(req.body.password, salt);
    await newCompany.save();

    const payload = {
      cid: newCompany._id,
      name: newCompany.Company_Name,
      email: newCompany.Email_Id,
      location: newCompany.Location
    };

    const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });
    res.status(200).json({ success: true, token: 'Bearer ' + token });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Company Login
const Company_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ Email_Id: email });

    if (!company) {
      return res.status(404).json({ emailNotFound: "Company not found" });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(400).json({ passwordincorrect: "Password incorrect" });
    }

    const payload = {
      cid: company._id,
      name: company.Company_Name,
      email: company.Email_Id,
      location: company.Location
    };

    const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 604800 }); // 7 days

    return res.status(200).json({
      success: true,
      token: 'Bearer ' + token
    });

  } catch (error) {
    console.error('🔥 Login Error:', error.message);
    return res.status(500).json({ error: "Server error during login" });
  }
};

// Dummy placeholders (optional)
const Company_create = (req, res) => {
  res.json({ message: "Company create API called (not implemented yet)" });
};

const Company_update = (req, res) => {
  res.json({ message: "Company update API called (not implemented yet)" });
};

const Company_delete = (req, res) => {
  res.json({ message: "Company delete API called (not implemented yet)" });
};

// ✅ New: Get Company by Company_Id
const Company_getById = async (req, res) => {
  try {
    const company = await Company.findOne({ Company_Id: req.params.cid });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error('🔥 Get Company Error:', error.message);
    res.status(500).json({ message: "Server error fetching company" });
  }
};

// ✅ Export everything
module.exports = {
  Company_register,
  Company_login,
  Company_create,
  Company_update,
  Company_delete,
  Company_getById
};
