const { RecoveryAction } = require('../models');

class RecoveryActionRepository {
  async createAction(actionData) {
    return RecoveryAction.create(actionData);
  }

  async findByIdempotencyKey(idempotencyKey) {
    return RecoveryAction.findOne({ idempotency_key: idempotencyKey }).lean();
  }

  async updateStatus(actionId, status, extraFields = {}) {
    return RecoveryAction.findByIdAndUpdate(
      actionId,
      { $set: { status, ...extraFields } },
      { new: true }
    );
  }

  async findByCaseId(merchantId, caseId) {
    return RecoveryAction.find({ merchant_id: merchantId, recovery_case_id: caseId })
      .sort({ created_at: -1 })
      .lean();
  }
}

module.exports = new RecoveryActionRepository();
