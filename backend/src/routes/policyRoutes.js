const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

router.get('/', (req, res) => policyController.getPolicy(req, res));
router.put('/', (req, res) => policyController.updatePolicy(req, res));

module.exports = router;
