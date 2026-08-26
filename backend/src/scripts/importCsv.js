const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const csv = require('csv-parser');
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const merchantRepository = require('../repositories/merchantRepository');
const { Customer, Payment, RecoveryCase, RecoveryOutcome } = require('../models');
const { inrToPaise } = require('../utils/money');
const logger = require('../utils/logger');

async function importCsvDataset(csvPath) {
  await connectDB();
  logger.info(`Starting 10K CSV Import from: ${csvPath}`);

  const merchant = await merchantRepository.getOrCreateDemoMerchant();

  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          logger.info(`Successfully parsed ${results.length} rows from CSV.`);

          const customerMap = new Map();
          const paymentBulk = [];
          const caseBulk = [];
          const outcomeBulk = [];

          for (let i = 0; i < results.length; i++) {
            const row = results[i];
            const custId = row.customer_id || `cust_${i + 1}`;
            const payId = row.payment_id || `pay_${i + 1}`;
            const amountInr = parseFloat(row.amount_inr || 0);
            const amountPaise = inrToPaise(amountInr);
            const ltvPaise = inrToPaise(parseFloat(row.customer_ltv_inr || 0));

            // Accumulate customer stats
            if (!customerMap.has(custId)) {
              customerMap.set(custId, {
                merchant_id: merchant._id,
                customer_id: custId,
                name: `Customer ${custId}`,
                customer_ltv_paise: ltvPaise,
                stats: { total_payments: 0, successful_payments: 0, failed_payments: 0, total_recovered_paise: 0 }
              });
            }

            // Payment bulk doc
            paymentBulk.push({
              updateOne: {
                filter: { merchant_id: merchant._id, payment_id: payId },
                update: {
                  $set: {
                    merchant_id: merchant._id,
                    payment_id: payId,
                    customer_id: custId,
                    amount: { value_paise: amountPaise, currency: 'INR' },
                    payment_method: (row.payment_method || 'upi').toLowerCase(),
                    status: 'failed',
                    failure: { reason: row.failure_reason || 'insufficient_balance' },
                    history: {
                      previous_successes: parseInt(row.previous_successes || 0, 10),
                      previous_failures: parseInt(row.previous_failures || 0, 10),
                      retry_count: parseInt(row.retry_count || 0, 10)
                    },
                    subscription: { status: row.subscription_status || 'none' },
                    metadata: { source: 'synthetic_dataset', dataset_version: '1.0.0' }
                  }
                },
                upsert: true
              }
            });

            // Recovery Case bulk doc
            const caseId = `case_${payId}`;
            const caseObjId = new mongoose.Types.ObjectId();
            const isRecovered = parseInt(row.recovered || 0, 10) === 1;

            caseBulk.push({
              updateOne: {
                filter: { merchant_id: merchant._id, case_id: caseId },
                update: {
                  $set: {
                    _id: caseObjId,
                    merchant_id: merchant._id,
                    payment_id: payId,
                    customer_id: custId,
                    case_id: caseId,
                    status: isRecovered ? 'RECOVERY_SUCCESS' : 'RECOVERY_FAILED',
                    priority: amountInr >= 50000 ? 'critical' : amountInr >= 10000 ? 'high' : 'medium',
                    revenue_at_risk_paise: amountPaise,
                    current_recovery_probability: isRecovered ? 0.85 : 0.25,
                    current_action: isRecovered ? 'SMART_RETRY' : 'STOP',
                    attempt_count: parseInt(row.retry_count || 1, 10)
                  }
                },
                upsert: true
              }
            });

            // Outcome bulk doc (Source of truth for money recovered)
            outcomeBulk.push({
              updateOne: {
                filter: { merchant_id: merchant._id, payment_id: payId },
                update: {
                  $set: {
                    merchant_id: merchant._id,
                    recovery_case_id: caseObjId,
                    payment_id: payId,
                    result: isRecovered ? 'RECOVERED' : 'FAILED',
                    amount_at_risk_paise: amountPaise,
                    amount_recovered_paise: isRecovered ? amountPaise : 0,
                    recovery_method: isRecovered ? 'SMART_RETRY' : 'STOP',
                    verification: { verified: true, source: 'simulation' }
                  }
                },
                upsert: true
              }
            });
          }

          // Execute bulkWrite in batches of 1000
          logger.info(`Bulk writing Customers (${customerMap.size})...`);
          const customerBulk = Array.from(customerMap.values()).map((cust) => ({
            updateOne: {
              filter: { merchant_id: merchant._id, customer_id: cust.customer_id },
              update: { $set: cust },
              upsert: true
            }
          }));

          const batchSize = 1000;
          for (let i = 0; i < customerBulk.length; i += batchSize) {
            await Customer.bulkWrite(customerBulk.slice(i, i + batchSize));
          }

          logger.info(`Bulk writing Payments (${paymentBulk.length})...`);
          for (let i = 0; i < paymentBulk.length; i += batchSize) {
            await Payment.bulkWrite(paymentBulk.slice(i, i + batchSize));
          }

          logger.info(`Bulk writing Recovery Cases (${caseBulk.length})...`);
          for (let i = 0; i < caseBulk.length; i += batchSize) {
            await RecoveryCase.bulkWrite(caseBulk.slice(i, i + batchSize));
          }

          logger.info(`Bulk writing Outcomes (${outcomeBulk.length})...`);
          for (let i = 0; i < outcomeBulk.length; i += batchSize) {
            await RecoveryOutcome.bulkWrite(outcomeBulk.slice(i, i + batchSize));
          }

          logger.info(`10K CSV Import Completed Successfully! Inserted/Upserted 10,000 transactions.`);
          resolve({ success: true, count: results.length });
        } catch (err) {
          logger.error(`CSV Import Error: ${err.message}`, err);
          reject(err);
        }
      })
      .on('error', (error) => reject(error));
  });
}

if (require.main === module) {
  const defaultPath = path.resolve(__dirname, '../../../data/raw/recoverx_revenue_recovery_dataset_10000.csv');
  importCsvDataset(defaultPath)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { importCsvDataset };
