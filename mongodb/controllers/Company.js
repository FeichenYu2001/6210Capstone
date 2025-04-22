var Company = require('../models/Company');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const validateRegisterInput = require("../validation/CompanyRegister");

// ✅ Company Registration
exports.Company_register = function (req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Company.findOne({ Company_Name: req.body.Company_Name }).then(company => {
    if (company) {
      return res.status(400).json({ Company_Name: "Company already exists" });
    } else {
      const newCompany = new Company({
        Company_Name: req.body.Company_Name,
        Domain: req.body.Domain,
        About_Us: req.body.About_Us || "",
        Location: req.body.Location,
        Contact: req.body.Contact,
        Email_Id: req.body.Email_Id,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;

        bcrypt.hash(newCompany.password, salt, (err, hash) => {
          if (err) throw err;

          newCompany.password = hash;

          newCompany
            .save()
            .then(company => res.status(201).json(company))
            .catch(err => {
              console.error("❌ Save error: ", err);
              res.status(500).json({ error: "Server error during registration" });
            });
        });
      });
    }
  }).catch(err => {
    console.error("❌ Database error: ", err);
    res.status(500).json({ error: "Database error during registration" });
  });
};

// 📝 Create Company from Admin (optional, not used by frontend)
exports.Company_create = function (req, res) {
  var company = new Company({
    Company_Id: 0,
    Company_Name: req.body.Company_Name,
    Domain: req.body.Domain,
    About_Us: req.body.About,
    Location: req.body.Location,
    Contact: req.body.Contact,
    Email_Id: req.body.Email
  });

  company.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("http://localhost:3000/");
  });
};

exports.Company_details = function (req, res) {
  Company.findOne({ Company_Id: req.params.cid }).then(data => {
    return res.json(data);
  }).catch(error => {
    console.log('error: ', error);
  });
};

exports.Company_update = function (req, res) {
  Company.findOneAndUpdate(
    { Company_Id: req.params.Company_Id },
    { $set: req.body },
    function (err, company) {
      if (err) console.log(err);
      res.redirect("http://localhost:3000/dummy");
    }
  );
};

exports.Company_delete = function (req, res) {
  Company.findOneAndDelete({ Company_Id: req.params.cid }, function (err) {
    if (err) console.log(err);
    res.redirect("http://localhost:3000/dummy");
  });
};

// ✅ Company Login
exports.Company_login = function (req, res) {
    console.log("💡 Login received with:", req.body);
  
    const email = req.body.email;
    const password = req.body.password;
  
    Company.findOne({ Email_Id: email }).then(company => {
      if (!company) {
        console.log("❌ Company not found for email:", email);
        return res.status(404).json({ emailNotFound: "Company not found" });
      }
  
      bcrypt.compare(password, company.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            cid: company.Company_Id,
            name: company.Company_Name,
            email: company.Email_Id,
            location: company.Location
          };
  
          jwt.sign(payload, keys.secretOrKey, { expiresIn: 604800 }, (err, token) => {
            console.log("✅ Company login success, token created.");
            res.status(200).json({ success: true, token: "Bearer " + token });
          });
        } else {
          console.log("❌ Password incorrect for:", email);
          return res.status(400).json({ passwordincorrect: "Password incorrect" });
        }
      });
    }).catch(err => {
      console.error("🔥 Error during login:", err);
      res.status(500).json({ error: "Server error during login" });
    });
  };
  