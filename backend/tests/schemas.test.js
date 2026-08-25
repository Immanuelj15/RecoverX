const { Transaction, AuditLog, WebhookEvent, PolicyConfig } = require('../src/models');

describe('Phase 2: Mongoose Schemas Validation Tests', () => {
  test('Transaction schema validates required fields', () => {
    const txn = new Transaction({});
    const err = txn.validateSync();
    expect(err.errors.payment_id).toBeDefined();
    expect(err.errors.customer_id).toBeDefined();
    expect(err.errors.amount_inr).toBeDefined();
    expect(err.errors.payment_method).toBeDefined();
    expect(err.errors.failure_reason).toBeDefined();
  });

  test('Transaction schema enforces valid enum values', () => {
    const txn = new Transaction({
      payment_id: 'pay_123',
      customer_id: 'cust_123',
      amount_inr: 5000,
      payment_method: 'invalid_method',
      payment_status: 'failed',
      failure_reason: 'insufficient_balance',
      subscription_status: 'active'
    });
    const err = txn.validateSync();
    expect(err.errors.payment_method).toBeDefined();
  });

  test('Transaction schema sets correct default state and currency', () => {
    const txn = new Transaction({
      payment_id: 'pay_999',
      customer_id: 'cust_999',
      amount_inr: 8499,
      payment_method: 'upi',
      payment_status: 'failed',
      failure_reason: 'insufficient_balance',
      subscription_status: 'pending'
    });
    expect(txn.currency).toEqual('INR');
    expect(txn.recovery_state).toEqual('DETECTED');
    expect(txn.recovered).toEqual(0);
    expect(txn.retry_count).toEqual(0);
  });

  test('AuditLog schema validates required event fields', () => {
    const audit = new AuditLog({});
    const err = audit.validateSync();
    expect(err.errors.payment_id).toBeDefined();
    expect(err.errors.event_type).toBeDefined();
  });

  test('WebhookEvent schema validates required event_id and payload', () => {
    const event = new WebhookEvent({});
    const err = event.validateSync();
    expect(err.errors.event_id).toBeDefined();
    expect(err.errors.event_type).toBeDefined();
    expect(err.errors.payload).toBeDefined();
  });

  test('PolicyConfig schema initializes with default guardrails', () => {
    const policy = new PolicyConfig({});
    expect(policy.max_retry_count).toEqual(3);
    expect(policy.high_value_threshold_inr).toEqual(50000);
    expect(policy.allowed_actions).toContain('SMART_RETRY');
  });
});
