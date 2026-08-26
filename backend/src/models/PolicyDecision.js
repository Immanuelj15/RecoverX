const mongoose = require('mongoose');

const RuleEvaluationSchema = new mongoose.Schema(
  {
    rule: { type: String, required: true },
    result: { type: String, enum: ['PASS', 'FAIL', 'WARN'], required: true },
    reason: { type: String, required: true }
  },
  { _id: false }
);

const PolicyDecisionSchema = new mongoose.Schema(
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
    ai_decision_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIDecision'
    },
    policy_version: {
      type: String,
      default: 'v1.0.0'
    },
    input: {
      recovery_probability: { type: Number, required: true },
      retry_count: { type: Number, required: true },
      amount_paise: { type: Number, required: true },
      current_status: { type: String, required: true }
    },
    rules_evaluated: [RuleEvaluationSchema],
    decision: {
      type: String,
      enum: ['ALLOW', 'BLOCK', 'ESCALATE'],
      required: true
    },
    approved_action: {
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
    reason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

PolicyDecisionSchema.index({ recovery_case_id: 1, created_at: -1 });
PolicyDecisionSchema.index({ merchant_id: 1, created_at: -1 });

module.exports = mongoose.model('PolicyDecision', PolicyDecisionSchema);
