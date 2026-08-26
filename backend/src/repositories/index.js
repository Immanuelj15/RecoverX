const merchantRepository = require('./merchantRepository');
const customerRepository = require('./customerRepository');
const paymentRepository = require('./paymentRepository');
const recoveryCaseRepository = require('./recoveryCaseRepository');
const predictionRepository = require('./predictionRepository');
const aiDecisionRepository = require('./aiDecisionRepository');
const policyDecisionRepository = require('./policyDecisionRepository');
const recoveryActionRepository = require('./recoveryActionRepository');
const recoveryOutcomeRepository = require('./recoveryOutcomeRepository');
const auditRepository = require('./auditRepository');
const webhookRepository = require('./webhookRepository');

const TransactionRepository = require('./TransactionRepository');
const AuditLogRepository = require('./AuditLogRepository');
const PolicyRepository = require('./PolicyRepository');
const WebhookRepository = require('./WebhookRepository');

module.exports = {
  // New Fintech Repositories
  merchantRepository,
  customerRepository,
  paymentRepository,
  recoveryCaseRepository,
  predictionRepository,
  aiDecisionRepository,
  policyDecisionRepository,
  recoveryActionRepository,
  recoveryOutcomeRepository,
  auditRepository,
  webhookRepository,

  // Legacy Repositories for test compatibility
  TransactionRepository,
  AuditLogRepository,
  PolicyRepository,
  WebhookRepository
};
