const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const logger = require('./logger');

/**
 * Parses and transforms raw CSV row into normalized Transaction document structure
 */
function transformCsvRowToTransaction(row) {
  return {
    payment_id: row.payment_id ? row.payment_id.trim() : `pay_sim_${Math.random().toString(36).substr(2, 9)}`,
    customer_id: row.customer_id ? row.customer_id.trim() : `cust_sim_${Math.random().toString(36).substr(2, 9)}`,
    amount_inr: parseFloat(row.amount_inr) || 0,
    currency: row.currency ? row.currency.trim().toUpperCase() : 'INR',
    payment_method: (row.payment_method || 'upi').toLowerCase().trim(),
    payment_status: (row.payment_status || 'failed').toLowerCase().trim(),
    failure_reason: (row.failure_reason || 'unknown').toLowerCase().trim(),
    previous_successes: parseInt(row.previous_successes, 10) || 0,
    previous_failures: parseInt(row.previous_failures, 10) || 0,
    retry_count: parseInt(row.retry_count, 10) || 0,
    customer_ltv_inr: parseFloat(row.customer_ltv_inr) || 0,
    subscription_status: (row.subscription_status || 'none').toLowerCase().trim(),
    recovered: parseInt(row.recovered, 10) === 1 ? 1 : 0,
    outcome: row.outcome ? row.outcome.trim() : (parseInt(row.recovered, 10) === 1 ? 'failed_recovered' : 'failed_unrecovered'),
    recovery_state: 'DETECTED',
    recovery_probability: null,
    risk_band: null,
    amount_recovered: parseInt(row.recovered, 10) === 1 ? (parseFloat(row.amount_inr) || 0) : 0
  };
}

/**
 * Stream-reads CSV file and returns array of transformed Transaction document objects
 */
function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, '../../../', filePath);

    if (!fs.existsSync(absolutePath)) {
      return reject(new Error(`CSV File not found at path: ${absolutePath}`));
    }

    fs.createReadStream(absolutePath)
      .pipe(csv())
      .on('data', (data) => {
        try {
          const transformed = transformCsvRowToTransaction(data);
          results.push(transformed);
        } catch (err) {
          logger.warn(`Skipping invalid CSV row: ${err.message}`);
        }
      })
      .on('end', () => {
        logger.info(`Successfully parsed ${results.length} rows from ${path.basename(absolutePath)}`);
        resolve(results);
      })
      .on('error', (error) => {
        logger.error(`Error reading CSV file ${absolutePath}: ${error.message}`);
        reject(error);
      });
  });
}

module.exports = {
  transformCsvRowToTransaction,
  parseCsvFile
};
