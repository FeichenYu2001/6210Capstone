// mongodb/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const applicantRoutes = require('./routes/Applicant'); // Import Applicant routes
const companyRoutes = require('./routes/Company');     // Import Company routes
const db = require('./config/keys').mongoURI;           // ✅ Import MongoDB URI from config

const app = express();
const PORT = process.env.PORT || 1234;

require('./config/passport')(passport); // Load passport config

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(passport.initialize());

// Routes
app.use('/applicant', applicantRoutes);
app.use('/company', companyRoutes);   // ✅ Add Company routes as well

// MongoDB connection
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});