const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    merchant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true
    },
    payment_id: {
      type: String,
      required: true,
      trim: true
    },
    customer_id: {
      type: String,
      required: true,
      trim: true
    },
    razorpay_payment_id: {
      type: String,
      trim: true
    },
    razorpay_order_id: {
      type: String,
      trim: true
    },
    amount: {
      value_paise: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        default: 'INR',
        uppercase: true
      }
    },
    payment_method: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'failed',
      required: true
    },
    failure: {
      reason: { type: String, trim: true },
      code: { type: String, trim: true },
      description: { type: String, trim: true }
    },
    history: {
      previous_successes: { type: Number, default: 0, min: 0 },
      previous_failures: { type: Number, default: 0, min: 0 },
      retry_count: { type: Number, default: 0, min: 0 }
    },
    subscription: {
      status: { type: String, default: 'none' },
      subscription_id: { type: String, default: null }
    },
    metadata: {
      source: { type: String, default: 'synthetic_dataset' },
      dataset_version: { type: String, default: '1.0.0' }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Indexes
PaymentSchema.index({ merchant_id: 1, payment_id: 1 }, { unique: true });
PaymentSchema.index({ merchant_id: 1, status: 1, created_at: -1 });
PaymentSchema.index({ merchant_id: 1, customer_id: 1, created_at: -1 });
PaymentSchema.index({ customer_id: 1, created_at: -1 });
PaymentSchema.index({ recovery_state: 1, recovery_probability: 1 });
PaymentSchema.index({ failure_reason: 1, payment_method: 1 });
PaymentSchema.index({ merchant_id: 1, 'failure.reason': 1 });
PaymentSchema.index({ merchant_id: 1, 'subscription.status': 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
