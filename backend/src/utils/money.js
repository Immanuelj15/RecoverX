/**
 * RecoverX Fintech Money Helper Utility
 * Enforces integer paise storage for financial accuracy (1 INR = 100 Paise).
 */

/**
 * Converts INR (rupees) to integer paise.
 * @param {number|string} amountInr - Amount in INR (e.g. 8499.50 or "8499.50")
 * @returns {number} Amount in integer paise (e.g. 849950)
 */
function inrToPaise(amountInr) {
  if (amountInr === null || amountInr === undefined) return 0;
  const num = typeof amountInr === 'string' ? parseFloat(amountInr) : amountInr;
  if (isNaN(num) || num < 0) return 0;
  return Math.round(num * 100);
}

/**
 * Converts integer paise to INR (rupees).
 * @param {number} amountPaise - Amount in integer paise (e.g. 849950)
 * @returns {number} Amount in INR (e.g. 8499.5)
 */
function paiseToInr(amountPaise) {
  if (!amountPaise || isNaN(amountPaise)) return 0;
  return Math.round(amountPaise) / 100;
}

/**
 * Formats integer paise into a clean INR display string (e.g. "₹8,499.50").
 * @param {number} amountPaise 
 * @returns {string}
 */
function formatInrDisplay(amountPaise) {
  const inr = paiseToInr(amountPaise);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(inr);
}

module.exports = {
  inrToPaise,
  paiseToInr,
  formatInrDisplay
};
