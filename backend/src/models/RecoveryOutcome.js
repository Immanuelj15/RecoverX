const mongoose = require('mongoose');

const RecoveryOutcomeSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecoveryAction'
    },
    result: {
      type: String,
      enum: ['RECOVERED', 'FAILED', 'PARTIAL', 'EXPIRED'],
      required: true
    },
    amount_at_risk_paise: {
      type: Number,
      required: true,
      min: 0
    },
    amount_recovered_paise: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v) {
          return v <= this.amount_at_risk_paise;
        },
        message: 'amount_recovered_paise cannot exceed amount_at_risk_paise'
      }
    },
    recovery_method: {
      type: String,
      default: 'SMART_RETRY'
    },
    recovered_at: {
      type: Date,
      default: Date.now
    },
    verification: {
      verified: { type: Boolean, default: true },
      source: {
        type: String,
        enum: ['razorpay_test_event', 'simulation', 'manual_verification'],
        default: 'razorpay_test_event'
      }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

RecoveryOutcomeSchema.index({ merchant_id: 1, recovered_at: -1 });
RecoveryOutcomeSchema.index({ recovery_case_id: 1 });
RecoveryOutcomeSchema.index({ payment_id: 1 });
RecoveryOutcomeSchema.index({ merchant_id: 1, result: 1, recovered_at: -1 });

module.exports = mongoose.model('RecoveryOutcome', RecoveryOutcomeSchema);
