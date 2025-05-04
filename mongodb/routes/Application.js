// routes/Application.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/Application');

// Create a new application
router.post('/create', ctrl.Application_create);

// Get all applications by applicant ID
router.get('/details/:aid', ctrl.Application_details_individual);

// new — fetch one application by its _id:
router.get('/:appid', ctrl.Application_details);

// Delete one application by *application* ID
router.delete('/:appid', ctrl.Application_delete);

module.exports = router;
