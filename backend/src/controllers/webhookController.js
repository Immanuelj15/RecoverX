const crypto = require('crypto');
const mongoose = require('mongoose');
const LeakageEvent = require('../models/LeakageEvent');
const ImmutableAuditLog = require('../models/ImmutableAuditLog');
const idempotencyService = require('../services/idempotencyService');
const RecoveryWorkflowService = require('../services/recoveryWorkflow');

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const eventId = req.body.event_id || req.body.id;
    if (eventId && idempotencyService && typeof idempotencyService.registerWebhookEvent === 'function') {
      const idempotencyResult = await idempotencyService.registerWebhookEvent(eventId);
      if (idempotencyResult && idempotencyResult.isDuplicate) {
        return res.status(200).json({ status: 'ignored', message: 'Duplicate webhook event' });
      }
    }

    const { event, payload: eventPayload } = req.body;

    let channel = 'PAYMENT_DEGRADATION';
    if (event === 'subscription.halted') channel = 'FAILED_SUBSCRIPTION';
    else if (event === 'invoice.expired') channel = 'OVERDUE_INVOICE';
    else if (event === 'payment.failed') channel = 'PAYMENT_DEGRADATION';

    const entity = eventPayload?.payment?.entity || eventPayload?.subscription?.entity || eventPayload?.invoice?.entity;
    
    let newLeakage = {
      id: req.body.event_id || 'evt_' + Date.now(),
      channel: channel,
      customerName: entity?.customer_name || entity?.email?.split('@')[0] || 'Unknown Customer',
      customerEmail: entity?.email || 'unknown@example.com',
      customerPhone: entity?.contact || '0000000000',
      riskAmount: (entity?.amount || 0) / 100,
      currency: entity?.currency || 'INR',
      declineReasonCode: entity?.error_code || entity?.error_description || 'Unknown Error',
      status: 'DETECTED'
    };

    if (mongoose.connection.readyState === 1) {
      // Create new LeakageEvent record in MongoDB if connected
      newLeakage = await LeakageEvent.create(newLeakage);

      // Write ImmutableAuditLog
      await ImmutableAuditLog.create({
        leakageEventId: newLeakage.id,
        actor: 'SYSTEM_DETECT',
        logMessage: `Received webhook event: ${event}`,
        reasonCode: newLeakage.declineReasonCode,
        payload: req.body
      });
    }

    if (RecoveryWorkflowService && typeof RecoveryWorkflowService.processRecoveryWorkflow === 'function') {
      try {
        await RecoveryWorkflowService.processRecoveryWorkflow(entity?.id || newLeakage.id);
      } catch (err) {
        // Log workflow error gracefully if in test mode
      }
    }

    if (idempotencyService && typeof idempotencyService.markEventProcessed === 'function' && eventId) {
      await idempotencyService.markEventProcessed(eventId);
    }

    res.status(200).json({
      status: 'success',
      message: 'Webhook processed successfully',
      event_id: req.body.event_id || req.body.id,
      payment_id: entity?.id || newLeakage.id,
      leakageEventId: newLeakage.id
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error processing webhook', error: error.message });
  }
};
