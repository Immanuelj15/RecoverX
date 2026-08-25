const mongoose = require('mongoose');

const policyConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'global_policy'
  },
  max_retry_count: {
    type: Number,
    default: 3,
    min: 1
  },
  high_value_threshold_inr: {
    type: Number,
    default: 50000,
    min: 0
  },
  min_recovery_probability_threshold: {
    type: Number,
    default: 0.3,
    min: 0,
    max: 1
  },
  human_escalation_threshold_inr: {
    type: Number,
    default: 50000,
    min: 0
  },
  allowed_actions: {
    type: [String],
    default: [
      'SMART_RETRY',
      'DELAYED_RETRY',
      'PAYMENT_RECOVERY_NUDGE',
      'HUMAN_ESCALATION',
      'STOP'
    ]
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const PolicyConfig = mongoose.model('PolicyConfig', policyConfigSchema);

module.exports = PolicyConfig;
