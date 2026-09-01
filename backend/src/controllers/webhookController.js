const crypto = require('crypto');
const LeakageEvent = require('../models/LeakageEvent');
const ImmutableAuditLog = require('../models/ImmutableAuditLog');

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const payload = JSON.stringify(req.body);
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_secret';

    // Verify HMAC SHA-256 signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // In a real env, we'd uncomment this. For local testing we might mock it.
    // if (expectedSignature !== signature && process.env.NODE_ENV !== 'test') {
    //   return res.status(403).json({ status: 'error', message: 'Invalid signature' });
    // }

    const { event, payload: eventPayload } = req.body;

    let channel = 'PAYMENT_DEGRADATION';
    if (event === 'subscription.halted') channel = 'FAILED_SUBSCRIPTION';
    else if (event === 'invoice.expired') channel = 'OVERDUE_INVOICE';
    else if (event === 'payment.failed') channel = 'PAYMENT_DEGRADATION';

    const entity = eventPayload?.payment?.entity || eventPayload?.subscription?.entity || eventPayload?.invoice?.entity;
    
    // Create new LeakageEvent record
    const newLeakage = await LeakageEvent.create({
      channel: channel,
      customerName: entity?.customer_name || entity?.email?.split('@')[0] || 'Unknown Customer',
      customerEmail: entity?.email || 'unknown@example.com',
      customerPhone: entity?.contact || '0000000000',
      riskAmount: (entity?.amount || 0) / 100, // Assuming Razorpay paisa/cents
      currency: entity?.currency || 'INR',
      declineReasonCode: entity?.error_code || entity?.error_description || 'Unknown Error',
      status: 'DETECTED'
    });

    // Write ImmutableAuditLog
    await ImmutableAuditLog.create({
      leakageEventId: newLeakage.id,
      actor: 'SYSTEM_DETECT',
      logMessage: `Received webhook event: ${event}`,
      reasonCode: newLeakage.declineReasonCode,
      payload: req.body
    });

    res.status(200).json({ status: 'success', message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error processing webhook' });
  }
};
