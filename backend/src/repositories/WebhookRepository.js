const { WebhookEvent } = require('../models');

class WebhookRepository {
  async registerEvent(merchantId, eventId, eventType, payloadHash) {
    try {
      const mongoose = require('mongoose');
      let validMerchantId = merchantId;
      if (!validMerchantId || !mongoose.Types.ObjectId.isValid(validMerchantId)) {
        const merchantRepository = require('./merchantRepository');
        const merchant = await merchantRepository.getOrCreateDemoMerchant();
        validMerchantId = merchant._id;
      }
      const event = await WebhookEvent.create({
        merchant_id: validMerchantId,
        event_id: eventId,
        event_type: eventType || 'payment.failed',
        payload: payloadHash || {},
        payload_hash: typeof payloadHash === 'string' ? payloadHash : null,
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

  async markProcessed(param1, param2) {
    const mongoose = require('mongoose');
    const eventId = typeof param2 === 'string' ? param2 : param1;
    const query = { event_id: eventId };
    if (param2 && mongoose.Types.ObjectId.isValid(param1)) {
      query.merchant_id = param1;
    }
    return WebhookEvent.findOneAndUpdate(
      query,
      { $set: { processing_status: 'processed', processed_at: new Date() } },
      { new: true }
    );
  }

  async markFailed(param1, param2, error) {
    const mongoose = require('mongoose');
    const eventId = typeof param2 === 'string' ? param2 : param1;
    const query = { event_id: eventId };
    if (param2 && mongoose.Types.ObjectId.isValid(param1)) {
      query.merchant_id = param1;
    }
    return WebhookEvent.findOneAndUpdate(
      query,
      { $set: { processing_status: 'failed', error } },
      { new: true }
    );
  }
}

module.exports = new WebhookRepository();
