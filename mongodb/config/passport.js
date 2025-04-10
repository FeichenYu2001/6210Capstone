const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Applicant = mongoose.model("Applicant"); // Make sure Applicant model is registered before this runs
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extract from Authorization header
opts.secretOrKey = keys.secretOrKey; // Use secret defined in keys.js

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // Search for the applicant by ID extracted from the token
      Applicant.findById(jwt_payload.id)
        .then((applicant) => {
          if (applicant) {
            return done(null, applicant); // Success: pass applicant object to next middleware
          }
          return done(null, false); // Not found
        })
        .catch((err) => {
          console.error("Error verifying JWT:", err);
          return done(err, false); // Error during DB lookup
        });
    })
  );
};
