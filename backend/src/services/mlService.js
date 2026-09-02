const env = require('../config/env');
const logger = require('../utils/logger');

class MLService {
  constructor() {
    this.baseUrl = env.ML_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Calls Python FastAPI ML prediction endpoint to get XGBoost recovery probability & SHAP top factors.
   * Fallback gracefully if ML service is unreachable.
   */
  async predictRecoveryProbability(transactionData) {
    try {
      const payload = {
        amount_inr: transactionData.amount_inr || (transactionData.amount_paise ? transactionData.amount_paise / 100 : 0),
        amount_paise: transactionData.amount_paise || Math.round((transactionData.amount_inr || 0) * 100),
        payment_method: transactionData.payment_method || 'upi',
        failure_reason: transactionData.failure_reason || 'unknown',
        previous_successes: transactionData.previous_successes || 0,
        previous_failures: transactionData.previous_failures || 0,
        retry_count: transactionData.retry_count || 0,
        customer_ltv_inr: transactionData.customer_ltv_inr || (transactionData.customer_ltv_paise ? transactionData.customer_ltv_paise / 100 : 0),
        customer_ltv_paise: transactionData.customer_ltv_paise || Math.round((transactionData.customer_ltv_inr || 0) * 100),
        subscription_status: transactionData.subscription_status || 'none'
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        logger.info(`[ML Service] Prediction received for ${transactionData.payment_id || 'payload'}: Prob=${data.recovery_probability}, Risk=${data.risk_band}`);
        return {
          recovery_probability: data.recovery_probability,
          risk_band: data.risk_band,
          top_factors: data.top_factors || [],
          model_name: data.model_name || 'RecoverX XGBoost',
          model_version: data.model_version || 'v1.0.0',
          source: 'PYTHON_ML_SERVICE'
        };
      }
    } catch (error) {
      logger.warn(`[ML Service] Python ML prediction service unreachable at ${this.baseUrl}: ${error.message}. Using deterministic fallback.`);
    }

    return null; // Return null so caller falls back to deterministic heuristic model
  }
}

module.exports = new MLService();
