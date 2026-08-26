const llmProvider = require('./llmProvider');
const { RECOVERY_AGENT_PROMPT_V1, validateLLMOutput } = require('./prompts');
const { validateAiRecommendation } = require('../utils/validators');
const RecoveryWorkflowService = require('../services/recoveryWorkflow');
const logger = require('../utils/logger');

class RecoveryAgent {
  constructor() {
    this.agentVersion = 'v1.0.0';
    this.promptVersion = 'recovery-agent-v1';
  }

  /**
   * Generates a system prompt constraining LLM reasoning to strict JSON schema
   */
  getSystemPrompt() {
    return RECOVERY_AGENT_PROMPT_V1;
  }

  /**
   * Formats transaction and ML risk context into prompt for LLM
   */
  getUserPrompt(txn, mlResult) {
    const amountInr = txn.amount_paise ? (txn.amount_paise / 100).toFixed(2) : (txn.amount_inr || 0);
    const ltvInr = txn.customer_ltv_paise ? (txn.customer_ltv_paise / 100).toFixed(2) : (txn.customer_ltv_inr || 0);

    return `TRANSACTION CONTEXT:
- Payment ID: ${txn.payment_id || txn._id}
- Customer ID: ${txn.customer_id}
- Amount: ₹${amountInr} (${txn.amount_paise || Math.round((txn.amount_inr || 0) * 100)} paise)
- Payment Method: ${txn.payment_method}
- Failure Reason: ${txn.failure_reason}
- Previous Successes: ${txn.previous_successes || 0}
- Previous Failures: ${txn.previous_failures || 0}
- Retry Count: ${txn.retry_count || 0}
- Customer LTV: ₹${ltvInr}
- Subscription Status: ${txn.subscription_status || 'none'}

ML MODEL SCORE:
- Recovery Probability: ${mlResult.recovery_probability}
- Risk Band: ${mlResult.risk_band}
- Top Factors: ${JSON.stringify(mlResult.top_factors || [])}

Provide your structured recovery recommendation JSON object.`;
  }

  /**
   * Analyzes payment context and returns validated recovery recommendation
   */
  async analyzeAndRecommend(txn, mlResult) {
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.getUserPrompt(txn, mlResult);

    // 1. Attempt LLM reasoning
    const llmResult = await llmProvider.generateCompletion(systemPrompt, userPrompt);

    if (llmResult) {
      const promptValidation = validateLLMOutput(llmResult);
      const validatorValidation = validateAiRecommendation(llmResult);

      if (promptValidation.isValid && validatorValidation.isValid) {
        const action = llmResult.recommended_action || llmResult.action;
        logger.info(`AI Agent generated recommendation for ${txn.payment_id}: ${action}`);
        return {
          recommended_action: action,
          reason: llmResult.reason || 'AI generated recovery recommendation',
          confidence: parseFloat(llmResult.confidence) || mlResult.recovery_probability,
          requires_human_approval: Boolean(llmResult.requires_human_approval),
          prompt_version: this.promptVersion,
          source: 'LLM_AGENT',
          agent_version: this.agentVersion
        };
      } else {
        const reason = promptValidation.reason || validatorValidation.reason;
        logger.warn(`AI Agent output failed validation (${reason}). Falling back to deterministic rules.`);
      }
    } else {
      logger.info(`LLM Provider offline or unconfigured for ${txn.payment_id}. Using deterministic heuristic fallback.`);
    }

    // 2. Deterministic Fallback if LLM unavailable or invalid
    const fallback = RecoveryWorkflowService.generateFallbackRecommendation(txn, mlResult.recovery_probability);
    return {
      ...fallback,
      prompt_version: this.promptVersion,
      source: 'DETERMINISTIC_FALLBACK',
      agent_version: this.agentVersion
    };
  }
}

module.exports = new RecoveryAgent();
