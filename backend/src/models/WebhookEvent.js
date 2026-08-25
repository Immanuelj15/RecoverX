const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: [true, 'Event ID is required'],
    unique: true,
    index: true
  },
  event_type: {
    type: String,
    required: [true, 'Event type is required']
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  processed: {
    type: Boolean,
    default: false,
    index: true
  },
  processed_at: {
    type: Date,
    default: null
  },
  error: {
    type: String,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);

module.exports = WebhookEvent;
