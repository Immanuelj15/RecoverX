const { PolicyConfig } = require('../models');

class PolicyRepository {
  async getGlobalPolicy() {
    let policy = await PolicyConfig.findOne({ key: 'global_policy' });
    if (!policy) {
      policy = await PolicyConfig.create({
        key: 'global_policy',
        max_retry_count: 3,
        high_value_threshold_inr: 50000,
        min_recovery_probability_threshold: 0.3,
        human_escalation_threshold_inr: 50000,
        allowed_actions: [
          'SMART_RETRY',
          'DELAYED_RETRY',
          'PAYMENT_RECOVERY_NUDGE',
          'HUMAN_ESCALATION',
          'STOP'
        ]
      });
    }
    return policy;
  }

  async updateGlobalPolicy(newConfig) {
    return PolicyConfig.findOneAndUpdate(
      { key: 'global_policy' },
      {
        $set: {
          ...newConfig,
          updated_at: new Date()
        }
      },
      { new: true, upsert: true, runValidators: true }
    );
  }
}

module.exports = new PolicyRepository();
