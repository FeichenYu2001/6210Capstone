const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var counterSchema = require('./counter');

let CompanySchema = new Schema({
    Company_Id: { type: Number, required: true, default: 0 },
    Company_Name: { type: String, required: true },
    Domain: { type: String, required: true },
    About_Us: { type: String },
    Location: { type: String },
    Contact: { type: String, required: true },
    Email_Id: { type: String, required: true },
    logo: { type: String },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Counter = mongoose.model('Counter', counterSchema, "C_Counter");

CompanySchema.pre('save', function(next) {
    var curr = this;
    Counter.findOneAndUpdate({ Id: "id" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
        .then(function(doc) {
            curr.Company_Id = doc.seq;
            next();
        })
        .catch(function(error) {
            console.error("counter error-> : " + error);
            throw error;
        });
});

// Export the model
const Company = mongoose.model('Company', CompanySchema, 'Company');
module.exports = Company;
