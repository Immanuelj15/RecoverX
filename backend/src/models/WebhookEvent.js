const mongoose = require('mongoose');

const WebhookEventSchema = new mongoose.Schema(
  {
    merchant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true
    },
    event_id: {
      type: String,
      required: true,
      trim: true
    },
    event_type: {
      type: String,
      required: true,
      default: 'payment.failed'
    },
    provider: {
      type: String,
      default: 'razorpay'
    },
    payload_hash: {
      type: String,
      default: null
    },
    processing_status: {
      type: String,
      enum: ['received', 'processing', 'processed', 'failed', 'duplicate'],
      default: 'received',
      required: true
    },
    processed_at: {
      type: Date,
      default: null
    },
    received_at: {
      type: Date,
      default: Date.now
    },
    error: {
      code: { type: String, default: null },
      message: { type: String, default: null }
    }
  },
  {
    timestamps: false
  }
);

// Compound Unique Index to prevent duplicate webhook processing
WebhookEventSchema.index({ merchant_id: 1, event_id: 1 }, { unique: true });

module.exports = mongoose.model('WebhookEvent', WebhookEventSchema);
