const { RecoveryOutcome } = require('../models');

class RecoveryOutcomeRepository {
  async recordOutcome(outcomeData) {
    return RecoveryOutcome.create(outcomeData);
  }

  async findByCaseId(merchantId, caseId) {
    return RecoveryOutcome.findOne({ merchant_id: merchantId, recovery_case_id: caseId }).lean();
  }

  async findByPaymentId(merchantId, paymentId) {
    return RecoveryOutcome.findOne({ merchant_id: merchantId, payment_id: paymentId }).lean();
  }
}

module.exports = new RecoveryOutcomeRepository();
