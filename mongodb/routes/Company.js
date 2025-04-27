// routes/Company.js

const express = require('express');
const router = express.Router();

const Company_controller = require('../controllers/Company');

router.post('/register', Company_controller.Company_register);
router.post('/login', Company_controller.Company_login);
router.post('/create', Company_controller.Company_create);
router.put('/:cid/update', Company_controller.Company_update);
router.delete('/:cid/delete', Company_controller.Company_delete);
router.get('/:cid', Company_controller.Company_details);

module.exports = router;
