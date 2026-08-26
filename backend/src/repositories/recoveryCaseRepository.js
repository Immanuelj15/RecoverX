const { RecoveryCase } = require('../models');

class RecoveryCaseRepository {
  async createCase(caseData) {
    return RecoveryCase.create(caseData);
  }

  async findByCaseId(merchantId, caseId) {
    return RecoveryCase.findOne({ merchant_id: merchantId, case_id: caseId }).lean();
  }

  async findByPaymentId(merchantId, paymentId) {
    return RecoveryCase.findOne({ merchant_id: merchantId, payment_id: paymentId })
      .sort({ created_at: -1 })
      .lean();
  }

  async updateStatus(merchantId, caseId, status, extraFields = {}) {
    return RecoveryCase.findOneAndUpdate(
      { merchant_id: merchantId, case_id: caseId },
      { $set: { status, ...extraFields } },
      { new: true }
    );
  }
}

module.exports = new RecoveryCaseRepository();
