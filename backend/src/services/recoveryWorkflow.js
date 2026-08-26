const { recoveryStateMachine, RECOVERY_STATES } = require('./recoveryStateMachine');
const TransactionRepository = require('../repositories/TransactionRepository');
const paymentRepository = require('../repositories/paymentRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const PolicyRepository = require('../repositories/PolicyRepository');
const logger = require('../utils/logger');

class RecoveryWorkflowService {
  /**
   * Deterministic heuristic probability calculator fallback when ML service is offline
   */
  calculateFallbackProbability(txn) {
    let score = 0.5;

    // LTV factor
    if (txn.customer_ltv_inr > 30000) score += 0.2;
    else if (txn.customer_ltv_inr < 5000) score -= 0.1;

    // Historical success ratio
    const totalTxns = (txn.previous_successes || 0) + (txn.previous_failures || 0);
    if (totalTxns > 0) {
      const ratio = txn.previous_successes / totalTxns;
      score += (ratio - 0.5) * 0.3;
    }

    // Failure reason weight
    if (txn.failure_reason === 'insufficient_balance') score += 0.15;
    else if (txn.failure_reason === 'network_timeout') score += 0.2;
    else if (txn.failure_reason === 'card_expired') score -= 0.3;
    else if (txn.failure_reason === 'bank_declined') score -= 0.1;

    // Retry penalty
    score -= (txn.retry_count || 0) * 0.15;

    // Clamp score between 0.05 and 0.95
    return Math.min(0.95, Math.max(0.05, parseFloat(score.toFixed(2))));
  }

  /**
   * Deterministic recommendation fallback when LLM is offline
   */
  generateFallbackRecommendation(txn, probability) {
    if (txn.retry_count >= 3) {
      return {
        recommended_action: 'STOP',
        reason: 'Maximum automated retries reached.',
        confidence: 0.95,
        requires_human_approval: false
      };
    }

    if (txn.amount_inr >= 50000) {
      return {
        recommended_action: 'HUMAN_ESCALATION',
        reason: 'High-value transaction exceeds automated processing threshold.',
        confidence: 0.9,
        requires_human_approval: true
      };
    }

    if (probability >= 0.7) {
      if (txn.failure_reason === 'insufficient_balance') {
        return {
          recommended_action: 'DELAYED_RETRY',
          reason: 'High recovery probability customer experiencing temporary balance issue.',
          confidence: probability,
          requires_human_approval: false
        };
      }
      return {
        recommended_action: 'SMART_RETRY',
        reason: 'High recovery probability transaction suitable for immediate smart retry.',
        confidence: probability,
        requires_human_approval: false
      };
    } else if (probability >= 0.4) {
      return {
        recommended_action: 'PAYMENT_RECOVERY_NUDGE',
        reason: 'Medium recovery probability. Customer intervention recommended via nudge.',
        confidence: probability,
        requires_human_approval: false
      };
    } else {
      return {
        recommended_action: 'HUMAN_ESCALATION',
        reason: 'Low recovery probability requires manual agent intervention.',
        confidence: probability,
        requires_human_approval: true
      };
    }
  }

  /**
   * Evaluates deterministic policy guardrails against transaction and recommendation
   */
  evaluatePolicyGuardrails(txn, recommendation, policyConfig = {}, probability = 0.5) {
    const rulesTriggered = [];
    let allowed = true;
    let decision = 'ALLOWED';

    const maxRetryCount = policyConfig.max_retry_count ?? 3;
    const highValueThreshold = policyConfig.high_value_threshold_inr ?? 50000;
    const minThreshold = policyConfig.min_recovery_probability_threshold ?? 0.3;
    const allowedActions = policyConfig.allowed_actions || ['SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP'];

    if (txn.retry_count >= maxRetryCount) {
      allowed = false;
      decision = 'STOP';
      rulesTriggered.push(`EXCEEDED_MAX_RETRIES (${txn.retry_count} >= ${maxRetryCount})`);
    } else if ((txn.amount_inr || 0) >= highValueThreshold) {
      allowed = false;
      decision = 'ESCALATE';
      rulesTriggered.push(`HIGH_VALUE_THRESHOLD (${txn.amount_inr} >= ${highValueThreshold})`);
    } else if (probability < minThreshold) {
      allowed = false;
      decision = 'ESCALATE';
      rulesTriggered.push(`LOW_PROBABILITY_THRESHOLD (${probability} < ${minThreshold})`);
    } else if (!allowedActions.includes(recommendation.recommended_action)) {
      allowed = false;
      decision = 'BLOCK';
      rulesTriggered.push(`UNPERMITTED_ACTION (${recommendation.recommended_action})`);
    }

    return { allowed, decision, rules_triggered: rulesTriggered };
  }

  /**
   * Executes the full bounded recovery workflow for a failed payment
   */
  async processRecoveryWorkflow(paymentId, customCorrelationId = null) {
    const correlationId = customCorrelationId || `corr_${paymentId}_${Date.now()}`;
    logger.info(`Starting Recovery Workflow for ${paymentId} [${correlationId}]`);

    // 1. Fetch transaction
    const txn = (await TransactionRepository.findByPaymentId(paymentId)) || (await paymentRepository.findByPaymentId(null, paymentId));
    if (!txn) {
      throw new Error(`Transaction with payment_id '${paymentId}' not found`);
    }

    // 2. DETECTED -> ANALYZING
    await recoveryStateMachine.transition(paymentId, RECOVERY_STATES.ANALYZING, { correlation_id: correlationId });

    // 3. Calculate recovery probability (PREDICTED)
    const probability = this.calculateFallbackProbability(txn);
    const riskBand = probability >= 0.7 ? 'HIGH' : probability >= 0.4 ? 'MEDIUM' : 'LOW';

    await recoveryStateMachine.transition(paymentId, RECOVERY_STATES.PREDICTED, {
      correlation_id: correlationId,
      fields: { recovery_probability: probability, risk_band: riskBand }
    });

    // 4. Generate AI recommendation (RECOMMENDED)
    const recommendation = this.generateFallbackRecommendation(txn, probability);
    await recoveryStateMachine.transition(paymentId, RECOVERY_STATES.RECOMMENDED, {
      correlation_id: correlationId,
      fields: { ai_recommendation: recommendation }
    });

    // 5. Evaluate policy engine guardrails (POLICY_CHECK)
    const policyConfig = await PolicyRepository.getGlobalPolicy();
    const policyEvaluation = this.evaluatePolicyGuardrails(txn, recommendation, policyConfig, probability);

    await recoveryStateMachine.transition(paymentId, RECOVERY_STATES.POLICY_CHECK, {
      correlation_id: correlationId,
      fields: { policy_decision: policyEvaluation }
    });

    // 6. Execute branching actions
    if (!policyEvaluation.allowed) {
      const finalState = policyEvaluation.decision === 'STOP' ? RECOVERY_STATES.STOPPED : RECOVERY_STATES.ESCALATED;
      return recoveryStateMachine.transition(paymentId, finalState, {
        correlation_id: correlationId,
        auditDetails: { reason: policyEvaluation.rules_triggered.join('; ') }
      });
    }

    // 7. ACTION_APPROVED -> ACTION_EXECUTING
    await recoveryStateMachine.transition(paymentId, RECOVERY_STATES.ACTION_APPROVED, {
      correlation_id: correlationId,
      fields: { executed_action: recommendation.recommended_action }
    });

    await recoveryStateMachine.transition(paymentId, RECOVERY_STATES.ACTION_EXECUTING, { correlation_id: correlationId });

    // 8. Execute recovery action via RecoveryExecutorService
    const recoveryExecutor = require('./recoveryExecutor');
    return recoveryExecutor.executeRecoveryAction(txn, recommendation.recommended_action, correlationId);
  }
}

module.exports = new RecoveryWorkflowService();
