const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

const applicantRoutes = require('./routes/Applicant');
const companyRoutes = require('./routes/Company');
const jobRoutes = require('./routes/Job');

const db = require('./config/keys').mongoURI;

const app = express();
const PORT = process.env.PORT || 1234;

require('./config/passport')(passport);

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// ✅ Serve static files for Interview Prep
app.use('/interview-prep', express.static('public/interview-prep'));

// Routes
app.use('/applicant', applicantRoutes);
app.use('/company', companyRoutes);
app.use('/job', jobRoutes);

// MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
