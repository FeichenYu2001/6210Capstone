const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobSchema = new Schema({
  role: { type: String, required: true },
  jobDescription: {
    description: { type: String, default: "" },
    skillSet:    [{ type: String }],
    perks:       { type: String, default: "" }
  },
  companyID:        { type: Number },
  category:         [{ type: String }],
  maxApplications:  { type: Number, required: true },
  positions:        { type: Number, required: true },
  posting:          { type: Date,   default: Date.now },
  currApplications: { type: Number, default: 0 },
  active:           { type: Boolean, default: true },
  deadline:         { type: Date,   required: true },
  duration:         { type: Number, required: true },
  salary:           { type: Number, required: true },
  name:             { type: String, required: true },
  email:            { type: String, required: true },
  location:         { type: String },
  jobType:          { type: Number, required: true },
  image:            { type: String, default: "astronaut.png" },
  // Track applicants via Application refs
  applicants:       [{ type: Schema.Types.ObjectId, ref: 'Application' }]
});

module.exports = mongoose.model('Job', jobSchema);
