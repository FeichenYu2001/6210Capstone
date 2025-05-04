const express        = require('express');
const router         = express.Router();
const Job_controller = require('../controllers/Job');

// Must come first so “company” isn’t read as a job ID
router.get('/company',                Job_controller.Job_get_by_company);

router.post('/create',                Job_controller.Job_create);
router.get('/:jid',                   Job_controller.Job_details);
router.get('/',                       Job_controller.Job_details_all);
router.put('/:jid/updateApp/:field',  Job_controller.Job_update_app);
router.delete('/:jid/delete',         Job_controller.Job_delete);

module.exports = router;
