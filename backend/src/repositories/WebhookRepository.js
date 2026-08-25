const { WebhookEvent } = require('../models');

class WebhookRepository {
  async saveEvent(eventData) {
    const webhookEvent = new WebhookEvent(eventData);
    return webhookEvent.save();
  }

  async findByEventId(eventId) {
    return WebhookEvent.findOne({ event_id: eventId });
  }

  async markProcessed(eventId, error = null) {
    return WebhookEvent.findOneAndUpdate(
      { event_id: eventId },
      {
        $set: {
          processed: !error,
          processed_at: new Date(),
          error: error ? error.message || String(error) : null
        }
      },
      { new: true }
    );
  }
}

module.exports = new WebhookRepository();
