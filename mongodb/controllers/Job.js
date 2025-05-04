const Job = require('../models/Job');

// GET /job/company?email=…
exports.Job_get_by_company = async (req, res) => {
  try {
    const { email } = req.query;
    const jobs = await Job.find({ email }).populate('applicants');
    return res.json(jobs);
  } catch (err) {
    console.error('❌ Get by company error:', err);
    return res.status(500).json({ message: 'Error fetching jobs by company' });
  }
};

// POST /job/create
exports.Job_create = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    console.log('✅ New job created:', job.role);
    return res.status(201).json({ message: 'Job created successfully!' });
  } catch (err) {
    console.error('❌ Job Post Error:', err);
    return res.status(400).json({ error: err.message });
  }
};

// GET /job/:jid
exports.Job_details = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jid).populate('applicants');
    return res.json(job);
  } catch (err) {
    console.error('❌ Job Fetch Error:', err);
    return res.status(500).json({ message: 'Error fetching job details' });
  }
};

// GET /job/
exports.Job_details_all = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate('applicants');
    return res.json(jobs);
  } catch (err) {
    console.error('❌ All Jobs Error:', err);
    return res.status(500).json({ message: 'Error fetching all jobs' });
  }
};

// PUT /job/:jid/updateApp/:field
exports.Job_update_app = async (req, res) => {
  // Placeholder for updating a specific field on a job (e.g., application count)
  return res.json({ message: 'Update job field placeholder' });
};

// DELETE /job/:jid/delete
exports.Job_delete = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.jid);
    console.log(`🗑️ Job ${req.params.jid} deleted`);
    return res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Job Error:', err);
    return res.status(500).json({ message: 'Error deleting job' });
  }
};
