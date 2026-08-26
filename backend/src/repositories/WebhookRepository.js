const { WebhookEvent } = require('../models');

class WebhookRepository {
  async registerEvent(merchantId, eventId, eventType, payloadHash) {
    try {
      const event = await WebhookEvent.create({
        merchant_id: merchantId,
        event_id: eventId,
        event_type: eventType,
        payload_hash: payloadHash,
        processing_status: 'processing',
        received_at: new Date()
      });
      return { isDuplicate: false, event };
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate key error on merchant_id + event_id
        const existing = await WebhookEvent.findOne({ merchant_id: merchantId, event_id: eventId }).lean();
        return { isDuplicate: true, event: existing };
      }
      throw err;
    }
  }

  async saveEvent(merchantId, eventId, eventType, payloadHash) {
    return this.registerEvent(merchantId, eventId, eventType, payloadHash);
  }

  async findByEventId(eventId) {
    return WebhookEvent.findOne({ event_id: eventId }).lean();
  }

  async findByEventId(eventId) {
    return WebhookEvent.findOne({ event_id: eventId }).lean();
  }

  async markProcessed(merchantId, eventId) {
    return WebhookEvent.findOneAndUpdate(
      { merchant_id: merchantId, event_id: eventId },
      { $set: { processing_status: 'processed', processed_at: new Date() } },
      { new: true }
    );
  }

  async markFailed(merchantId, eventId, error) {
    return WebhookEvent.findOneAndUpdate(
      { merchant_id: merchantId, event_id: eventId },
      { $set: { processing_status: 'failed', error } },
      { new: true }
    );
  }
}

module.exports = new WebhookRepository();
