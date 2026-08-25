const ALLOWED_PAYMENT_METHODS = ['upi', 'card', 'netbanking', 'wallet'];
const ALLOWED_FAILURE_REASONS = [
  'insufficient_balance',
  'bank_declined',
  'card_expired',
  'network_timeout',
  'authentication_failure',
  'unknown'
];
const ALLOWED_SUBSCRIPTION_STATUSES = ['active', 'pending', 'none', 'halted'];
const ALLOWED_ACTIONS = ['SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP'];

/**
 * Validates payload structure for payment recovery analysis request
 */
function validatePaymentPayload(data) {
  const errors = [];

  if (!data.payment_id || typeof data.payment_id !== 'string') {
    errors.push('payment_id is required and must be a string');
  }

  if (!data.customer_id || typeof data.customer_id !== 'string') {
    errors.push('customer_id is required and must be a string');
  }

  if (typeof data.amount_inr !== 'number' || data.amount_inr <= 0) {
    errors.push('amount_inr must be a positive number');
  }

  if (!data.payment_method || !ALLOWED_PAYMENT_METHODS.includes(data.payment_method)) {
    errors.push(`payment_method must be one of: ${ALLOWED_PAYMENT_METHODS.join(', ')}`);
  }

  if (!data.failure_reason || !ALLOWED_FAILURE_REASONS.includes(data.failure_reason)) {
    errors.push(`failure_reason must be one of: ${ALLOWED_FAILURE_REASONS.join(', ')}`);
  }

  if (data.subscription_status && !ALLOWED_SUBSCRIPTION_STATUSES.includes(data.subscription_status)) {
    errors.push(`subscription_status must be one of: ${ALLOWED_SUBSCRIPTION_STATUSES.join(', ')}`);
  }

  if (data.retry_count !== undefined && (typeof data.retry_count !== 'number' || data.retry_count < 0)) {
    errors.push('retry_count must be a non-negative integer');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates AI Recommendation response object
 */
function validateAiRecommendation(recommendation) {
  if (!recommendation || typeof recommendation !== 'object') {
    return { isValid: false, reason: 'Recommendation must be an object' };
  }

  const { recommended_action, confidence } = recommendation;

  if (!ALLOWED_ACTIONS.includes(recommended_action)) {
    return {
      isValid: false,
      reason: `recommended_action '${recommended_action}' is not in permitted action set: ${ALLOWED_ACTIONS.join(', ')}`
    };
  }

  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
    return { isValid: false, reason: 'confidence score must be a number between 0 and 1' };
  }

  return { isValid: true };
}

module.exports = {
  ALLOWED_PAYMENT_METHODS,
  ALLOWED_FAILURE_REASONS,
  ALLOWED_SUBSCRIPTION_STATUSES,
  ALLOWED_ACTIONS,
  validatePaymentPayload,
  validateAiRecommendation
};
