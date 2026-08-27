const { ALLOWED_ACTIONS } = require('../utils/validators');
const PolicyRepository = require('../repositories/PolicyRepository');
const logger = require('../utils/logger');

class PolicyEngine {
  constructor() {
    this.policyVersion = 'v1.0.0';
  }

  /**
   * Evaluates business rules and security guardrails against a proposed AI recommendation
   */
  async evaluatePolicy(txn, recommendation, customConfig = null) {
    const config = customConfig || (await PolicyRepository.getGlobalPolicy()) || {};

    const amountInr = txn.amount_paise ? (txn.amount_paise / 100) : (txn.amount_inr || 0);
    const maxRetries = config.max_retry_count ?? 3;
    const highValueThreshold = config.high_value_threshold_inr ?? (config.high_value_threshold_paise ? config.high_value_threshold_paise / 100 : 50000);
    const minProbabilityThreshold = config.min_recovery_probability_threshold ?? 0.30;
    const permittedActions = config.permitted_actions || config.allowed_actions || config.settings?.allowed_actions || ALLOWED_ACTIONS;

    let proposedAction = recommendation.recommended_action || recommendation.action || 'STOP';
    let requiresHumanApproval = Boolean(recommendation.requires_human_approval);
    let rejectionReason = null;
    let approved = true;

    // Guardrail Rule 1: Action Permitted Set Check
    if (!permittedActions.includes(proposedAction)) {
      approved = false;
      proposedAction = 'STOP';
      rejectionReason = `Proposed action '${recommendation.recommended_action || recommendation.action}' is not in permitted policy allowlist.`;
    }

    // Guardrail Rule 2: Unrecoverable Failure Reason
    const UNRECOVERABLE_REASONS = ['card_expired', 'invalid_account', 'account_closed', 'fraud_suspected'];
    if (UNRECOVERABLE_REASONS.includes(txn.failure_reason)) {
      approved = false;
      proposedAction = 'STOP';
      rejectionReason = `Failure reason '${txn.failure_reason}' is unrecoverable via automated retry.`;
    }

    // Guardrail Rule 3: Max Retry Count Limit
    if (approved && (txn.retry_count || 0) >= maxRetries && ['SMART_RETRY', 'DELAYED_RETRY'].includes(proposedAction)) {
      approved = false;
      proposedAction = 'STOP';
      rejectionReason = `Transaction retry count (${txn.retry_count || 0}) has reached maximum policy limit (${maxRetries}).`;
    }

    // Guardrail Rule 4: Minimum Recovery Probability Threshold
    if (approved && (txn.recovery_probability ?? 1.0) < minProbabilityThreshold && proposedAction !== 'STOP') {
      approved = false;
      proposedAction = 'STOP';
      rejectionReason = `Recovery probability (${txn.recovery_probability}) is below minimum policy threshold (${minProbabilityThreshold}).`;
    }

    // Guardrail Rule 5: High Value Transaction Approval Requirement
    if (approved && amountInr >= highValueThreshold) {
      requiresHumanApproval = true;
      if (proposedAction !== 'HUMAN_ESCALATION') {
        proposedAction = 'HUMAN_ESCALATION';
        rejectionReason = `High-value transaction (₹${amountInr} >= ₹${highValueThreshold}) requires human approval.`;
      }
    }

    const decision = {
      approved,
      action: proposedAction,
      requires_human_approval: requiresHumanApproval,
      rejection_reason: rejectionReason,
      policy_version: this.policyVersion
    };

    logger.info(`Policy Decision for ${txn.payment_id}: Approved=${decision.approved}, Action=${decision.action}, Reason=${decision.rejection_reason || 'None'}`);

    return decision;
  }
}

module.exports = new PolicyEngine();
