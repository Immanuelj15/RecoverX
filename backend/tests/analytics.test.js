const analyticsService = require('../src/services/analyticsService');
const { Transaction } = require('../src/models');

describe('Phase 9: Analytics Aggregation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getDashboardSummary aggregates business metrics correctly', async () => {
    const mockAggResult = [{
      total_transactions: 10,
      revenue_at_risk: 100000,
      revenue_recovered: 40000,
      successful_recoveries: 4,
      recovery_attempts: 6,
      human_escalations: 2,
      stopped_actions: 1,
      high_risk_amount: 50000,
      medium_risk_amount: 30000,
      low_risk_amount: 20000
    }];

    jest.spyOn(Transaction, 'aggregate').mockResolvedValue(mockAggResult);

    const summary = await analyticsService.getDashboardSummary();
    expect(summary.total_transactions_analyzed).toEqual(10);
    expect(summary.revenue_at_risk).toEqual(100000);
    expect(summary.revenue_recovered).toEqual(40000);
    expect(summary.recovery_rate).toEqual(40.0);
    expect(summary.average_recovery_amount).toEqual(10000.0);
    expect(summary.risk_band_amounts.high).toEqual(50000);
  });

  test('getDashboardSummary returns zero metrics when collection is empty', async () => {
    jest.spyOn(Transaction, 'aggregate').mockResolvedValue([]);

    const summary = await analyticsService.getDashboardSummary();
    expect(summary.total_transactions_analyzed).toEqual(0);
    expect(summary.revenue_at_risk).toEqual(0);
    expect(summary.recovery_rate).toEqual(0);
  });

  test('getRecoveryByFailureReason aggregates failure breakdowns', async () => {
    const mockFailureGroup = [
      { failure_reason: 'insufficient_balance', total_cases: 5, revenue_at_risk: 50000, revenue_recovered: 25000, recovery_rate: 50 }
    ];
    jest.spyOn(Transaction, 'aggregate').mockResolvedValue(mockFailureGroup);

    const res = await analyticsService.getRecoveryByFailureReason();
    expect(res).toHaveLength(1);
    expect(res[0].failure_reason).toEqual('insufficient_balance');
    expect(res[0].recovery_rate).toEqual(50);
  });
});
