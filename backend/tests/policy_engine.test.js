const policyEngine = require('../src/services/policyEngine');

describe('Phase 13: Policy / Guardrail Engine Tests', () => {
  const defaultPolicy = {
    max_retry_count: 3,
    high_value_threshold_inr: 50000,
    min_recovery_probability_threshold: 0.30,
    permitted_actions: ['SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP']
  };

  test('Permitted action and normal transaction passes policy check', async () => {
    const txn = { payment_id: 'p1', amount_inr: 5000, retry_count: 1, recovery_probability: 0.8, failure_reason: 'insufficient_balance' };
    const rec = { recommended_action: 'DELAYED_RETRY', requires_human_approval: false };

    const decision = await policyEngine.evaluatePolicy(txn, rec, defaultPolicy);

    expect(decision.approved).toBe(true);
    expect(decision.action).toEqual('DELAYED_RETRY');
    expect(decision.requires_human_approval).toBe(false);
  });

  test('Exceeding max retry limit blocks retry and sets action to STOP', async () => {
    const txn = { payment_id: 'p2', amount_inr: 5000, retry_count: 3, recovery_probability: 0.8, failure_reason: 'insufficient_balance' };
    const rec = { recommended_action: 'SMART_RETRY', requires_human_approval: false };

    const decision = await policyEngine.evaluatePolicy(txn, rec, defaultPolicy);

    expect(decision.approved).toBe(false);
    expect(decision.action).toEqual('STOP');
    expect(decision.rejection_reason).toContain('maximum policy limit');
  });

  test('High value transaction requires human approval and forces HUMAN_ESCALATION', async () => {
    const txn = { payment_id: 'p3', amount_inr: 75000, retry_count: 0, recovery_probability: 0.9, failure_reason: 'bank_declined' };
    const rec = { recommended_action: 'SMART_RETRY', requires_human_approval: false };

    const decision = await policyEngine.evaluatePolicy(txn, rec, defaultPolicy);

    expect(decision.approved).toBe(true);
    expect(decision.action).toEqual('HUMAN_ESCALATION');
    expect(decision.requires_human_approval).toBe(true);
  });

  test('Unrecoverable failure reason (card_expired) stops intervention', async () => {
    const txn = { payment_id: 'p4', amount_inr: 1500, retry_count: 0, recovery_probability: 0.7, failure_reason: 'card_expired' };
    const rec = { recommended_action: 'SMART_RETRY', requires_human_approval: false };

    const decision = await policyEngine.evaluatePolicy(txn, rec, defaultPolicy);

    expect(decision.approved).toBe(false);
    expect(decision.action).toEqual('STOP');
    expect(decision.rejection_reason).toContain('unrecoverable');
  });

  test('Low recovery probability below threshold stops intervention', async () => {
    const txn = { payment_id: 'p5', amount_inr: 2000, retry_count: 0, recovery_probability: 0.15, failure_reason: 'bank_declined' };
    const rec = { recommended_action: 'SMART_RETRY', requires_human_approval: false };

    const decision = await policyEngine.evaluatePolicy(txn, rec, defaultPolicy);

    expect(decision.approved).toBe(false);
    expect(decision.action).toEqual('STOP');
    expect(decision.rejection_reason).toContain('minimum policy threshold');
  });
});
