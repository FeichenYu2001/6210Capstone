const Job = require('../models/Job');

// Create job
exports.Job_create = async function (req, res) {
    try {
      const job = new Job(req.body);  // ✅ Construct new Job object
      await job.save();               // ✅ Save to MongoDB
      console.log("✅ New job created:", job.role);  // ✅ Print success in terminal
      res.status(201).json({ message: "Job created successfully!" });
    } catch (err) {
      console.error("❌ Job Post Error:", err);
      res.status(400).json({ error: err.message });
    }
  };

// Get one job
exports.Job_details = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jid);
    res.json(job);
  } catch (error) {
    console.error('❌ Job Fetch Error:', error);
    res.status(500).json({ message: "Error fetching job details" });
  }
};

// Get all jobs
exports.Job_details_all = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    console.error('❌ All Jobs Error:', error);
    res.status(500).json({ message: "Error fetching all jobs" });
  }
};

// Update application count (not needed now)
exports.Job_update_app = async (req, res) => {
  res.json({ message: "Update job field placeholder" });
};

// Delete job
exports.Job_delete = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.jid);
    res.json({ message: "Job deleted" });
  } catch (error) {
    console.error('❌ Delete Job Error:', error);
    res.status(500).json({ message: "Error deleting job" });
  }
};
