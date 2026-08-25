const path = require('path');
const { connectDB, disconnectDB } = require('../config/db');
const { Transaction, PolicyConfig } = require('../models');
const { parseCsvFile } = require('../utils/csvImporter');
const logger = require('../utils/logger');

async function seedDatabase(customCsvPath) {
  try {
    await connectDB();
    logger.info('Starting database seeding process...');

    // 1. Initialize default PolicyConfig guardrail settings if not present
    let policy = await PolicyConfig.findOne({ key: 'global_policy' });
    if (!policy) {
      policy = await PolicyConfig.create({
        key: 'global_policy',
        max_retry_count: 3,
        high_value_threshold_inr: 50000,
        min_recovery_probability_threshold: 0.3,
        human_escalation_threshold_inr: 50000,
        allowed_actions: ['SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP']
      });
      logger.info('Initialized default PolicyConfig document');
    }

    // 2. Parse CSV dataset
    const csvPath = customCsvPath || path.resolve(__dirname, '../../../data/raw/recoverx_revenue_recovery_dataset_10000.csv');
    logger.info(`Loading CSV data from: ${csvPath}`);
    const transactions = await parseCsvFile(csvPath);

    if (transactions.length === 0) {
      logger.warn('No records found in CSV file.');
      return { insertedCount: 0, totalCount: 0 };
    }

    // 3. Clear existing transactions to prevent duplicate keys on clean seed
    await Transaction.deleteMany({});
    logger.info('Cleared previous Transaction collection');

    // 4. Bulk insert transactions in batches of 1000 for maximum memory efficiency
    const BATCH_SIZE = 1000;
    let insertedCount = 0;

    for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
      const batch = transactions.slice(i, i + BATCH_SIZE);
      const res = await Transaction.insertMany(batch, { ordered: false });
      insertedCount += res.length;
      logger.info(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${insertedCount}/${transactions.length} records)`);
    }

    logger.info(`Seeding complete! Successfully imported ${insertedCount} transactions.`);
    return { insertedCount, totalCount: transactions.length };
  } catch (error) {
    logger.error(`Database seeding failed: ${error.message}`);
    throw error;
  } finally {
    if (require.main === module) {
      await disconnectDB();
    }
  }
}

if (require.main === module) {
  seedDatabase()
    .then(({ insertedCount }) => {
      logger.info(`Seed execution finished successfully. Total records inserted: ${insertedCount}`);
      process.exit(0);
    })
    .catch((err) => {
      logger.error(`Seed execution exited with error: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
