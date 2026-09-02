const mongoose = require('mongoose');

const promiseToPaySchema = new mongoose.Schema({
  leakageEventId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  promisedAmount: { type: Number, required: true },
  promisedDate: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'FULFILLED', 'MISSED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('PromiseToPay', promiseToPaySchema);
