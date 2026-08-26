const { llmProvider } = require('../agents/llmProvider');
const logger = require('../utils/logger');

class LLMService {
  constructor(provider = llmProvider) {
    this.provider = provider;
  }

  /**
   * Generates AI recovery recommendation for a failed payment context
   */
  async generateRecoveryRecommendation(context) {
    const systemPrompt = `You are RecoverX, a financial revenue recovery reasoning agent.
Your job is to analyze a failed payment and recommend one safe recovery intervention.
You do not authorize financial transactions.
You do not invent financial information.
You must use only the provided payment context.
You must follow the allowed actions: SMART_RETRY, DELAYED_RETRY, PAYMENT_RECOVERY_NUDGE, HUMAN_ESCALATION, STOP.
If the payment is not safely recoverable, recommend STOP or HUMAN_ESCALATION.
Never exceed retry limits.
Return structured JSON only:
{
  "action": "SMART_RETRY",
  "confidence": 0.91,
  "reason": "Clear explanation of choice",
  "failure_category": "TEMPORARY_GATEWAY_FAILURE",
  "recommended_delay_seconds": 90,
  "customer_message": "Communication text for customer",
  "requires_human_approval": false
}`;

    const userPrompt = JSON.stringify(context);
    try {
      const result = await this.provider.generateCompletion(systemPrompt, userPrompt);
      if (result) {
        // Map recommendation action format
        result.recommended_action = result.recommended_action || result.action;
      }
      return result;
    } catch (error) {
      logger.error(`LLMService generateRecoveryRecommendation error: ${error.message}`);
      return null;
    }
  }

  /**
   * Generates customer-facing recovery communication for an approved action
   */
  async generateCustomerMessage(context) {
    const systemPrompt = `You are RecoverX AI Assistant. Generate a polite, clear customer recovery message in JSON:
{
  "english": "Your payment could not be completed. Please try again using the secure link below.",
  "hinglish": "Payment complete nahi ho paya. Aap secure payment link se dobara try kar sakte hain."
}`;
    const userPrompt = JSON.stringify(context);
    try {
      return await this.provider.generateCompletion(systemPrompt, userPrompt);
    } catch (error) {
      logger.error(`LLMService generateCustomerMessage error: ${error.message}`);
      return {
        english: "Your payment could not be completed. Please try again using your payment link.",
        hinglish: "Payment update ke liye link par click karein."
      };
    }
  }

  /**
   * Generates merchant-facing explanation for dashboard
   */
  async explainDecision(context) {
    const systemPrompt = `You are RecoverX AI Reasoner. Generate a 2-sentence merchant explanation for why an action was chosen in JSON:
{
  "explanation": "Recovery was recommended because the failure appears temporary and customer has strong payment history."
}`;
    const userPrompt = JSON.stringify(context);
    try {
      const res = await this.provider.generateCompletion(systemPrompt, userPrompt);
      return res?.explanation || "Recovery recommended based on failure analysis and customer history.";
    } catch (error) {
      logger.error(`LLMService explainDecision error: ${error.message}`);
      return "Recovery recommended based on failure analysis and customer history.";
    }
  }
}

module.exports = new LLMService();
