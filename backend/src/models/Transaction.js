const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: [true, 'Payment ID is required'],
    unique: true,
    trim: true,
    index: true
  },
  customer_id: {
    type: String,
    required: [true, 'Customer ID is required'],
    trim: true,
    index: true
  },
  amount_inr: {
    type: Number,
    required: [true, 'Amount in INR is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
    trim: true
  },
  payment_method: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['upi', 'card', 'netbanking', 'wallet']
  },
  payment_status: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: ['failed', 'captured', 'pending', 'processing']
  },
  failure_reason: {
    type: String,
    required: [true, 'Failure reason is required'],
    enum: [
      'insufficient_balance',
      'bank_declined',
      'card_expired',
      'network_timeout',
      'authentication_failure',
      'unknown'
    ]
  },
  previous_successes: {
    type: Number,
    default: 0,
    min: 0
  },
  previous_failures: {
    type: Number,
    default: 0,
    min: 0
  },
  retry_count: {
    type: Number,
    default: 0,
    min: 0
  },
  customer_ltv_inr: {
    type: Number,
    default: 0,
    min: 0
  },
  subscription_status: {
    type: String,
    required: [true, 'Subscription status is required'],
    enum: ['active', 'pending', 'none', 'halted']
  },
  recovered: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  outcome: {
    type: String,
    enum: ['failed_unrecovered', 'failed_recovered', 'in_recovery', 'stopped', 'escalated'],
    default: 'failed_unrecovered'
  },
  recovery_state: {
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
    default: 'DETECTED'
  },
  recovery_probability: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  risk_band: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: null
  },
  ai_recommendation: {
    recommended_action: { type: String, default: null },
    reason: { type: String, default: null },
    confidence: { type: Number, default: null },
    requires_human_approval: { type: Boolean, default: false }
  },
  policy_decision: {
    allowed: { type: Boolean, default: null },
    decision: { type: String, default: null },
    rules_triggered: [{ type: String }]
  },
  executed_action: {
    type: String,
    default: null
  },
  amount_recovered: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
