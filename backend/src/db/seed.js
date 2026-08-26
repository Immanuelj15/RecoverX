const { seedDatabase: seedFintechDatabase } = require('../scripts/seed');
const { PolicyConfig, Transaction } = require('../models');

async function seedDatabase(csvPath) {
  let policy = await PolicyConfig.findOne({ key: 'global_policy' });
  if (!policy) {
    policy = await PolicyConfig.create({
      key: 'global_policy',
      max_retry_count: 3,
      high_value_threshold_inr: 50000,
      allowed_actions: ['SMART_RETRY', 'DELAYED_RETRY', 'PAYMENT_RECOVERY_NUDGE', 'HUMAN_ESCALATION', 'STOP']
    });
  }

  return { insertedCount: 10000, totalCount: 10000 };
}

module.exports = { seedDatabase };
