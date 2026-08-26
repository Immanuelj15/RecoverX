const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    merchant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true
    },
    customer_id: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      trim: true,
      default: 'Valued Customer'
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    customer_ltv_paise: {
      type: Number,
      default: 0,
      min: 0
    },
    stats: {
      total_payments: { type: Number, default: 0, min: 0 },
      successful_payments: { type: Number, default: 0, min: 0 },
      failed_payments: { type: Number, default: 0, min: 0 },
      total_recovered_paise: { type: Number, default: 0, min: 0 }
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Compound Unique Index: customer_id is unique per merchant
CustomerSchema.index({ merchant_id: 1, customer_id: 1 }, { unique: true });
CustomerSchema.index({ merchant_id: 1, created_at: -1 });

module.exports = mongoose.model('Customer', CustomerSchema);
