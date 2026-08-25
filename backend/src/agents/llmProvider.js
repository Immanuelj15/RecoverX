const { env } = require('../config/env');
const logger = require('../utils/logger');

class LlmProvider {
  constructor() {
    this.provider = env.LLM_PROVIDER || 'openai';
    this.apiKey = env.OPENAI_API_KEY || '';
    this.model = env.OPENAI_MODEL || 'gpt-4o-mini';
    this.baseUrl = env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  }

  /**
   * Sends structured prompt to OpenAI-compatible LLM endpoint using native fetch
   */
  async generateCompletion(systemPrompt, userPrompt, timeoutMs = 8000) {
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      logger.warn('LLM API key is missing or set to placeholder. Returning null for fallback execution.');
      return null;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        logger.error(`LLM API returned status ${response.status}`);
        return null;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      return content ? JSON.parse(content) : null;
    } catch (error) {
      logger.error(`LLM Provider API call failed: ${error.message}`);
      return null; // Triggers safe deterministic fallback in recoveryAgent
    }
  }
}

module.exports = new LlmProvider();
