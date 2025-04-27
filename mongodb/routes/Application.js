const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Get applications for an applicant
router.get('/details/:aid', async (req, res) => {
  try {
    const applications = await Application.find({ applicantID: req.params.aid });
    res.json(applications);
  } catch (error) {
    console.error('🔥 Application Fetch Error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
