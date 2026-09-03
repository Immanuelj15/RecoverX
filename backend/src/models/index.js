const Merchant = require('./Merchant');
const Customer = require('./Customer');
const Payment = require('./Payment');
const RecoveryCase = require('./RecoveryCase');
const MLPrediction = require('./MLPrediction');
const AIDecision = require('./AIDecision');
const PolicyDecision = require('./PolicyDecision');
const RecoveryAction = require('./RecoveryAction');
const RecoveryOutcome = require('./RecoveryOutcome');
const AuditLog = require('./AuditLog');
const WebhookEvent = require('./WebhookEvent');

const Transaction = require('./Transaction');
const PolicyConfig = require('./PolicyConfig');

const VoiceCallLog = require('./VoiceCallLog');

module.exports = {
  // Core Fintech Models
  Merchant,
  Customer,
  Payment,
  RecoveryCase,
  MLPrediction,
  AIDecision,
  PolicyDecision,
  RecoveryAction,
  RecoveryOutcome,
  AuditLog,
  WebhookEvent,
  VoiceCallLog,

  // Legacy Models for test backwards compatibility
  Transaction,
  PolicyConfig
};
