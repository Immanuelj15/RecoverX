const TransactionRepository = require('../repositories/TransactionRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const logger = require('../utils/logger');

const RECOVERY_STATES = Object.freeze({
  DETECTED: 'DETECTED',
  ANALYZING: 'ANALYZING',
  PREDICTED: 'PREDICTED',
  RECOMMENDED: 'RECOMMENDED',
  POLICY_CHECK: 'POLICY_CHECK',
  ACTION_APPROVED: 'ACTION_APPROVED',
  ACTION_EXECUTING: 'ACTION_EXECUTING',
  RECOVERY_SUCCESS: 'RECOVERY_SUCCESS',
  RECOVERY_FAILED: 'RECOVERY_FAILED',
  ESCALATED: 'ESCALATED',
  STOPPED: 'STOPPED'
});

const ALLOWED_TRANSITIONS = Object.freeze({
  [RECOVERY_STATES.DETECTED]: [RECOVERY_STATES.ANALYZING, RECOVERY_STATES.STOPPED],
  [RECOVERY_STATES.ANALYZING]: [RECOVERY_STATES.PREDICTED, RECOVERY_STATES.STOPPED, RECOVERY_STATES.ESCALATED],
  [RECOVERY_STATES.PREDICTED]: [RECOVERY_STATES.RECOMMENDED, RECOVERY_STATES.STOPPED, RECOVERY_STATES.ESCALATED],
  [RECOVERY_STATES.RECOMMENDED]: [RECOVERY_STATES.POLICY_CHECK, RECOVERY_STATES.STOPPED, RECOVERY_STATES.ESCALATED],
  [RECOVERY_STATES.POLICY_CHECK]: [RECOVERY_STATES.ACTION_APPROVED, RECOVERY_STATES.STOPPED, RECOVERY_STATES.ESCALATED],
  [RECOVERY_STATES.ACTION_APPROVED]: [RECOVERY_STATES.ACTION_EXECUTING, RECOVERY_STATES.STOPPED, RECOVERY_STATES.ESCALATED],
  [RECOVERY_STATES.ACTION_EXECUTING]: [RECOVERY_STATES.RECOVERY_SUCCESS, RECOVERY_STATES.RECOVERY_FAILED, RECOVERY_STATES.STOPPED, RECOVERY_STATES.ESCALATED],
  [RECOVERY_STATES.RECOVERY_SUCCESS]: [],
  [RECOVERY_STATES.RECOVERY_FAILED]: [RECOVERY_STATES.ANALYZING, RECOVERY_STATES.STOPPED, RECOVERY_STATES.ESCALATED],
  [RECOVERY_STATES.ESCALATED]: [],
  [RECOVERY_STATES.STOPPED]: []
});

class InvalidStateTransitionError extends Error {
  constructor(fromState, toState) {
    super(`Invalid recovery state transition from '${fromState}' to '${toState}'`);
    this.name = 'InvalidStateTransitionError';
    this.fromState = fromState;
    this.toState = toState;
  }
}

class RecoveryStateMachine {
  canTransition(fromState, toState) {
    const validTargets = ALLOWED_TRANSITIONS[fromState];
    return Array.isArray(validTargets) && validTargets.includes(toState);
  }

  async transition(paymentId, targetState, transitionData = {}) {
    const txn = await TransactionRepository.findByPaymentId(paymentId);
    if (!txn) {
      throw new Error(`Transaction with payment_id '${paymentId}' not found`);
    }

    const currentState = txn.recovery_state || RECOVERY_STATES.DETECTED;

    if (!this.canTransition(currentState, targetState)) {
      logger.error(`Blocked invalid state transition for ${paymentId}: ${currentState} -> ${targetState}`);
      await AuditLogRepository.createLog({
        payment_id: paymentId,
        correlation_id: transitionData.correlation_id || `corr_${paymentId}`,
        event_type: 'INVALID_STATE_TRANSITION_ATTEMPT',
        action: targetState,
        result: 'BLOCKED',
        details: { fromState: currentState, toState: targetState, reason: 'Transition not allowed by state machine rules' }
      });
      throw new InvalidStateTransitionError(currentState, targetState);
    }

    // Perform state transition update
    const patch = { ...transitionData.fields };
    if (targetState === RECOVERY_STATES.RECOVERY_SUCCESS) {
      patch.recovered = 1;
      patch.outcome = 'failed_recovered';
      patch.amount_recovered = txn.amount_inr;
    } else if (targetState === RECOVERY_STATES.STOPPED) {
      patch.outcome = 'stopped';
    } else if (targetState === RECOVERY_STATES.ESCALATED) {
      patch.outcome = 'escalated';
    }

    const updatedTxn = await TransactionRepository.updateState(paymentId, targetState, patch);

    // Record audit event
    await AuditLogRepository.createLog({
      payment_id: paymentId,
      correlation_id: transitionData.correlation_id || `corr_${paymentId}`,
      event_type: `STATE_TRANSITION_${targetState}`,
      failure_reason: txn.failure_reason,
      recovery_probability: patch.recovery_probability || txn.recovery_probability,
      ai_recommendation: patch.ai_recommendation?.recommended_action || txn.ai_recommendation?.recommended_action,
      policy_decision: patch.policy_decision?.decision || txn.policy_decision?.decision,
      action: targetState,
      result: 'SUCCESS',
      amount_recovered: updatedTxn.amount_recovered || 0,
      details: { fromState: currentState, toState: targetState, ...transitionData.auditDetails }
    });

    logger.info(`Recovery state transition for ${paymentId}: ${currentState} -> ${targetState}`);
    return updatedTxn;
  }
}

module.exports = {
  RECOVERY_STATES,
  ALLOWED_TRANSITIONS,
  InvalidStateTransitionError,
  recoveryStateMachine: new RecoveryStateMachine()
};
