/**
 * RecoverX Idempotency Utility
 * Generates deterministic idempotency keys for recovery actions and webhooks.
 */

function generateIdempotencyKey(merchantCode, paymentId, actionType, attemptNumber) {
  return `recoverx:${merchantCode}:${paymentId}:${actionType.toLowerCase()}:${attemptNumber}`;
}

module.exports = {
  generateIdempotencyKey
};
