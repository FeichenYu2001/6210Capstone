const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const passport = require('passport'); // ✅ Use passport to protect routes

// Storage config for Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter config for Multer
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg formats allowed!'));
    }
};

let upload = multer({ storage, fileFilter });

// Applicant Controller
const Applicant_controller = require('../controllers/Applicant');

// ✅ Applicant routes
router.post('/create', Applicant_controller.Applicant_create);
router.post('/login', Applicant_controller.Applicant_login);
router.get('/:aid', Applicant_controller.Applicant_details);
router.post('/:aid/updateimage', upload.single('image'), Applicant_controller.Applicant_updatephoto);
router.post('/:aid/update/:field', Applicant_controller.Applicant_update);
router.delete('/:aid/delete/:field', Applicant_controller.Applicant_delete);

// ✅ Applicant Dashboard Route (JWT protected)
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        message: `Welcome to the dashboard, ${req.user.name}!`,
        user: req.user
    });
});

module.exports = router;
