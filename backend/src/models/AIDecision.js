const mongoose = require('mongoose');

const AIDecisionSchema = new mongoose.Schema(
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
    ml_prediction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MLPrediction'
    },
    agent: {
      name: { type: String, default: 'recoverx_ai_recommender' },
      version: { type: String, default: '1.0.0' }
    },
    context: {
      failure_reason: { type: String, required: true },
      amount_paise: { type: Number, required: true, min: 0 },
      recovery_probability: { type: Number, required: true, min: 0, max: 1 },
      retry_count: { type: Number, default: 0, min: 0 },
      customer_ltv_paise: { type: Number, default: 0, min: 0 }
    },
    recommendation: {
      action: {
        type: String,
        enum: [
          'SMART_RETRY',
          'DELAYED_RETRY',
          'PAYMENT_RECOVERY_NUDGE',
          'HUMAN_ESCALATION',
          'STOP'
        ],
        required: true
      },
      reason: { type: String, required: true },
      confidence: { type: Number, required: true, min: 0, max: 1 }
    },
    requires_human_approval: {
      type: Boolean,
      default: false
    },
    llm_provider: {
      type: String,
      default: 'heuristic_fallback'
    },
    status: {
      type: String,
      enum: ['accepted', 'rejected', 'fallback', 'error'],
      default: 'accepted'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
);

AIDecisionSchema.index({ recovery_case_id: 1, created_at: -1 });

module.exports = mongoose.model('AIDecision', AIDecisionSchema);
