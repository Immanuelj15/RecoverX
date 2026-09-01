const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/metrics', dashboardController.getMetrics);
router.get('/audit-logs', dashboardController.getAuditLogs);
router.get('/events', dashboardController.getEvents);

module.exports = router;
