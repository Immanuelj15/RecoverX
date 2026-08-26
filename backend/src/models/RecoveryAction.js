const mongoose = require('mongoose');

const RecoveryActionSchema = new mongoose.Schema(
  {
    merchant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true
    },
    recovery_case_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecoveryCase',
      required: true
    },
    payment_id: {
      type: String,
      required: true,
      trim: true
    },
    action_id: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: [
        'SMART_RETRY',
        'DELAYED_RETRY',
        'PAYMENT_RECOVERY_NUDGE',
        'HUMAN_ESCALATION',
        'STOP'
      ],
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'EXECUTING', 'SUCCESS', 'FAILED', 'BLOCKED', 'CANCELLED'],
      default: 'PENDING',
      required: true
    },
    execution: {
      provider: { type: String, default: 'razorpay_test_mode' },
      provider_request_id: { type: String, default: null },
      started_at: { type: Date, default: Date.now },
      completed_at: { type: Date, default: null }
    },
    retry_number: {
      type: Number,
      default: 1,
      min: 1
    },
    idempotency_key: {
      type: String,
      required: true,
      trim: true
    },
    error: {
      code: { type: String, default: null },
      message: { type: String, default: null }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

RecoveryActionSchema.index({ merchant_id: 1, created_at: -1 });
RecoveryActionSchema.index({ recovery_case_id: 1, created_at: -1 });
RecoveryActionSchema.index({ payment_id: 1, created_at: -1 });
RecoveryActionSchema.index({ idempotency_key: 1 }, { unique: true });

module.exports = mongoose.model('RecoveryAction', RecoveryActionSchema);
