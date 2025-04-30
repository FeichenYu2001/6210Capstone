// controllers/Application.js
const Application = require('../models/Application');

// Create a new application
exports.Application_create = (req, res) => {
  const { jid, aid } = req.body;
  const application = new Application({
    JobID: jid,
    ApplicantID: aid
  });

  application.save((err, saved) => {
    if (err) {
      console.error('❌ Application save error', err);
      return res.status(500).json({ error: 'Failed to create application' });
    }
    return res.status(201).json(saved);
  });
};

// Get one application by its _id
exports.Application_details = (req, res) => {
  Application.findById(req.params.appid)
    .then(app => res.json(app))
    .catch(err => {
      console.error('❌ Application fetch error', err);
      res.status(500).json({ error: 'Server error' });
    });
};

// Update an application
exports.Application_update = (req, res) => {
  Application.findByIdAndUpdate(
    req.params.appid,
    req.body,
    { new: true }
  )
    .then(updated => res.json(updated))
    .catch(err => {
      console.error('❌ Application update error', err);
      res.status(500).json({ error: 'Server error' });
    });
};

// Delete an application
exports.Application_delete = (req, res) => {
  Application.findByIdAndDelete(req.params.appid)
    .then(() => res.json({ message: 'Deleted' }))
    .catch(err => {
      console.error('❌ Application delete error', err);
      res.status(500).json({ error: 'Server error' });
    });
};

// Get all applications for a given applicant
exports.Application_details_individual = (req, res) => {
  Application.find({ ApplicantID: req.params.aid })
    .populate('JobID')    // if you want to pull in job info
    .then(apps => res.json(apps))
    .catch(err => {
      console.error('❌ Application fetch individual error', err);
      res.status(500).json({ error: 'Server error' });
    });
};
