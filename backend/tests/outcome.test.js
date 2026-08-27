const recoveryOutcomeService = require('../src/services/recoveryOutcomeService');
const recoveryOutcomeRepository = require('../src/repositories/recoveryOutcomeRepository');
const recoveryCaseRepository = require('../src/repositories/recoveryCaseRepository');
const AuditLogRepository = require('../src/repositories/AuditLogRepository');

describe('Phase 13: Recovery Outcome Verification & Money Tracking Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('recordVerifiedOutcome correctly computes integer paise net recovery and formats INR', async () => {
    jest.spyOn(recoveryOutcomeRepository, 'recordOutcome').mockImplementation(async (data) => data);
    jest.spyOn(recoveryCaseRepository, 'updateStatus').mockResolvedValue({});
    jest.spyOn(AuditLogRepository, 'createLog').mockResolvedValue({});

    const outcome = await recoveryOutcomeService.recordVerifiedOutcome({
      merchant_id: '507f1f77bcf86cd799439011',
      recovery_case_id: '507f1f77bcf86cd799439022',
      payment_id: 'pay_outcome_1',
      status: 'RECOVERED',
      amount_recovered_paise: 849900, // ₹8,499.00
      fee_paise: 16998 // ₹169.98 fee
    });

    expect(outcome.amount_recovered_paise).toEqual(849900);
    expect(outcome.net_recovered_paise).toEqual(832902);
    expect(outcome.status).toEqual('RECOVERED');
  });

  test('computeMerchantMoneyMetrics accurately calculates recovery rate and paise metrics', async () => {
    jest.spyOn(recoveryCaseRepository, 'getRecoveryStats').mockResolvedValue({
      total_recovered_paise: 5000000, // ₹50,000
      total_lost_paise: 2500000 // ₹25,000
    });

    const metrics = await recoveryOutcomeService.computeMerchantMoneyMetrics('507f1f77bcf86cd799439011');

    expect(metrics.total_recovered_paise).toEqual(5000000);
    expect(metrics.total_recovered_inr).toEqual('50000.00');
    expect(metrics.recovery_rate).toEqual(0.6667);
    expect(metrics.recovery_rate_percentage).toEqual('66.67%');
  });
});
