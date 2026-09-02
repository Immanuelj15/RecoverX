const request = require('supertest');
const app = require('../src/app');
const TransactionRepository = require('../src/repositories/TransactionRepository');
const AnalyticsService = require('../src/services/analyticsService');
const PolicyRepository = require('../src/repositories/PolicyRepository');
const AuditLogRepository = require('../src/repositories/AuditLogRepository');
const recoveryWorkflow = require('../src/services/recoveryWorkflow');

describe('Phase 16: Backend REST API Router Test Suite', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(0, () => done());
  });

  afterAll((done) => {
    server.close(done);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('GET /api/v1/transactions returns paginated transactions list', async () => {
    const mockData = {
      transactions: [{ payment_id: 'pay_api_1', amount_inr: 1000, status: 'FAILED' }],
      total: 1,
      page: 1,
      totalPages: 1
    };
    jest.spyOn(TransactionRepository, 'findAll').mockResolvedValue(mockData);

    const response = await request(server).get('/api/v1/transactions?page=1&limit=10');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.length).toBe(1);
    expect(response.body.total).toBe(1);
  });

  test('GET /api/v1/transactions/:payment_id returns transaction details with audit timeline', async () => {
    const mockTxn = { payment_id: 'pay_api_2', amount_inr: 2500, status: 'FAILED' };
    const mockAudit = [{ event_type: 'DETECTED', created_at: new Date() }];

    jest.spyOn(TransactionRepository, 'findByPaymentId').mockResolvedValue(mockTxn);
    jest.spyOn(AuditLogRepository, 'findByPaymentId').mockResolvedValue(mockAudit);

    const response = await request(server).get('/api/v1/transactions/pay_api_2');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.payment_id).toBe('pay_api_2');
  });

  test('GET /api/v1/transactions/:payment_id returns 404 for non-existent payment ID', async () => {
    jest.spyOn(TransactionRepository, 'findByPaymentId').mockResolvedValue(null);

    const response = await request(server).get('/api/v1/transactions/pay_missing');
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test('POST /api/v1/transactions/:payment_id/trigger-recovery triggers workflow', async () => {
    const mockResult = {
      status: 'success',
      payment_id: 'pay_api_3',
      recommended_action: 'SMART_RETRY',
      policy_decision: { approved: true, action: 'SMART_RETRY' }
    };
    jest.spyOn(TransactionRepository, 'findByPaymentId').mockResolvedValue({ payment_id: 'pay_api_3', amount_inr: 5000 });
    jest.spyOn(recoveryWorkflow, 'runRecoveryWorkflow').mockResolvedValue(mockResult);

    const response = await request(server).post('/api/v1/transactions/pay_api_3/trigger-recovery');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.payment_id).toBe('pay_api_3');
  });

  test('GET /api/v1/analytics/summary returns dashboard summary metrics', async () => {
    const mockSummary = {
      total_transactions_analyzed: 1000,
      revenue_at_risk: 500000,
      revenue_recovered: 350000,
      recovery_rate: 70
    };
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
    jest.spyOn(AnalyticsService, 'getDailyRevenueTrend').mockResolvedValue([{ date: 'Mon', atRisk: 1000, recovered: 500 }]);

    const response = await request(server).get('/api/v1/analytics/charts');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.failure_reasons.length).toBe(1);
    expect(response.body.data.payment_methods.length).toBe(1);
    expect(response.body.data.daily_revenue_trend.length).toBe(1);
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
    const updatedPolicy = { max_retry_count: 5, high_value_threshold_inr: 100000, min_recovery_probability_threshold: 0.4 };
    jest.spyOn(PolicyRepository, 'updateGlobalPolicy').mockResolvedValue(updatedPolicy);

    const response = await request(server)
      .put('/api/v1/policies')
      .send(updatedPolicy);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.max_retry_count).toBe(5);
  });

  test('GET /api/v1/audit-logs returns paginated audit log records', async () => {
    const mockAudit = {
      logs: [{ event_type: 'ACTION_EXECUTED', payment_id: 'pay_api_4' }],
      total: 1,
      page: 1,
      totalPages: 1
    };
    jest.spyOn(AuditLogRepository, 'findAll').mockResolvedValue(mockAudit);

    const response = await request(server).get('/api/v1/audit-logs?page=1&limit=20');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.length).toBe(1);
  });
});
