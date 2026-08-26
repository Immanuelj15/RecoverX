const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema(
  {
    merchant_code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    razorpay_account_id: {
      type: String,
      default: 'acc_demo_recoverx_2026'
    },
    environment: {
      type: String,
      enum: ['test', 'production'],
      default: 'test',
      required: true
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    settings: {
      max_retry_count: {
        type: Number,
        default: 3,
        min: 1,
        max: 10
      },
      high_value_threshold_paise: {
        type: Number,
        default: 5000000, // ₹50,000.00 in paise
        min: 0
      },
      min_auto_recovery_probability: {
        type: Number,
        default: 0.80,
        min: 0,
        max: 1
      },
      human_escalation_probability: {
        type: Number,
        default: 0.50,
        min: 0,
        max: 1
      },
      allowed_actions: {
        type: [String],
        default: [
          'SMART_RETRY',
          'DELAYED_RETRY',
          'PAYMENT_RECOVERY_NUDGE',
          'HUMAN_ESCALATION',
          'STOP'
        ]
      }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Merchant', MerchantSchema);
