const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', (req, res) => transactionController.getTransactions(req, res));
router.get('/:payment_id', (req, res) => transactionController.getTransactionByPaymentId(req, res));
router.post('/:payment_id/trigger-recovery', (req, res) => transactionController.triggerRecovery(req, res));

module.exports = router;
