/**
 * RecoverX Correlation ID Utility
 * Generates unique correlation IDs for end-to-end tracing across workflow steps.
 */

function generateCorrelationId(prefix = 'corr') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}_${timestamp}_${random}`;
}

module.exports = {
  generateCorrelationId
};
