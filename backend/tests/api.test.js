const request = require('supertest');
const app = require('../src/app');
const TransactionRepository = require('../src/repositories/TransactionRepository');
const AuditLogRepository = require('../src/repositories/AuditLogRepository');
const PolicyRepository = require('../src/repositories/PolicyRepository');
const AnalyticsService = require('../src/services/analyticsService');
const RecoveryWorkflowService = require('../src/services/recoveryWorkflow');

describe('Phase 16: Backend REST API Router Test Suite', () => {
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

  test('GET /api/v1/transactions returns paginated transactions list', async () => {
    const mockData = { data: [{ payment_id: 'pay_api_1', amount_inr: 5000 }], total: 1, page: 1, totalPages: 1 };
    jest.spyOn(TransactionRepository, 'findAll').mockResolvedValue(mockData);

    const response = await request(server).get('/api/v1/transactions?page=1&limit=10');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].payment_id).toEqual('pay_api_1');
  });

  test('GET /api/v1/transactions/:payment_id returns transaction details with audit timeline', async () => {
    const mockTxn = { payment_id: 'pay_api_2', amount_inr: 7500, recovery_state: 'DETECTED' };
    const mockTimeline = [{ event_type: 'DETECTED', timestamp: new Date() }];

    jest.spyOn(TransactionRepository, 'findByPaymentId').mockResolvedValue(mockTxn);
    jest.spyOn(AuditLogRepository, 'findByPaymentId').mockResolvedValue(mockTimeline);

    const response = await request(server).get('/api/v1/transactions/pay_api_2');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.payment_id).toEqual('pay_api_2');
    expect(response.body.timeline.length).toBe(1);
  });

  test('GET /api/v1/transactions/:payment_id returns 404 for non-existent payment ID', async () => {
    jest.spyOn(TransactionRepository, 'findByPaymentId').mockResolvedValue(null);

    const response = await request(server).get('/api/v1/transactions/pay_missing');
    expect(response.status).toBe(404);
    expect(response.body.error).toContain("pay_missing");
  });

  test('POST /api/v1/transactions/:payment_id/trigger-recovery triggers workflow', async () => {
    const mockTxn = { payment_id: 'pay_api_3', amount_inr: 3499 };
    jest.spyOn(TransactionRepository, 'findByPaymentId').mockResolvedValue(mockTxn);
    jest.spyOn(RecoveryWorkflowService, 'processRecoveryWorkflow').mockResolvedValue({ status: 'RECOVERY_SUCCESS' });

    const response = await request(server).post('/api/v1/transactions/pay_api_3/trigger-recovery');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.outcome.status).toEqual('RECOVERY_SUCCESS');
  });

  test('GET /api/v1/analytics/summary returns dashboard summary metrics', async () => {
    const mockSummary = { total_transactions_analyzed: 10000, revenue_at_risk: 50000000, revenue_recovered: 35000000, recovery_rate: 70 };
    jest.spyOn(AnalyticsService, 'getDashboardSummary').mockResolvedValue(mockSummary);

    const response = await request(server).get('/api/v1/analytics/summary');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.recovery_rate).toBe(70);
  });

  test('GET /api/v1/analytics/charts returns breakdown metrics for failure reasons and payment methods', async () => {
    jest.spyOn(AnalyticsService, 'getRecoveryByFailureReason').mockResolvedValue([{ failure_reason: 'insufficient_balance', total_cases: 400 }]);
    jest.spyOn(AnalyticsService, 'getRecoveryByPaymentMethod').mockResolvedValue([{ payment_method: 'upi', total_cases: 600 }]);
    jest.spyOn(AnalyticsService, 'getRecoveryByInterventionType').mockResolvedValue([{ intervention_type: 'SMART_RETRY', total_interventions: 200 }]);

    const response = await request(server).get('/api/v1/analytics/charts');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.failure_reasons.length).toBe(1);
    expect(response.body.data.payment_methods.length).toBe(1);
  });

  test('GET /api/v1/policies returns global policy config', async () => {
    const mockPolicy = { max_retry_count: 3, high_value_threshold_inr: 50000, min_recovery_probability_threshold: 0.3 };
    jest.spyOn(PolicyRepository, 'getGlobalPolicy').mockResolvedValue(mockPolicy);

    const response = await request(server).get('/api/v1/policies');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.max_retry_count).toBe(3);
  });

  test('PUT /api/v1/policies updates global policy config', async () => {
    const updatedPolicy = { max_retry_count: 4, high_value_threshold_inr: 60000 };
    jest.spyOn(PolicyRepository, 'updateGlobalPolicy').mockResolvedValue(updatedPolicy);

    const response = await request(server).put('/api/v1/policies').send({ max_retry_count: 4 });
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.max_retry_count).toBe(4);
  });

  test('GET /api/v1/audit-logs returns paginated audit log records', async () => {
    const mockLogs = { data: [{ payment_id: 'pay_audit_1', event_type: 'DETECTED' }], total: 1, page: 1, totalPages: 1 };
    jest.spyOn(AuditLogRepository, 'findAll').mockResolvedValue(mockLogs);

    const response = await request(server).get('/api/v1/audit-logs?page=1&limit=20');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.length).toBe(1);
  });
});
