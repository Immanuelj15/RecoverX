const { validatePaymentPayload, validateAiRecommendation } = require('../src/utils/validators');
const { Transaction, AuditLog } = require('../src/models');

describe('Phase 3: Validation + Indexes Tests', () => {
  describe('Payload Validators', () => {
    test('validatePaymentPayload approves valid payment data', () => {
      const result = validatePaymentPayload({
        payment_id: 'pay_100',
        customer_id: 'cust_100',
        amount_inr: 8499,
        payment_method: 'upi',
        failure_reason: 'insufficient_balance',
        subscription_status: 'active',
        retry_count: 0
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('validatePaymentPayload rejects invalid method and failure reason', () => {
      const result = validatePaymentPayload({
        payment_id: 'pay_101',
        customer_id: 'cust_101',
        amount_inr: -500,
        payment_method: 'crypto',
        failure_reason: 'magic_error'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('validateAiRecommendation approves allowed action within set', () => {
      const res = validateAiRecommendation({
        recommended_action: 'DELAYED_RETRY',
        confidence: 0.92
      });
      expect(res.isValid).toBe(true);
    });

    test('validateAiRecommendation blocks unauthorized action', () => {
      const res = validateAiRecommendation({
        recommended_action: 'DIRECT_PAYMENT_EXECUTE',
        confidence: 0.99
      });
      expect(res.isValid).toBe(false);
      expect(res.reason).toContain('not in permitted action set');
    });
  });

  describe('Mongoose Schema Indexes', () => {
    test('Transaction schema defines compound indexes', () => {
      const indexes = Transaction.schema.indexes();
      const indexKeys = indexes.map(idx => Object.keys(idx[0]));
      expect(indexKeys).toContainEqual(['customer_id', 'created_at']);
      expect(indexKeys).toContainEqual(['recovery_state', 'recovery_probability']);
      expect(indexKeys).toContainEqual(['failure_reason', 'payment_method']);
    });

    test('AuditLog schema defines compound query indexes', () => {
      const indexes = AuditLog.schema.indexes();
      const indexKeys = indexes.map(idx => Object.keys(idx[0]));
      expect(indexKeys).toContainEqual(['payment_id', 'timestamp']);
      expect(indexKeys).toContainEqual(['event_type', 'timestamp']);
    });
  });
});
