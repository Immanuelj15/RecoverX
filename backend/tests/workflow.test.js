const RecoveryWorkflowService = require('../src/services/recoveryWorkflow');
const TransactionRepository = require('../src/repositories/TransactionRepository');
const PolicyRepository = require('../src/repositories/PolicyRepository');
const AuditLogRepository = require('../src/repositories/AuditLogRepository');

describe('Phase 7: Recovery Transaction Workflow Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calculateFallbackProbability returns calibrated score between 0.05 and 0.95', () => {
    const txnHigh = { customer_ltv_inr: 42000, previous_successes: 8, previous_failures: 1, failure_reason: 'insufficient_balance', retry_count: 0 };
    const probHigh = RecoveryWorkflowService.calculateFallbackProbability(txnHigh);
    expect(probHigh).toBeGreaterThanOrEqual(0.7);

    const txnLow = { customer_ltv_inr: 2000, previous_successes: 0, previous_failures: 4, failure_reason: 'card_expired', retry_count: 3 };
    const probLow = RecoveryWorkflowService.calculateFallbackProbability(txnLow);
    expect(probLow).toBeLessThan(0.4);
  });

  test('evaluatePolicyGuardrails blocks transactions exceeding max retries', () => {
    const txn = { retry_count: 3, amount_inr: 8499 };
    const recommendation = { recommended_action: 'DELAYED_RETRY' };
    const policy = { max_retry_count: 3, high_value_threshold_inr: 50000, min_recovery_probability_threshold: 0.3, allowed_actions: ['DELAYED_RETRY'] };

    const evaluation = RecoveryWorkflowService.evaluatePolicyGuardrails(txn, recommendation, policy, 0.85);
    expect(evaluation.allowed).toBe(false);
    expect(evaluation.decision).toEqual('STOP');
    expect(evaluation.rules_triggered[0]).toContain('EXCEEDED_MAX_RETRIES');
  });

  test('evaluatePolicyGuardrails escalates high-value transactions', () => {
    const txn = { retry_count: 0, amount_inr: 75000 };
    const recommendation = { recommended_action: 'SMART_RETRY' };
    const policy = { max_retry_count: 3, high_value_threshold_inr: 50000, min_recovery_probability_threshold: 0.3, allowed_actions: ['SMART_RETRY'] };

    const evaluation = RecoveryWorkflowService.evaluatePolicyGuardrails(txn, recommendation, policy, 0.9);
    expect(evaluation.allowed).toBe(false);
    expect(evaluation.decision).toEqual('ESCALATE');
    expect(evaluation.rules_triggered[0]).toContain('HIGH_VALUE_THRESHOLD');
  });

  test('processRecoveryWorkflow executes end-to-end workflow transitions cleanly', async () => {
    let mockTxn = {
      payment_id: 'pay_wf_001',
      customer_id: 'cust_wf_001',
      amount_inr: 8499,
      payment_method: 'upi',
      failure_reason: 'insufficient_balance',
      previous_successes: 8,
      previous_failures: 1,
      retry_count: 0,
      customer_ltv_inr: 42000,
      subscription_status: 'active',
      recovery_state: 'DETECTED'
    };

    const mockPolicy = {
      key: 'global_policy',
      max_retry_count: 3,
      high_value_threshold_inr: 50000,
      min_recovery_probability_threshold: 0.3,
      allowed_actions: ['SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP']
    };

    jest.spyOn(TransactionRepository, 'findByPaymentId').mockImplementation(async () => mockTxn);
    jest.spyOn(TransactionRepository, 'updateState').mockImplementation(async (id, state, patch) => {
      mockTxn = {
        ...mockTxn,
        recovery_state: state,
        ...patch
      };
      return mockTxn;
    });
    jest.spyOn(PolicyRepository, 'getGlobalPolicy').mockResolvedValue(mockPolicy);
    jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({ _id: 'audit_wf_1' });

    const result = await RecoveryWorkflowService.processRecoveryWorkflow('pay_wf_001');
    expect(result).toHaveProperty('recovery_state');
    expect(['RECOVERY_SUCCESS', 'RECOVERY_FAILED']).toContain(result.recovery_state);
  });
});
