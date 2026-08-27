const crypto = require('crypto');
const { env } = require('../config/env');
const logger = require('../utils/logger');

class RazorpayService {
  constructor() {
    this.keyId = env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    this.keySecret = env.RAZORPAY_KEY_SECRET || 'razorpay_secret_placeholder';
    this.webhookSecret = env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_placeholder';
  }

  /**
   * Verifies Razorpay webhook HMAC SHA256 signature with constant time comparison
   */
  verifyWebhookSignature(rawBody, signature, secret = null) {
    if (!signature) return false;
    const expectedSecret = secret || this.webhookSecret;
    try {
      const bodyString = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
      const expectedSignature = crypto
        .createHmac('sha256', expectedSecret)
        .update(bodyString)
        .digest('hex');

      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expectedSignature);

      if (sigBuf.length !== expBuf.length) {
        return false;
      }

      return crypto.timingSafeEqual(sigBuf, expBuf);
    } catch (error) {
      logger.error(`Webhook signature verification error: ${error.message}`);
      return false;
    }
  }

  /**
   * Simulates or triggers payment retry in Razorpay Test Mode
   */
  async retryPayment(paymentId, amountInr) {
    if (this.keyId.includes('placeholder')) {
      logger.info(`[Razorpay Test Simulation] Retrying payment ${paymentId} for ₹${amountInr}`);
      return {
        success: true,
        razorpay_payment_id: `pay_retry_${Date.now()}`,
        status: 'captured',
        mode: 'test_simulation'
      };
    }

    // Direct API call simulation for Razorpay Test Mode
    return {
      success: true,
      razorpay_payment_id: `pay_rzp_${Date.now()}`,
      status: 'authorized',
      mode: 'test_mode'
    };
  }

  /**
   * Parses Razorpay webhook event into standardized RecoverX payment failure payload
   */
  parseWebhookPayload(eventPayload) {
    const event = eventPayload.event;
    const payloadEntity = eventPayload.payload?.payment?.entity || eventPayload.payload?.subscription?.entity || {};

    const amountPaise = payloadEntity.amount || (payloadEntity.amount_inr ? Math.round(payloadEntity.amount_inr * 100) : 500000);

    return {
      event_id: eventPayload.event_id || `evt_${Date.now()}`,
      event_type: event,
      payment_id: payloadEntity.id || payloadEntity.payment_id || `pay_${Date.now()}`,
      customer_id: payloadEntity.customer_id || 'cust_default',
      amount_paise: amountPaise,
      amount_inr: (amountPaise / 100),
      payment_method: payloadEntity.method || 'upi',
      failure_reason: payloadEntity.error_code || payloadEntity.failure_reason || 'insufficient_balance',
      retry_count: 0
    };
  }
}

module.exports = new RazorpayService();
