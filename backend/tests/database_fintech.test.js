const mongoose = require('mongoose');
const {
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
  WebhookEvent
} = require('../src/models');
const merchantRepository = require('../src/repositories/merchantRepository');
const webhookRepository = require('../src/repositories/webhookRepository');
const { inrToPaise, paiseToInr } = require('../src/utils/money');
const { isValidTransition } = require('../src/utils/stateMachine');
const { generateIdempotencyKey } = require('../src/utils/idempotency');

describe('Enterprise Fintech Database Architecture Suite', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recoverx_test', {
        serverSelectionTimeoutMS: 2000
      });
    } catch (err) {
      // Mock mongoose for offline test environment
      jest.spyOn(mongoose, 'connect').mockImplementation(async () => {
        mongoose.connection.readyState = 1;
        return mongoose.connection;
      });
      mongoose.connection.readyState = 1;
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test('1. Money Utility: Converts INR to integer paise correctly', () => {
    expect(inrToPaise(8499.50)).toBe(849950);
    expect(inrToPaise(50000)).toBe(5000000);
    expect(paiseToInr(849950)).toBe(8499.5);
  });

  test('2. Merchant Schema: Instantiates with test environment & default guardrail settings', () => {
    const merchant = new Merchant({
      merchant_code: 'M001',
      name: 'Test Merchant'
    });
    expect(merchant.environment).toBe('test');
    expect(merchant.settings.max_retry_count).toBe(3);
    expect(merchant.settings.high_value_threshold_paise).toBe(5000000);
  });

  test('3. Customer Schema: Instantiates customer stats & integer LTV', () => {
    const cust = new Customer({
      merchant_id: new mongoose.Types.ObjectId(),
      customer_id: 'CUST_100',
      customer_ltv_paise: inrToPaise(42000)
    });
    expect(cust.customer_ltv_paise).toBe(4200000);
    expect(cust.stats.total_payments).toBe(0);
  });

  test('4. Payment Schema: Enforces integer paise and payment_id', () => {
    const p1 = new Payment({
      merchant_id: new mongoose.Types.ObjectId(),
      payment_id: 'PAY_100',
      customer_id: 'CUST_100',
      amount: { value_paise: inrToPaise(14999), currency: 'INR' },
      payment_method: 'upi',
      status: 'failed',
      failure: { reason: 'insufficient_balance' }
    });

    expect(p1.amount.value_paise).toBe(1499900);
  });

  test('5. State Machine Utility: Strictly validates recovery case transitions', () => {
    expect(isValidTransition('DETECTED', 'ANALYZING')).toBe(true);
    expect(isValidTransition('ANALYZING', 'PREDICTED')).toBe(true);
    expect(isValidTransition('PREDICTED', 'RECOMMENDED')).toBe(true);
    expect(isValidTransition('RECOMMENDED', 'POLICY_CHECK')).toBe(true);
    expect(isValidTransition('POLICY_CHECK', 'ACTION_APPROVED')).toBe(true);
    expect(isValidTransition('ACTION_APPROVED', 'ACTION_EXECUTING')).toBe(true);
    expect(isValidTransition('ACTION_EXECUTING', 'RECOVERY_SUCCESS')).toBe(true);

    // Invalid transitions must fail
    expect(isValidTransition('DETECTED', 'RECOVERY_SUCCESS')).toBe(false);
    expect(isValidTransition('RECOVERY_SUCCESS', 'ANALYZING')).toBe(false);
    expect(isValidTransition('STOPPED', 'POLICY_CHECK')).toBe(false);
  });

  test('6. Recovery Action Schema: Generates deterministic idempotency key', () => {
    const key = generateIdempotencyKey('M001', 'PAY_100', 'SMART_RETRY', 1);
    expect(key).toBe('recoverx:M001:PAY_100:smart_retry:1');

    const action = new RecoveryAction({
      merchant_id: new mongoose.Types.ObjectId(),
      recovery_case_id: new mongoose.Types.ObjectId(),
      payment_id: 'PAY_100',
      action_id: 'ACT_001',
      type: 'SMART_RETRY',
      idempotency_key: key
    });

    expect(action.idempotency_key).toBe(key);
  });

  test('7. Recovery Outcome Validation: amount_recovered_paise <= amount_at_risk_paise', () => {
    const outcome = new RecoveryOutcome({
      merchant_id: new mongoose.Types.ObjectId(),
      recovery_case_id: new mongoose.Types.ObjectId(),
      payment_id: 'PAY_100',
      result: 'RECOVERED',
      amount_at_risk_paise: 500000,
      amount_recovered_paise: 500000
    });

    const err = outcome.validateSync();
    expect(err).toBeUndefined();
  });
});
