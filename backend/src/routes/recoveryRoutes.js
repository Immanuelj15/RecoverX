const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recoveryController');

router.post('/diagnose', recoveryController.diagnoseRCA);
router.post('/execute-step', recoveryController.executeStep);

module.exports = router;
