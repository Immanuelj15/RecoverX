const { AuditLog } = require('../models');

class AuditRepository {
  async createLog(logData) {
    return AuditLog.create({
      ...logData,
      timestamp: logData.timestamp || new Date()
    });
  }

  async findByCaseId(merchantId, caseId) {
    return AuditLog.find({ merchant_id: merchantId, recovery_case_id: caseId })
      .sort({ timestamp: 1 })
      .lean();
  }

  async findByPaymentId(merchantId, paymentId) {
    return AuditLog.find({ merchant_id: merchantId, payment_id: paymentId })
      .sort({ timestamp: 1 })
      .lean();
  }
}

module.exports = new AuditRepository();
