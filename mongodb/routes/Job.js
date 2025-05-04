const express       = require('express');
const router        = express.Router();
const JobController = require('../controllers/Job');

// Must come before '/:jid' so “company” isn’t mistaken for a job ID
router.get('/company',              JobController.Job_get_by_company);

// Create a new job
router.post('/create',              JobController.Job_create);

// Get a single job by ID
router.get('/:jid',                 JobController.Job_details);

// Get all jobs
router.get('/',                     JobController.Job_details_all);

// Update a specific job field (e.g., application count)
router.put('/:jid/updateApp/:field',JobController.Job_update_app);

// Delete a job
router.delete('/:jid/delete',       JobController.Job_delete);

module.exports = router;
