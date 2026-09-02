const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const recoveryWorkflowSchema = new mongoose.Schema({
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
  currentStep: {
    type: Number,
    default: 1, // 1: Detect & Diagnose, 2: Safety Check, 3: Intervention, 4: Resolution
    min: 1,
    max: 4
  },
  assignedStrategy: {
    type: String, // e.g., 'Dunning Retry Sequencer', 'Hinglish Voice AI Call', 'WhatsApp Offer'
  },
  retriesCount: {
    type: Number,
    default: 0,
    max: 3
  },
  stopRuleTriggered: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

recoveryWorkflowSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RecoveryWorkflow', recoveryWorkflowSchema);
