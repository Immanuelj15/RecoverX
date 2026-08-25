const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: [true, 'Payment ID is required'],
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  correlation_id: {
    type: String,
    index: true
  },
  event_type: {
    type: String,
    required: [true, 'Event type is required']
  },
  failure_reason: {
    type: String
  },
  recovery_probability: {
    type: Number
  },
  ai_recommendation: {
    type: String
  },
  policy_decision: {
    type: String
  },
  action: {
    type: String
  },
  result: {
    type: String
  },
  amount_recovered: {
    type: Number,
    default: 0
  },
  model_version: {
    type: String,
    default: 'v1.0.0'
  },
  agent_version: {
    type: String,
    default: 'v1.0.0'
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: false
});

auditLogSchema.index({ payment_id: 1, timestamp: -1 });
auditLogSchema.index({ event_type: 1, timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
