const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

router.post('/simulate-ingestion', batchController.simulateIngestion);

module.exports = router;
