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

  async getRecoveryStats(merchantId) {
    const stats = await RecoveryCase.aggregate([
      { $match: { merchant_id: merchantId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total_recovered: {
            $sum: {
              $cond: [{ $eq: ['$status', 'RESOLVED_RECOVERED'] }, '$amount_paise', 0]
            }
          },
          total_lost: {
            $sum: {
              $cond: [{ $eq: ['$status', 'CLOSED_UNRECOVERABLE'] }, '$amount_paise', 0]
            }
          }
        }
      }
    ]);

    let total_recovered_paise = 0;
    let total_lost_paise = 0;

    stats.forEach((row) => {
      total_recovered_paise += row.total_recovered || 0;
      total_lost_paise += row.total_lost || 0;
    });

    return { total_recovered_paise, total_lost_paise };
  }
}

module.exports = new RecoveryCaseRepository();
