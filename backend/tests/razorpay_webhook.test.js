const request = require('supertest');
const app = require('../src/app');
const razorpayService = require('../src/services/razorpayService');
const idempotencyService = require('../src/services/idempotencyService');
const TransactionRepository = require('../src/repositories/TransactionRepository');
const RecoveryWorkflowService = require('../src/services/recoveryWorkflow');

describe('Phase 14: Razorpay Test Mode & Webhooks Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('verifyWebhookSignature returns true for valid HMAC SHA256 signature', () => {
    const secret = 'test_secret_123';
    const payload = JSON.stringify({ event: 'payment.failed' });
    const crypto = require('crypto');
    const validSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const isValid = razorpayService.verifyWebhookSignature(payload, validSignature, secret);
    expect(isValid).toBe(true);
  });

  test('verifyWebhookSignature returns false for invalid signature', () => {
    const isValid = razorpayService.verifyWebhookSignature('{"event":"payment.failed"}', 'bad_signature', 'test_secret_123');
    expect(isValid).toBe(false);
  });

  test('POST /api/v1/webhooks/razorpay processes payment.failed event and returns 200 OK', async () => {
    const mockTxn = { payment_id: 'pay_rzp_webhook_1', amount_inr: 8499, recovery_state: 'DETECTED' };
    jest.spyOn(idempotencyService, 'registerWebhookEvent').mockResolvedValue({ isDuplicate: false });
    jest.spyOn(idempotencyService, 'markEventProcessed').mockResolvedValue({});
    jest.spyOn(TransactionRepository, 'findByPaymentId').mockResolvedValue(mockTxn);
    jest.spyOn(TransactionRepository, 'create').mockResolvedValue(mockTxn);
    jest.spyOn(RecoveryWorkflowService, 'processRecoveryWorkflow').mockResolvedValue({});

    const webhookPayload = {
      event_id: 'evt_test_rzp_1',
      event: 'payment.failed',
      payload: {
        payment: {
          entity: {
            id: 'pay_rzp_webhook_1',
            amount: 849900,
            method: 'upi',
            error_code: 'insufficient_balance'
          }
        }
      }
    };

    const response = await request(app)
      .post('/api/v1/webhooks/razorpay')
      .send(webhookPayload);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.event_id).toEqual('evt_test_rzp_1');
  });
});
