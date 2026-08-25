const recoveryAgent = require('../src/agents/recoveryAgent');
const llmProvider = require('../src/agents/llmProvider');

describe('Phase 12: AI Recovery Recommendation Agent Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('analyzeAndRecommend uses valid LLM JSON output when available', async () => {
    const mockLlmResponse = {
      recommended_action: 'DELAYED_RETRY',
      reason: 'Temporary balance issue with high customer LTV',
      confidence: 0.91,
      requires_human_approval: false
    };

    jest.spyOn(llmProvider, 'generateCompletion').mockResolvedValue(mockLlmResponse);

    const txn = { payment_id: 'pay_agent_1', amount_inr: 8499, payment_method: 'upi', failure_reason: 'insufficient_balance', customer_ltv_inr: 42000, retry_count: 0 };
    const mlResult = { recovery_probability: 0.87, risk_band: 'HIGH' };

    const recommendation = await recoveryAgent.analyzeAndRecommend(txn, mlResult);

    expect(recommendation.recommended_action).toEqual('DELAYED_RETRY');
    expect(recommendation.source).toEqual('LLM_AGENT');
    expect(recommendation.confidence).toEqual(0.91);
  });

  test('analyzeAndRecommend falls back gracefully to deterministic rule when LLM returns unpermitted action', async () => {
    const invalidLlmResponse = {
      recommended_action: 'DIRECT_DEBIT_WITHOUT_OTP', // Invalid action
      confidence: 0.99
    };

    jest.spyOn(llmProvider, 'generateCompletion').mockResolvedValue(invalidLlmResponse);

    const txn = { payment_id: 'pay_agent_2', amount_inr: 8499, failure_reason: 'insufficient_balance', retry_count: 0 };
    const mlResult = { recovery_probability: 0.85, risk_band: 'HIGH' };

    const recommendation = await recoveryAgent.analyzeAndRecommend(txn, mlResult);

    expect(recommendation.source).toEqual('DETERMINISTIC_FALLBACK');
    expect(['DELAYED_RETRY', 'SMART_RETRY']).toContain(recommendation.recommended_action);
  });

  test('analyzeAndRecommend uses fallback when LLM API returns null or times out', async () => {
    jest.spyOn(llmProvider, 'generateCompletion').mockResolvedValue(null);

    const txn = { payment_id: 'pay_agent_3', amount_inr: 75000, retry_count: 0 };
    const mlResult = { recovery_probability: 0.9, risk_band: 'HIGH' };

    const recommendation = await recoveryAgent.analyzeAndRecommend(txn, mlResult);

    expect(recommendation.source).toEqual('DETERMINISTIC_FALLBACK');
    expect(recommendation.recommended_action).toEqual('HUMAN_ESCALATION');
  });
});
