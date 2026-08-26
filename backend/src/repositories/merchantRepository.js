const { Merchant } = require('../models');

class MerchantRepository {
  async getOrCreateDemoMerchant() {
    let merchant = await Merchant.findOne({ merchant_code: 'MERCHANT_DEMO_001' });
    if (!merchant) {
      merchant = await Merchant.create({
        merchant_code: 'MERCHANT_DEMO_001',
        name: 'RecoverX Demo Merchant',
        razorpay_account_id: 'acc_demo_recoverx_2026',
        environment: 'test',
        currency: 'INR',
        status: 'active',
        settings: {
          max_retry_count: 3,
          high_value_threshold_paise: 5000000, // ₹50,000 in paise
          min_auto_recovery_probability: 0.80,
          human_escalation_probability: 0.50,
          allowed_actions: [
            'SMART_RETRY',
            'DELAYED_RETRY',
            'PAYMENT_RECOVERY_NUDGE',
            'HUMAN_ESCALATION',
            'STOP'
          ]
        }
      });
    }
    return merchant;
  }

  async findByCode(merchantCode) {
    return Merchant.findOne({ merchant_code: merchantCode }).lean();
  }

  async updateSettings(merchantId, settings) {
    return Merchant.findByIdAndUpdate(
      merchantId,
      { $set: { settings } },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new MerchantRepository();
