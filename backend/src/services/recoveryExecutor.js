const razorpayService = require('./razorpayService');
const { recoveryStateMachine, RECOVERY_STATES } = require('./recoveryStateMachine');
const TransactionRepository = require('../repositories/TransactionRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');
const recoveryActionRepository = require('../repositories/recoveryActionRepository');
const recoveryOutcomeRepository = require('../repositories/recoveryOutcomeRepository');
const logger = require('../utils/logger');

class RecoveryExecutorService {
  /**
   * Executes a policy-approved recovery action for a transaction
   * @param {Object} txn - The transaction document
   * @param {String} action - Recommended action ('SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP')
   * @param {String} correlationId - Correlation ID for audit tracing
   */
  async executeRecoveryAction(txn, action, correlationId) {
    logger.info(`Executing recovery action '${action}' for ${txn.payment_id} [${correlationId}]`);

    // Create RecoveryAction record if merchant & case exist
    let actionRecord = null;
    if (txn.merchant_id && (txn.case_id || txn._id)) {
      try {
        actionRecord = await recoveryActionRepository.createAction({
          merchant_id: txn.merchant_id,
          recovery_case_id: txn.case_id || txn._id,
          action_type: action,
          idempotency_key: `act_${txn.payment_id}_${action}_${Date.now()}`,
          status: 'executing'
        });
      } catch (err) {
        logger.warn(`Failed to log RecoveryAction: ${err.message}`);
      }
    }

    let result;
    switch (action) {
      case 'SMART_RETRY':
        result = await this.executeSmartRetry(txn, correlationId);
        break;

      case 'DELAYED_RETRY':
        result = await this.executeDelayedRetry(txn, correlationId);
        break;

      case 'PAYMENT_RECOVERY_NUDGE':
        result = await this.executePaymentNudge(txn, correlationId);
        break;

      case 'HUMAN_ESCALATION':
        result = await this.executeHumanEscalation(txn, correlationId);
        break;

      case 'STOP':
      default:
        result = await this.executeStop(txn, correlationId);
        break;
    }

    // Update Action & Outcome status
    if (actionRecord && actionRecord._id) {
      const actionStatus = result.success ? 'completed' : 'failed';
      await recoveryActionRepository.updateStatus(actionRecord._id, actionStatus);
    }

    if (txn.merchant_id && (txn.case_id || txn._id) && (result.success || action === 'STOP')) {
      const amountPaise = txn.amount_paise || Math.round((txn.amount_inr || 0) * 100);
      try {
        await recoveryOutcomeRepository.recordOutcome({
          merchant_id: txn.merchant_id,
          recovery_case_id: txn.case_id || txn._id,
          status: result.success ? 'RECOVERED' : 'UNRECOVERABLE',
          amount_recovered_paise: result.success ? amountPaise : 0,
          recovered_at: result.success ? new Date() : null
        });
      } catch (err) {
        logger.warn(`Failed to record RecoveryOutcome: ${err.message}`);
      }
    }

    return result;
  }

  /**
   * 1. SMART_RETRY: Immediate payment retry via Razorpay Test Mode integration
   */
  async executeSmartRetry(txn, correlationId) {
    const amountInr = txn.amount_paise ? (txn.amount_paise / 100) : (txn.amount_inr || 0);
    const result = await razorpayService.retryPayment(
      txn.payment_id,
      amountInr
    );

    const newRetryCount = (txn.retry_count || 0) + 1;

    if (result.success) {
      await recoveryStateMachine.transition(txn.payment_id, RECOVERY_STATES.RECOVERY_SUCCESS, {
        correlation_id: correlationId,
        fields: {
          retry_count: newRetryCount,
          last_retry_at: new Date()
        }
      });

      await AuditLogRepository.createLog({
        payment_id: txn.payment_id,
        event_type: 'ACTION_EXECUTED',
        performed_by: 'RECOVERY_EXECUTOR',
        previous_state: 'ACTION_EXECUTING',
        new_state: RECOVERY_STATES.RECOVERY_SUCCESS,
        details: { action: 'SMART_RETRY', success: true, retry_count: newRetryCount, razorpay_id: result.razorpay_payment_id }
      });

      return { status: RECOVERY_STATES.RECOVERY_SUCCESS, success: true, razorpay_result: result };
    } else {
      await recoveryStateMachine.transition(txn.payment_id, RECOVERY_STATES.RECOVERY_FAILED, {
        correlation_id: correlationId,
        fields: {
          retry_count: newRetryCount,
          last_retry_at: new Date()
        }
      });

      await AuditLogRepository.createLog({
        payment_id: txn.payment_id,
        event_type: 'ACTION_EXECUTED',
        performed_by: 'RECOVERY_EXECUTOR',
        previous_state: 'ACTION_EXECUTING',
        new_state: RECOVERY_STATES.RECOVERY_FAILED,
        details: { action: 'SMART_RETRY', success: false, retry_count: newRetryCount, error: result.error }
      });

      return { status: RECOVERY_STATES.RECOVERY_FAILED, success: false, razorpay_result: result };
    }
  }

  /**
   * 2. DELAYED_RETRY: Schedules a future retry attempt
   */
  async executeDelayedRetry(txn, correlationId, delayHours = 24) {
    const nextRetryAt = new Date(Date.now() + delayHours * 60 * 60 * 1000);

    await TransactionRepository.updateState(txn.payment_id, RECOVERY_STATES.ACTION_APPROVED, {
      next_retry_scheduled_at: nextRetryAt
    });

    await AuditLogRepository.createLog({
      payment_id: txn.payment_id,
      event_type: 'ACTION_EXECUTED',
      performed_by: 'RECOVERY_EXECUTOR',
      previous_state: 'ACTION_EXECUTING',
      new_state: RECOVERY_STATES.ACTION_APPROVED,
      details: { action: 'DELAYED_RETRY', next_retry_scheduled_at: nextRetryAt }
    });

    return { status: 'SCHEDULED', action: 'DELAYED_RETRY', next_retry_scheduled_at: nextRetryAt };
  }

  /**
   * 3. PAYMENT_RECOVERY_NUDGE: Generates customer payment link & logs nudge payload
   */
  async executePaymentNudge(txn, correlationId) {
    const amountInr = txn.amount_paise ? (txn.amount_paise / 100).toFixed(2) : (txn.amount_inr || 0);
    const recoveryLink = `https://recoverx.razorpay.com/pay/${txn.payment_id}`;
    const nudgePayload = {
      customer_id: txn.customer_id,
      payment_id: txn.payment_id,
      amount_inr: amountInr,
      recovery_link: recoveryLink,
      channels: ['SMS', 'WHATSAPP', 'EMAIL'],
      message: `Your payment of ₹${amountInr} failed. Complete your recovery here: ${recoveryLink}`
    };

    logger.info(`Generated Payment Recovery Nudge for ${txn.payment_id}: ${recoveryLink}`);

    await AuditLogRepository.createLog({
      payment_id: txn.payment_id,
      event_type: 'ACTION_EXECUTED',
      performed_by: 'RECOVERY_EXECUTOR',
      previous_state: 'ACTION_EXECUTING',
      new_state: RECOVERY_STATES.ACTION_APPROVED,
      details: { action: 'PAYMENT_RECOVERY_NUDGE', nudge_payload: nudgePayload }
    });

    return { status: 'NUDGE_SENT', action: 'PAYMENT_RECOVERY_NUDGE', nudge_payload: nudgePayload };
  }

  /**
   * 4. HUMAN_ESCALATION: Escalates transaction to merchant support dashboard
   */
  async executeHumanEscalation(txn, correlationId) {
    await recoveryStateMachine.transition(txn.payment_id, RECOVERY_STATES.ESCALATED, {
      correlation_id: correlationId
    });

    await AuditLogRepository.createLog({
      payment_id: txn.payment_id,
      event_type: 'ESCALATED_FOR_MANUAL_REVIEW',
      performed_by: 'RECOVERY_EXECUTOR',
      previous_state: 'ACTION_EXECUTING',
      new_state: RECOVERY_STATES.ESCALATED,
      details: { action: 'HUMAN_ESCALATION', reason: 'Policy or AI recommendation mandated human intervention' }
    });

    return { status: RECOVERY_STATES.ESCALATED, action: 'HUMAN_ESCALATION' };
  }

  /**
   * 5. STOP: Terminates recovery operations for transaction
   */
  async executeStop(txn, correlationId) {
    await recoveryStateMachine.transition(txn.payment_id, RECOVERY_STATES.STOPPED, {
      correlation_id: correlationId
    });

    await AuditLogRepository.createLog({
      payment_id: txn.payment_id,
      event_type: 'RECOVERY_STOPPED',
      performed_by: 'RECOVERY_EXECUTOR',
      previous_state: 'ACTION_EXECUTING',
      new_state: RECOVERY_STATES.STOPPED,
      details: { action: 'STOP', reason: 'Recovery process terminated by policy limit or unrecoverable reason' }
    });

    return { status: RECOVERY_STATES.STOPPED, action: 'STOP' };
  }
}

module.exports = new RecoveryExecutorService();
