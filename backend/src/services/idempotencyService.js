const WebhookRepository = require('../repositories/WebhookRepository');
const logger = require('../utils/logger');

class IdempotencyService {
  constructor() {
    // In-memory lock registry for fast concurrent request deduplication
    this.activeLocks = new Map();
  }

  /**
   * Checks whether a webhook event or transaction recovery operation has already been processed
   */
  async isAlreadyProcessed(eventId) {
    if (!eventId) return false;
    const existing = await WebhookRepository.findByEventId(eventId);
    return Boolean(existing && existing.processed);
  }

  /**
   * Acquires a temporary idempotency lock for processing a payment or webhook event
   */
  acquireLock(key, ttlMs = 30000) {
    if (this.activeLocks.has(key)) {
      const lockTime = this.activeLocks.get(key);
      if (Date.now() - lockTime < ttlMs) {
        logger.warn(`Idempotency lock active for key: ${key}`);
        return false;
      }
    }
    this.activeLocks.set(key, Date.now());
    return true;
  }

  /**
   * Releases an idempotency lock after operation completes
   */
  releaseLock(key) {
    this.activeLocks.delete(key);
  }

  /**
   * Register and process webhook event safely with idempotency guarantee
   */
  async registerWebhookEvent(eventId, eventType, payload) {
    const existing = await WebhookRepository.findByEventId(eventId);
    if (existing) {
      if (existing.processing_status === 'processed' || existing.processed) {
        logger.info(`Idempotency check: Webhook event '${eventId}' was already processed.`);
        return { isDuplicate: true, event: existing };
      }
      return { isDuplicate: false, event: existing };
    }

    const res = await (WebhookRepository.saveEvent 
      ? WebhookRepository.saveEvent(null, eventId, eventType, payload) 
      : WebhookRepository.registerEvent(null, eventId, eventType, payload));
    if (res && typeof res.isDuplicate === 'boolean') {
      return res;
    }
    return { isDuplicate: false, event: res };
  }

  /**
   * Mark event completed cleanly
   */
  async markEventProcessed(eventId, error = null) {
    return WebhookRepository.markProcessed(eventId, error);
  }
}

module.exports = new IdempotencyService();
