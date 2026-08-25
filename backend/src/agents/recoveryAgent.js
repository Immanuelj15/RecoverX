const llmProvider = require('./llmProvider');
const { validateAiRecommendation, ALLOWED_ACTIONS } = require('../utils/validators');
const RecoveryWorkflowService = require('../services/recoveryWorkflow');
const logger = require('../utils/logger');

class RecoveryAgent {
  constructor() {
    this.agentVersion = 'v1.0.0';
  }

  /**
   * Generates a system prompt constraining LLM reasoning to strict JSON schema
   */
  getSystemPrompt() {
    return `You are RecoverX AI, a senior fintech revenue recovery agent.
Your task is to analyze a failed payment context and output a JSON recommendation for recovery intervention.

CRITICAL CONSTRAINTS:
1. You MUST return ONLY a valid JSON object.
2. The "recommended_action" MUST be EXACTLY one of:
   - "SMART_RETRY" (Immediate retry for transient errors)
   - "DELAYED_RETRY" (Wait and retry for temporary insufficient balance)
   - "PAYMENT_RECOVERY_NUDGE" (Send SMS/WhatsApp/email notification to customer)
   - "HUMAN_ESCALATION" (High-value or complex failure requiring human review)
   - "STOP" (Max retries reached or unrecoverable situation)
3. Do NOT execute financial transactions directly. Output a recommendation object only.

REQUIRED JSON FORMAT:
{
  "recommended_action": "DELAYED_RETRY",
  "reason": "Detailed explanation of root cause and intervention choice",
  "confidence": 0.88,
  "requires_human_approval": false
}`;
  }

  /**
   * Formats transaction and ML risk context into prompt for LLM
   */
  getUserPrompt(txn, mlResult) {
    return `TRANSACTION CONTEXT:
- Payment ID: ${txn.payment_id}
- Customer ID: ${txn.customer_id}
- Amount: ₹${txn.amount_inr}
- Payment Method: ${txn.payment_method}
- Failure Reason: ${txn.failure_reason}
- Previous Successes: ${txn.previous_successes}
- Previous Failures: ${txn.previous_failures}
- Retry Count: ${txn.retry_count}
- Customer LTV: ₹${txn.customer_ltv_inr}
- Subscription Status: ${txn.subscription_status}

ML MODEL SCORE:
- Recovery Probability: ${mlResult.recovery_probability}
- Risk Band: ${mlResult.risk_band}

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
      const validation = validateAiRecommendation(llmResult);
      if (validation.isValid) {
        logger.info(`AI Agent generated recommendation for ${txn.payment_id}: ${llmResult.recommended_action}`);
        return {
          recommended_action: llmResult.recommended_action,
          reason: llmResult.reason || 'AI generated recovery recommendation',
          confidence: parseFloat(llmResult.confidence) || mlResult.recovery_probability,
          requires_human_approval: Boolean(llmResult.requires_human_approval),
          source: 'LLM_AGENT',
          agent_version: this.agentVersion
        };
      } else {
        logger.warn(`AI Agent output failed validation (${validation.reason}). Falling back to deterministic rules.`);
      }
    } else {
      logger.info(`LLM Provider offline or unconfigured for ${txn.payment_id}. Using deterministic heuristic fallback.`);
    }

    // 2. Deterministic Fallback if LLM unavailable or invalid
    const fallback = RecoveryWorkflowService.generateFallbackRecommendation(txn, mlResult.recovery_probability);
    return {
      ...fallback,
      source: 'DETERMINISTIC_FALLBACK',
      agent_version: this.agentVersion
    };
  }
}

module.exports = new RecoveryAgent();
