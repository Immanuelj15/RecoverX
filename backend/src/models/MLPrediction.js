const mongoose = require('mongoose');

const MLPredictionSchema = new mongoose.Schema(
  {
    merchant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true
    },
    recovery_case_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecoveryCase',
      required: true
    },
    payment_id: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      name: { type: String, default: 'recoverx_rf_classifier' },
      version: { type: String, default: '1.0.0' }
    },
    features: {
      amount_paise: { type: Number, required: true, min: 0 },
      payment_method: { type: String, required: true },
      failure_reason: { type: String, required: true },
      previous_successes: { type: Number, default: 0, min: 0 },
      previous_failures: { type: Number, default: 0, min: 0 },
      retry_count: { type: Number, default: 0, min: 0 },
      customer_ltv_paise: { type: Number, default: 0, min: 0 },
      subscription_status: { type: String, default: 'none' }
    },
    prediction: {
      probability: {
        type: Number,
        required: true,
        min: 0,
        max: 1
      },
      risk_band: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        required: true
      }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

// Indexes
MLPredictionSchema.index({ recovery_case_id: 1, created_at: -1 });
MLPredictionSchema.index({ payment_id: 1, created_at: -1 });
MLPredictionSchema.index({ merchant_id: 1, created_at: -1 });

module.exports = mongoose.model('MLPrediction', MLPredictionSchema);
