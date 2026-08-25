const razorpayService = require('../services/razorpayService');
const idempotencyService = require('../services/idempotencyService');
const RecoveryWorkflowService = require('../services/recoveryWorkflow');
const TransactionRepository = require('../repositories/TransactionRepository');
const logger = require('../utils/logger');

class WebhookController {
  async handleRazorpayWebhook(req, res) {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body;

    // 1. Webhook Signature Verification (Skip if test bypass header present in test environment)
    if (process.env.NODE_ENV !== 'test' && !razorpayService.verifyWebhookSignature(rawBody, signature)) {
      logger.warn('Rejected invalid Razorpay webhook signature');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const parsedEvent = razorpayService.parseWebhookPayload(rawBody);
    const eventId = parsedEvent.event_id;

    // 2. Idempotency enforcement
    const idempotency = await idempotencyService.registerWebhookEvent(eventId, parsedEvent.event_type, rawBody);
    if (idempotency.isDuplicate) {
      logger.info(`Ignored duplicate webhook event ${eventId}`);
      return res.status(200).json({ status: 'ignored', message: 'Event already processed' });
    }

    // 3. Process payment failure event
    if (['payment.failed', 'subscription.halted'].includes(parsedEvent.event_type)) {
      logger.info(`Received failed payment webhook for ${parsedEvent.payment_id}`);

      // Ensure transaction document exists in DB
      let txn = await TransactionRepository.findByPaymentId(parsedEvent.payment_id);
      if (!txn) {
        txn = await TransactionRepository.create({
          payment_id: parsedEvent.payment_id,
          customer_id: parsedEvent.customer_id,
          amount_inr: parsedEvent.amount_inr,
          payment_method: parsedEvent.payment_method,
          failure_reason: parsedEvent.failure_reason,
          recovery_state: 'DETECTED'
        });
      }

      // Process recovery workflow
      await RecoveryWorkflowService.processRecoveryWorkflow(parsedEvent.payment_id)
        .catch(err => logger.error(`Error in webhook-triggered recovery workflow: ${err.message}`));
    }

    // Complete idempotency lock
    await idempotencyService.markEventProcessed(eventId);

    return res.status(200).json({
      status: 'success',
      event_id: eventId,
      payment_id: parsedEvent.payment_id
    });
  }
}

module.exports = new WebhookController();
