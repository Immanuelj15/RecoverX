const request = require('supertest');
const app = require('../src/app');
const razorpayService = require('../src/services/razorpayService');
const idempotencyService = require('../src/services/idempotencyService');
const TransactionRepository = require('../src/repositories/TransactionRepository');
const AuditLogRepository = require('../src/repositories/AuditLogRepository');
const RecoveryWorkflowService = require('../src/services/recoveryWorkflow');
const AnalyticsService = require('../src/services/analyticsService');

describe('Phase 19: End-to-End Integration & System Validation Suite', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(0, () => done());
  });

  afterAll((done) => {
    if (server) {
      if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
      }
      server.close(done);
    } else {
      done();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('E2E Lifecycle: Razorpay webhook -> State Machine -> ML -> AI Agent -> Policy -> Execution -> Audit Log -> Analytics', async () => {
    const paymentId = 'pay_e2e_live_001';
    const eventId = 'evt_e2e_live_001';

    let storedTxn = {
      payment_id: paymentId,
      customer_id: 'cust_e2e_99',
      amount_inr: 14999,
      payment_method: 'upi',
      failure_reason: 'insufficient_balance',
      customer_ltv_inr: 35000,
      previous_successes: 5,
      previous_failures: 1,
      retry_count: 0,
      recovery_state: 'DETECTED'
    };

    const mockAuditLogs = [];

    // Mock Idempotency service to prevent MongoDB buffering timeout
    jest.spyOn(idempotencyService, 'registerWebhookEvent').mockResolvedValue({ isDuplicate: false });
    jest.spyOn(idempotencyService, 'markEventProcessed').mockResolvedValue({});

    // Mock DB layer for controlled end-to-end verification
    jest.spyOn(TransactionRepository, 'findByPaymentId').mockImplementation(async (id) => (id === paymentId ? storedTxn : null));
    jest.spyOn(TransactionRepository, 'create').mockImplementation(async (data) => {
      storedTxn = { ...storedTxn, ...data };
      return storedTxn;
    });
    jest.spyOn(TransactionRepository, 'updateState').mockImplementation(async (id, state, extra) => {
      storedTxn = { ...storedTxn, recovery_state: state, ...extra };
      return storedTxn;
    });

    jest.spyOn(AuditLogRepository, 'createLog').mockImplementation(async (logData) => {
      mockAuditLogs.push({ ...logData, timestamp: new Date() });
      return logData;
    });

    // 1. Simulate incoming Razorpay payment.failed Webhook
    const webhookPayload = {
      event_id: eventId,
      event: 'payment.failed',
      payload: {
        payment: {
          entity: {
            id: paymentId,
            customer_id: 'cust_e2e_99',
            amount: 1499900,
            method: 'upi',
            error_code: 'insufficient_balance'
          }
        }
      }
    };

    const webhookResponse = await request(server)
      .post('/api/v1/webhooks/razorpay')
      .send(webhookPayload);

    expect(webhookResponse.status).toBe(200);
    expect(webhookResponse.body.status).toEqual('success');
    expect(webhookResponse.body.payment_id).toEqual(paymentId);

    // 2. Verify End-to-End State Machine Execution
    expect(storedTxn.recovery_state).toBeDefined();
    expect(['RECOVERY_SUCCESS', 'RECOVERY_FAILED', 'ACTION_APPROVED', 'STOPPED', 'ESCALATED']).toContain(storedTxn.recovery_state);

    // 3. Verify Idempotency Enforcement (Duplicate webhook event returns 200 with ignored status)
    jest.spyOn(idempotencyService, 'registerWebhookEvent').mockResolvedValueOnce({ isDuplicate: true });

    const duplicateResponse = await request(server)
      .post('/api/v1/webhooks/razorpay')
      .send(webhookPayload);

    expect(duplicateResponse.status).toBe(200);
    expect(duplicateResponse.body.status).toEqual('ignored');

    // 4. Verify REST API Fetching for Transaction Details + Audit Timeline
    jest.spyOn(AuditLogRepository, 'findByPaymentId').mockResolvedValue(mockAuditLogs);

    const detailResponse = await request(server).get(`/api/v1/transactions/${paymentId}`);
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.status).toEqual('success');
    expect(detailResponse.body.data.payment_id).toEqual(paymentId);

    // 5. Verify Analytics Summary Endpoint
    jest.spyOn(AnalyticsService, 'getDashboardSummary').mockResolvedValue({
      total_transactions_analyzed: 1,
      revenue_at_risk: 14999,
      revenue_recovered: 14999,
      recovery_rate: 100
    });

    const analyticsResponse = await request(server).get('/api/v1/analytics/summary');
    expect(analyticsResponse.status).toBe(200);
    expect(analyticsResponse.body.data.revenue_at_risk).toBe(14999);
  });
});
