const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const leakageEventSchema = new mongoose.Schema({
  id: {
    type: String,
    default: randomUUID,
    unique: true,
    index: true
  },
  channel: {
    type: String,
    enum: [
      'PAYMENT_DEGRADATION',
      'CHECKOUT_ABANDONED',
      'CHECKOUT_DROPOFF',
      'FAILED_SUBSCRIPTION',
      'OVERDUE_INVOICE',
      'B2B_RECEIVABLES',
      'MANDATE_RETRY',
      'PROMISE_TO_PAY'
    ],
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String
  },
  customerPhone: {
    type: String
  },
  riskAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['INR', 'USD'],
    default: 'INR'
  },
  declineReasonCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['DETECTED', 'IN_PROGRESS', 'RECOVERED', 'ESCALATED', 'HALTED'],
    default: 'DETECTED'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LeakageEvent', leakageEventSchema);
