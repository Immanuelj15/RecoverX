const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/summary', (req, res) => analyticsController.getSummary(req, res));
router.get('/charts', (req, res) => analyticsController.getCharts(req, res));
router.get('/model-info', (req, res) => analyticsController.getModelInfo(req, res));

module.exports = router;
