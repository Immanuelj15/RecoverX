const { env } = require('../config/env');
const logger = require('../utils/logger');

/**
 * Base LLMProvider Interface
 */
class LLMProvider {
  async generateCompletion(systemPrompt, userPrompt, timeoutMs) {
    throw new Error('LLMProvider.generateCompletion must be implemented by subclasses');
  }
}

/**
 * Concrete GroqProvider implementation calling official Groq API
 */
class GroqProvider extends LLMProvider {
  constructor() {
    super();
    this.provider = 'groq';
    this.apiKey = env.GROQ_API_KEY || '';
    this.model = env.GROQ_MODEL || 'openai/gpt-oss-20b';
    this.baseUrl = 'https://api.groq.com/openai/v1';
    this.timeoutMs = env.GROQ_TIMEOUT_MS || 10000;
  }

  /**
   * Sends structured prompt to Groq API endpoint using native fetch with timeout & fallback
   */
  async generateCompletion(systemPrompt, userPrompt, timeoutMs = null) {
    const effectiveTimeout = timeoutMs || this.timeoutMs;
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      logger.warn('Groq API key is missing or set to placeholder. Returning null for fallback execution.');
      return null;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);

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
        logger.error(`Groq API returned status ${response.status}`);
        return null;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      return content ? JSON.parse(content) : null;
    } catch (error) {
      logger.error(`Groq Provider API call failed: ${error.message}`);
      return null; // Triggers safe deterministic fallback in recoveryAgent
    }
  }
}

const groqInstance = new GroqProvider();
groqInstance.LLMProvider = LLMProvider;
groqInstance.GroqProvider = GroqProvider;
groqInstance.llmProvider = groqInstance;

module.exports = groqInstance;
