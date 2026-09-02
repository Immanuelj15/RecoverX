const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const immutableAuditLogSchema = new mongoose.Schema({
  id: {
    type: String,
    default: randomUUID,
    unique: true,
    index: true
  },
  leakageEventId: {
    type: String, // References LeakageEvent.id
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  actor: {
    type: String,
    enum: ['SYSTEM_DETECT', 'RCA_ENGINE', 'STOPPING_RULE_CHECK', 'AI_AGENT', 'HUMAN_OVERRIDE'],
    required: true
  },
  logMessage: {
    type: String,
    required: true
  },
  reasonCode: {
    type: String
  },
  payload: {
    type: mongoose.Schema.Types.Mixed, // JSON snapshot
    default: {}
  }
});

module.exports = mongoose.model('ImmutableAuditLog', immutableAuditLogSchema);
