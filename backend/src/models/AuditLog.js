const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    merchant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true
    },
    recovery_case_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecoveryCase'
    },
    payment_id: {
      type: String,
      required: true,
      trim: true
    },
    event_type: {
      type: String,
      enum: [
        'PAYMENT_FAILED',
        'CASE_CREATED',
        'ML_PREDICTION',
        'AI_RECOMMENDATION',
        'POLICY_CHECK',
        'ACTION_APPROVED',
        'ACTION_BLOCKED',
        'ACTION_EXECUTED',
        'RECOVERY_SUCCESS',
        'RECOVERY_FAILED',
        'HUMAN_ESCALATION',
        'WEBHOOK_RECEIVED',
        'DUPLICATE_WEBHOOK',
        'LLM_FAILURE',
        'ML_FAILURE',
        'POLICY_FAILURE',
        'INVALID_STATE_TRANSITION_ATTEMPT'
      ],
      required: true
    },
    actor: {
      type: {
        type: String,
        enum: ['SYSTEM', 'ML_MODEL', 'AI_AGENT', 'POLICY_ENGINE', 'RAZORPAY', 'USER'],
        default: 'SYSTEM'
      },
      id: { type: String, default: 'sys_recoverx' }
    },
    event: {
      action: { type: String, default: null },
      decision: { type: String, default: null },
      reason: { type: String, default: null },
      metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    correlation_id: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false // Manual timestamp field for immutable audit log
  }
);

AuditLogSchema.index({ recovery_case_id: 1, timestamp: -1 });
AuditLogSchema.index({ payment_id: 1, timestamp: -1 });
AuditLogSchema.index({ merchant_id: 1, timestamp: -1 });
AuditLogSchema.index({ correlation_id: 1, timestamp: -1 });
AuditLogSchema.index({ event_type: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
