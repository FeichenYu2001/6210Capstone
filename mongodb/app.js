const express = require('express');
 const cors = require('cors');
 const passport = require("passport");
 const path = require('path');
 
 const Applicant = require('./routes/Applicant'); // Imports routes for the Applicants
 const Company = require('./routes/Company'); // Imports routes for the Companies
 const Application = require('./routes/Application');
 const Job = require('./routes/Job');
 const SMS = require('./routes/sms');
 
 const app = express();
 
 // Set up mongoose connection
 const mongoose = require('mongoose');
 const url = require("./config/keys").mongoURI;
 
 mongoose.connect(url, {
 	useNewUrlParser: true,
 	useUnifiedTopology: true
 })
 .then(() => console.log('✅ Connected to MongoDB Atlas'));
 
 mongoose.Promise = global.Promise;
 const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'MongoDB connection error:'));
 
 // Enable CORS for frontend
 app.use(cors({
 	origin: "http://localhost:3000",
 }));
 
 // Body parsers
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json());
 
 // Initialize Passport
 app.use(passport.initialize());
 require("./config/passport")(passport);
 
 // ✅ Serve static files
 app.use('/public', express.static(path.join(__dirname, 'public'))); // general static
 app.use('/interview-prep', express.static(path.join(__dirname, 'public/interview-prep'))); // interview prep folder
 
 // Routes
 app.use('/Applicant', Applicant);
 app.use('/Company', Company);
 app.use('/Application', Application);
 app.use('/Job', Job);
 app.use('/sms', SMS);
 
 // Test
 app.get('/test-html', (req, res) => {
   res.sendFile(path.join(__dirname, 'public/interview-prep/Machine_Learning_Qs.html'));
 });
 
 
 // Start server
 const port = 1234;
 app.listen(port, () => {
 	console.log('🚀 Server is running on port number ' + port);
 });