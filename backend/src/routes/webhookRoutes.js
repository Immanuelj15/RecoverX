const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/razorpay', (req, res) => webhookController.handleRazorpayWebhook(req, res));

module.exports = router;
