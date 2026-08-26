const { Payment } = require('../models');

class PaymentRepository {
  async createPayment(paymentData) {
    return Payment.create(paymentData);
  }

  async findByPaymentId(merchantId, paymentId) {
    return Payment.findOne({ merchant_id: merchantId, payment_id: paymentId }).lean();
  }

  async updateStatus(merchantId, paymentId, status, extraFields = {}) {
    return Payment.findOneAndUpdate(
      { merchant_id: merchantId, payment_id: paymentId },
      { $set: { status, ...extraFields } },
      { new: true }
    );
  }

  async incrementRetryCount(merchantId, paymentId) {
    return Payment.findOneAndUpdate(
      { merchant_id: merchantId, payment_id: paymentId },
      { $inc: { 'history.retry_count': 1 } },
      { new: true }
    );
  }
}

module.exports = new PaymentRepository();
