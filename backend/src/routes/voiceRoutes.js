const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');

router.get('/logs', voiceController.getVoiceLogs);
router.post('/generate-script', voiceController.generateScript);
router.post('/trigger-call', voiceController.triggerVoiceCall);
router.patch('/logs/:id/outcome', voiceController.updateOutcome);

module.exports = router;
