const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

router.get('/', (req, res) => auditController.getAuditLogs(req, res));

module.exports = router;
