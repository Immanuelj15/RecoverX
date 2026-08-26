const mongoose = require('mongoose');

const RecoveryCaseSchema = new mongoose.Schema(
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
    case_id: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: [
        'DETECTED',
        'ANALYZING',
        'PREDICTED',
        'RECOMMENDED',
        'POLICY_CHECK',
        'ACTION_APPROVED',
        'ACTION_EXECUTING',
        'RECOVERY_SUCCESS',
        'RECOVERY_FAILED',
        'ESCALATED',
        'STOPPED'
      ],
      default: 'DETECTED',
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    revenue_at_risk_paise: {
      type: Number,
      required: true,
      min: 0
    },
    current_recovery_probability: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1
    },
    current_action: {
      type: String,
      enum: [
        'SMART_RETRY',
        'DELAYED_RETRY',
        'PAYMENT_RECOVERY_NUDGE',
        'HUMAN_ESCALATION',
        'STOP'
      ],
      default: 'STOP'
    },
    attempt_count: {
      type: Number,
      default: 0,
      min: 0
    },
    max_attempts: {
      type: Number,
      default: 3,
      min: 1
    },
    escalation_required: {
      type: Boolean,
      default: false
    },
    opened_at: {
      type: Date,
      default: Date.now
    },
    closed_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Indexes
RecoveryCaseSchema.index({ merchant_id: 1, case_id: 1 }, { unique: true });
RecoveryCaseSchema.index({ merchant_id: 1, status: 1, created_at: -1 });
RecoveryCaseSchema.index({ merchant_id: 1, priority: 1, status: 1 });
RecoveryCaseSchema.index({ payment_id: 1, status: 1 });

module.exports = mongoose.model('RecoveryCase', RecoveryCaseSchema);
