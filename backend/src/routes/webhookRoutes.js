const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Route to ingest webhooks from Razorpay
router.post('/razorpay', webhookController.handleRazorpayWebhook);

module.exports = router;
